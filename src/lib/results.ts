import "server-only";
import { db } from "@/lib/db";
import { getMockLabel } from "@/lib/mock";

export interface TopicAccuracy {
  id: string;
  code: string;
  name: string;
  attempts: number;
  correct: number;
  accuracy: number;
}

export interface ResultsSummary {
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  topics: TopicAccuracy[];
  weakTopics: TopicAccuracy[];
}

export async function getResultsSummary(userId: string): Promise<ResultsSummary> {
  const attempts = await db.attempt.findMany({
    where: { userId },
    select: {
      isCorrect: true,
      question: { select: { topic: { select: { id: true, code: true, name: true } } } },
    },
  });

  const byTopic = new Map<string, TopicAccuracy>();
  let totalCorrect = 0;

  for (const attempt of attempts) {
    const topic = attempt.question.topic;
    const entry = byTopic.get(topic.id) ?? {
      id: topic.id,
      code: topic.code,
      name: topic.name,
      attempts: 0,
      correct: 0,
      accuracy: 0,
    };
    entry.attempts += 1;
    if (attempt.isCorrect) {
      entry.correct += 1;
      totalCorrect += 1;
    }
    byTopic.set(topic.id, entry);
  }

  const topics = Array.from(byTopic.values())
    .map((t) => ({ ...t, accuracy: t.attempts > 0 ? t.correct / t.attempts : 0 }))
    .sort((a, b) => a.code.localeCompare(b.code));

  const weakTopics = [...topics]
    .filter((t) => t.attempts >= 3)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return {
    totalAttempts: attempts.length,
    totalCorrect,
    accuracy: attempts.length > 0 ? totalCorrect / attempts.length : 0,
    topics,
    weakTopics,
  };
}

export interface MockHistoryEntry {
  id: string;
  label: string;
  startedAt: Date;
  finishedAt: Date | null;
  score: number;
  total: number;
}

export async function getMockHistory(userId: string): Promise<MockHistoryEntry[]> {
  const sessions = await db.mockSession.findMany({
    where: { userId, finishedAt: { not: null } },
    orderBy: { startedAt: "desc" },
    take: 10,
    include: { attempts: { select: { isCorrect: true } } },
  });

  return sessions.map((session) => ({
    id: session.id,
    label: getMockLabel(session),
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    score: session.attempts.filter((a) => a.isCorrect).length,
    total: session.questionIds.length,
  }));
}
