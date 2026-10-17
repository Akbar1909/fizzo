import "server-only";
import { db } from "@/lib/db";
import { tashkentDateString, tashkentDayRangeUtc, tashkentWeekRangeUtc } from "@/lib/streak";

/** Below this many active users today, the live counter is misleading — show a content fact instead. */
export const LIVE_COUNT_MIN_THRESHOLD = 20;

export async function getTodayActiveCount(): Promise<number> {
  const { start, end } = tashkentDayRangeUtc(tashkentDateString(new Date()));
  const rows = await db.attempt.findMany({
    where: { createdAt: { gte: start, lt: end } },
    distinct: ["userId"],
    select: { userId: true },
  });
  return rows.length;
}

const CONTENT_FACTS = [
  "Yorug'lik tezligi — sekundiga 300 000 km.",
  "Nyutonning uchinchi qonuni: har bir ta'sirga teng va qarama-qarshi aks ta'sir mavjud.",
  "Fizika bo'yicha Milliy sertifikat imtihoni 150 daqiqa davom etadi.",
  "Termodinamikaning ikkinchi qonuniga ko'ra, issiqlik har doim issiqdan sovuqqa qarab oqadi.",
  "1 kaloriya — 1 gramm suvni 1 gradusga isitish uchun kerak bo'lgan energiya miqdori.",
  "Og'irlik kuchi tezlanishi Yerda taxminan 9,8 m/s², hisob-kitoblarda odatda 10 m/s² olinadi.",
];

export function getRandomContentFact(): string {
  return CONTENT_FACTS[Math.floor(Math.random() * CONTENT_FACTS.length)];
}

function formatDisplayName(firstName: string, lastName: string | null): string {
  const initial = lastName ? ` ${lastName.charAt(0).toUpperCase()}.` : "";
  return `${firstName}${initial}`;
}

export interface ActivityFeedEntry {
  displayName: string;
  topicName: string;
  correct: number;
  total: number;
  minutesAgo: number;
}

interface ActivityGroup {
  userId: string;
  topicId: string;
  topicName: string;
  firstName: string;
  lastName: string | null;
  correct: number;
  total: number;
  earliest: Date;
  latest: Date;
}

const SESSION_GAP_MS = 10 * 60 * 1000;

/** Recent attempts from other users, grouped into approximate practice "sessions" per user+topic, most recent first. */
export async function getActivityFeed(excludeUserId: string, limit = 8): Promise<ActivityFeedEntry[]> {
  const since = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const attempts = await db.attempt.findMany({
    where: { createdAt: { gte: since }, user: { shareActivity: true }, userId: { not: excludeUserId } },
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      createdAt: true,
      isCorrect: true,
      userId: true,
      user: { select: { firstName: true, lastName: true } },
      question: { select: { topicId: true, topic: { select: { name: true } } } },
    },
  });

  const groups: ActivityGroup[] = [];
  for (const a of attempts) {
    const topicId = a.question.topicId;
    const group = groups.find(
      (g) => g.userId === a.userId && g.topicId === topicId && g.earliest.getTime() - a.createdAt.getTime() <= SESSION_GAP_MS,
    );
    if (group) {
      group.total += 1;
      if (a.isCorrect) group.correct += 1;
      if (a.createdAt < group.earliest) group.earliest = a.createdAt;
      if (a.createdAt > group.latest) group.latest = a.createdAt;
    } else {
      groups.push({
        userId: a.userId,
        topicId,
        topicName: a.question.topic.name,
        firstName: a.user.firstName,
        lastName: a.user.lastName,
        correct: a.isCorrect ? 1 : 0,
        total: 1,
        earliest: a.createdAt,
        latest: a.createdAt,
      });
    }
  }

  const latestPerUser = new Map<string, ActivityGroup>();
  for (const g of groups) {
    const existing = latestPerUser.get(g.userId);
    if (!existing || g.latest > existing.latest) latestPerUser.set(g.userId, g);
  }

  const now = Date.now();
  return Array.from(latestPerUser.values())
    .sort((a, b) => b.latest.getTime() - a.latest.getTime())
    .slice(0, limit)
    .map((g) => ({
      displayName: formatDisplayName(g.firstName, g.lastName),
      topicName: g.topicName,
      correct: g.correct,
      total: g.total,
      minutesAgo: Math.max(0, Math.round((now - g.latest.getTime()) / 60_000)),
    }));
}

