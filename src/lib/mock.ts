import "server-only";
import { db } from "@/lib/db";
import { checkAnswer } from "@/lib/check-answer";
import { toPublicQuestion } from "@/lib/questions";
import type { PublicQuestion, QuestionAnswer, QuestionSolution } from "@/lib/content-types";
import { Prisma, type MockSession, type Question } from "@/generated/prisma/client";

function json(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export const MOCK_TOTAL_QUESTIONS = 45;
export const QUICK_MOCK_TOTAL_QUESTIONS = 20;

export const SECTION_COMPOSITION: { sectionCode: string; y1: number; o: number }[] = [
  { sectionCode: "1", y1: 10, o: 3 },
  { sectionCode: "2", y1: 5, o: 2 },
  { sectionCode: "3", y1: 10, o: 2 },
  { sectionCode: "4", y1: 3, o: 2 },
  { sectionCode: "5", y1: 3, o: 1 },
];
const LOGIC_Y1_COUNT = 1;
const MATCHING_Y2_COUNT = 3;

/** Minutes per question in the official mock (150 min / 45 savol), reused to size the shorter modes. */
const MINUTES_PER_QUESTION = 150 / 45;

function durationMsFor(totalQuestions: number): number {
  const minutes = Math.round((totalQuestions * MINUTES_PER_QUESTION) / 5) * 5;
  return minutes * 60 * 1000;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

interface Picked {
  y1: Question[];
  y2: Question[];
  o: Question[];
  shortBank: boolean;
}

interface DrawRow {
  /** Omit to draw from every open section. */
  sectionCode?: string;
  y1: number;
  y2: number;
  o: number;
}

async function pickQuestions(rows: DrawRow[]): Promise<Picked> {
  const allPublished = await db.question.findMany({
    where: { isPublished: true },
    include: { topic: { include: { section: true } } },
  });

  const used = new Set<string>();
  const y1: Question[] = [];
  const y2: Question[] = [];
  const o: Question[] = [];
  let shortBank = false;

  function takeFrom(pool: Question[], count: number): Question[] {
    const available = shuffle(pool.filter((q) => !used.has(q.id)));
    const taken = available.slice(0, count);
    for (const q of taken) used.add(q.id);
    if (taken.length < count) shortBank = true;
    return taken;
  }

  for (const row of rows) {
    const pool = row.sectionCode ? allPublished.filter((q) => q.topic.section.code === row.sectionCode) : allPublished;
    y1.push(...takeFrom(pool.filter((q) => q.type === "Y1"), row.y1));
    y2.push(...takeFrom(pool.filter((q) => q.type === "Y2"), row.y2));
    o.push(...takeFrom(pool.filter((q) => q.type === "O"), row.o));
  }

  const targetTotal = rows.reduce((sum, r) => sum + r.y1 + r.y2 + r.o, 0);
  const currentTotal = y1.length + y2.length + o.length;
  if (currentTotal < targetTotal) {
    const fillers = takeFrom(allPublished, targetTotal - currentTotal);
    for (const q of fillers) {
      if (q.type === "Y1") y1.push(q);
      else if (q.type === "Y2") y2.push(q);
      else o.push(q);
    }
  }

  return { y1, y2, o, shortBank };
}

async function createSessionFromRows(
  userId: string,
  rows: DrawRow[],
  label: string,
  durationMsOverride?: number,
): Promise<MockSession> {
  const { y1, y2, o, shortBank } = await pickQuestions(rows);
  const orderedIds = [...y1, ...y2, ...o].map((q) => q.id);
  const totalQuestions = rows.reduce((sum, r) => sum + r.y1 + r.y2 + r.o, 0);

  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + (durationMsOverride ?? durationMsFor(totalQuestions)));

  return db.mockSession.create({
    data: {
      userId,
      questionIds: orderedIds,
      startedAt,
      endsAt,
      answers: json({ shortBank, label }),
    },
  });
}

/** The official exam format: 45 savol, 150 daqiqa, rasmiy bo'lim taqsimoti. */
export async function createFullMockSession(userId: string): Promise<MockSession> {
  const rows: DrawRow[] = [
    ...SECTION_COMPOSITION.map((c) => ({ sectionCode: c.sectionCode, y1: c.y1, y2: 0, o: c.o })),
    { y1: LOGIC_Y1_COUNT, y2: MATCHING_Y2_COUNT, o: 0 },
  ];
  return createSessionFromRows(userId, rows, "To'liq mock");
}

const QUICK_MOCK_DURATION_MS = 30 * 60 * 1000;

/** A short, loosely-mixed practice mock drawn from every open section — faster-paced than the official exam. */
export async function createQuickMockSession(userId: string): Promise<MockSession> {
  const rows: DrawRow[] = [{ y1: 15, y2: 2, o: 3 }];
  return createSessionFromRows(userId, rows, "Tezkor aralash mock", QUICK_MOCK_DURATION_MS);
}

/** A mock scoped to a single section, using that section's own official quota. */
export async function createSectionMockSession(userId: string, sectionCode: string): Promise<MockSession> {
  const section = await db.section.findUniqueOrThrow({ where: { code: sectionCode } });
  const comp = SECTION_COMPOSITION.find((c) => c.sectionCode === sectionCode);
  if (!comp) throw new Error(`No mock composition defined for section ${sectionCode}`);

  const rows: DrawRow[] = [{ sectionCode, y1: comp.y1, y2: 1, o: comp.o }];
  return createSessionFromRows(userId, rows, `${section.code}-bo'lim: ${section.name}`);
}

export function getMockLabel(session: MockSession): string {
  const answers = session.answers as Record<string, unknown>;
  return typeof answers.label === "string" ? answers.label : "To'liq mock";
}

export async function getActiveMockSession(userId: string): Promise<MockSession | null> {
  const session = await db.mockSession.findFirst({
    where: { userId, finishedAt: null },
    orderBy: { startedAt: "desc" },
  });
  if (!session) return null;

  if (session.endsAt.getTime() <= Date.now()) {
    return finishMockSession(session.id, userId);
  }
  return session;
}

export async function getMockSessionForUser(id: string, userId: string): Promise<MockSession | null> {
  return db.mockSession.findFirst({ where: { id, userId } });
}

export async function getOrderedPublicQuestions(questionIds: string[]): Promise<PublicQuestion[]> {
  const questions = await db.question.findMany({
    where: { id: { in: questionIds } },
    include: { topic: { include: { section: true } } },
  });
  const byId = new Map(questions.map((q) => [q.id, q]));
  return questionIds
    .map((id) => byId.get(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q))
    .map((q) => toPublicQuestion(q, q.topic.section.name));
}

export function wasFilledFromOtherSections(session: MockSession): boolean {
  const answers = session.answers as Record<string, unknown>;
  return Boolean(answers.shortBank);
}

export async function saveMockAnswer(
  sessionId: string,
  userId: string,
  questionId: string,
  response: unknown,
): Promise<MockSession | null> {
  const session = await getMockSessionForUser(sessionId, userId);
  if (!session || session.finishedAt || session.endsAt.getTime() <= Date.now()) return null;
  if (!session.questionIds.includes(questionId)) return null;

  const answers = { ...(session.answers as Record<string, unknown>), [questionId]: response };
  return db.mockSession.update({ where: { id: sessionId }, data: { answers: json(answers) } });
}

export async function toggleMockFlag(
  sessionId: string,
  userId: string,
  questionId: string,
): Promise<MockSession | null> {
  const session = await getMockSessionForUser(sessionId, userId);
  if (!session || session.finishedAt) return null;

  const flagged = session.flagged.includes(questionId)
    ? session.flagged.filter((id) => id !== questionId)
    : [...session.flagged, questionId];

  return db.mockSession.update({ where: { id: sessionId }, data: { flagged } });
}

export async function finishMockSession(sessionId: string, userId: string): Promise<MockSession> {
  const session = await db.mockSession.findFirstOrThrow({ where: { id: sessionId, userId } });
  if (session.finishedAt) return session;

  const questions = await db.question.findMany({ where: { id: { in: session.questionIds } } });
  const answers = session.answers as Record<string, unknown>;

  const attemptsData = questions
    .filter((q) => answers[q.id] !== undefined)
    .map((q) => {
      const { isCorrect } = checkAnswer(q.type, q.answer as unknown as QuestionAnswer, answers[q.id]);
      return {
        userId,
        questionId: q.id,
        mockSessionId: session.id,
        response: json(answers[q.id]),
        isCorrect,
      };
    });

  await db.$transaction([
    db.attempt.createMany({ data: attemptsData }),
    db.mockSession.update({ where: { id: session.id }, data: { finishedAt: new Date() } }),
  ]);

  return db.mockSession.findUniqueOrThrow({ where: { id: session.id } });
}

export interface MockReviewItem {
  question: PublicQuestion;
  correctAnswer: QuestionAnswer;
  solution: QuestionSolution;
  userResponse: unknown;
  isCorrect: boolean;
  partResults?: Record<string, boolean>;
}

export interface MockSectionStat {
  code: string;
  name: string;
  correct: number;
  total: number;
}

export interface MockTopicStat extends MockSectionStat {
  accuracy: number;
}

export interface MockReview {
  sessionId: string;
  label: string;
  score: number;
  total: number;
  startedAt: Date;
  finishedAt: Date;
  bySection: MockSectionStat[];
  weakTopics: MockTopicStat[];
  items: MockReviewItem[];
}

export async function getMockReview(sessionId: string, userId: string): Promise<MockReview | null> {
  const session = await db.mockSession.findFirst({ where: { id: sessionId, userId } });
  if (!session || !session.finishedAt) return null;

  const questions = await db.question.findMany({
    where: { id: { in: session.questionIds } },
    include: { topic: { include: { section: true } } },
  });
  const byId = new Map(questions.map((q) => [q.id, q]));
  const answers = session.answers as Record<string, unknown>;

  const sectionStats = new Map<string, MockSectionStat>();
  const topicStats = new Map<string, MockSectionStat>();
  const items: MockReviewItem[] = [];
  let score = 0;

  for (const id of session.questionIds) {
    const q = byId.get(id);
    if (!q) continue;

    const response = answers[id];
    const correctAnswer = q.answer as unknown as QuestionAnswer;
    const { isCorrect, partResults } = checkAnswer(q.type, correctAnswer, response);
    if (isCorrect) score += 1;

    const sKey = q.topic.section.code;
    const sEntry = sectionStats.get(sKey) ?? { code: sKey, name: q.topic.section.name, correct: 0, total: 0 };
    sEntry.total += 1;
    if (isCorrect) sEntry.correct += 1;
    sectionStats.set(sKey, sEntry);

    const tKey = q.topic.code;
    const tEntry = topicStats.get(tKey) ?? { code: tKey, name: q.topic.name, correct: 0, total: 0 };
    tEntry.total += 1;
    if (isCorrect) tEntry.correct += 1;
    topicStats.set(tKey, tEntry);

    items.push({
      question: toPublicQuestion(q, q.topic.section.name),
      correctAnswer,
      solution: q.solution as unknown as QuestionSolution,
      userResponse: response,
      isCorrect,
      partResults,
    });
  }

  const weakTopics = Array.from(topicStats.values())
    .map((t) => ({ ...t, accuracy: t.total > 0 ? t.correct / t.total : 0 }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return {
    sessionId: session.id,
    label: getMockLabel(session),
    score,
    total: session.questionIds.length,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    bySection: Array.from(sectionStats.values()).sort((a, b) => a.code.localeCompare(b.code)),
    weakTopics,
    items,
  };
}
