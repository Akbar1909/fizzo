import "server-only";
import { db } from "@/lib/db";
import { toPublicQuestion } from "@/lib/questions";
import type { PublicQuestion } from "@/lib/content-types";

const DIFFICULTY_ORDER: Record<string, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Never-attempted questions first, then those last answered wrong, then the rest.
 * Shuffled within each group, capped at `limit`, then ordered easy to hard.
 */
export async function selectPracticeQuestions(
  topicId: string,
  userId: string,
  limit = 10,
): Promise<PublicQuestion[]> {
  const questions = await db.question.findMany({
    where: { topicId, isPublished: true },
    include: { topic: true },
  });
  if (questions.length === 0) return [];

  const attempts = await db.attempt.findMany({
    where: { userId, question: { topicId } },
    orderBy: { createdAt: "desc" },
    select: { questionId: true, isCorrect: true },
  });

  const lastResultByQuestion = new Map<string, boolean>();
  for (const attempt of attempts) {
    if (!lastResultByQuestion.has(attempt.questionId)) {
      lastResultByQuestion.set(attempt.questionId, attempt.isCorrect);
    }
  }

  const neverAttempted = [];
  const lastWrong = [];
  const rest = [];
  for (const question of questions) {
    const lastResult = lastResultByQuestion.get(question.id);
    if (lastResult === undefined) neverAttempted.push(question);
    else if (lastResult === false) lastWrong.push(question);
    else rest.push(question);
  }

  const ordered = [...shuffle(neverAttempted), ...shuffle(lastWrong), ...shuffle(rest)].slice(
    0,
    limit,
  );
  ordered.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);

  return ordered.map((question) => toPublicQuestion(question));
}