const XP_BY_DIFFICULTY: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  xp: number;
  photoUrl: string | null;
}

export interface WeeklyLeaderboard {
  top: LeaderboardEntry[];
  you: { rank: number; xp: number } | null;
}

export async function getWeeklyLeaderboard(currentUserId: string, limit = 10): Promise<WeeklyLeaderboard> {
  const { start, end } = tashkentWeekRangeUtc(new Date());
  const attempts = await db.attempt.findMany({
    where: { createdAt: { gte: start, lt: end }, isCorrect: true },
    select: { userId: true, question: { select: { difficulty: true } } },
  });

  const xpByUser = new Map<string, number>();
  for (const a of attempts) {
    const xp = XP_BY_DIFFICULTY[a.question.difficulty] ?? 1;
    xpByUser.set(a.userId, (xpByUser.get(a.userId) ?? 0) + xp);
  }

  const ranked = Array.from(xpByUser.entries()).sort((a, b) => b[1] - a[1]);
  const userIds = ranked.map(([id]) => id);

  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, photoUrl: true, shareActivity: true },
  });
  const userById = new Map(users.map((u) => [u.id, u]));

  const top: LeaderboardEntry[] = ranked
    .filter(([id]) => userById.get(id)?.shareActivity !== false)
    .slice(0, limit)
    .map(([id, xp]) => {
      const u = userById.get(id)!;
      return { userId: id, displayName: formatDisplayName(u.firstName, u.lastName), xp, photoUrl: u.photoUrl };
    });

  const yourIndex = ranked.findIndex(([id]) => id === currentUserId);
  const you = yourIndex >= 0 ? { rank: yourIndex + 1, xp: ranked[yourIndex][1] } : null;

  return { top, you };
}

const XP_PER_LEVEL = 100;

/** All-time XP: 1/2/3 points per correct answer for Easy/Medium/Hard. */
export async function getUserTotalXp(userId: string): Promise<number> {
  const attempts = await db.attempt.findMany({
    where: { userId, isCorrect: true },
    select: { question: { select: { difficulty: true } } },
  });
  return attempts.reduce((sum, a) => sum + (XP_BY_DIFFICULTY[a.question.difficulty] ?? 1), 0);
}

/** A simple level derived from total XP: level 1 starts at 0 XP, one level per 100 XP. */
export function getLevel(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

const QUESTION_STATS_MIN_SAMPLE = 5;

export interface QuestionStats {
  accuracyPercent: number;
  mostCommonAnswer?: string;
  totalAttempts: number;
}

export async function getQuestionStats(
  questionId: string,
  type: "Y1" | "Y2" | "O",
): Promise<QuestionStats | null> {
  const attempts = await db.attempt.findMany({
    where: { questionId },
    select: { isCorrect: true, response: true },
  });
  if (attempts.length < QUESTION_STATS_MIN_SAMPLE) return null;

  const correct = attempts.filter((a) => a.isCorrect).length;
  const accuracyPercent = Math.round((correct / attempts.length) * 100);

  let mostCommonAnswer: string | undefined;
  if (type === "Y1") {
    const counts = new Map<string, number>();
    for (const a of attempts) {
      const key = typeof a.response === "string" ? a.response : null;
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    let bestCount = 0;
    for (const [key, count] of counts) {
      if (count > bestCount) {
        bestCount = count;
        mostCommonAnswer = key;
      }
    }
  }

  return { accuracyPercent, mostCommonAnswer, totalAttempts: attempts.length };
}
