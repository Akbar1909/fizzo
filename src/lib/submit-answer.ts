import "server-only";
import { db } from "@/lib/db";
import { checkAnswer } from "@/lib/check-answer";
import { recordAttempt } from "@/lib/attempts";
import { buildFeedback } from "@/lib/questions";
import { getQuestionStats } from "@/lib/social";
import type { AnswerFeedback, QuestionAnswer } from "@/lib/content-types";
import type { Prisma } from "@/generated/prisma/client";

export class QuestionNotFoundError extends Error {
  constructor() {
    super("Savol topilmadi.");
  }
}

export interface SubmitAnswerParams {
  userId: string;
  questionId: string;
  response: Prisma.InputJsonValue;
  timeMs?: number;
  mockSessionId?: string;
}

export async function submitAnswer(params: SubmitAnswerParams): Promise<AnswerFeedback> {
  const question = await db.question.findFirst({
    where: { id: params.questionId, isPublished: true },
  });
  if (!question) throw new QuestionNotFoundError();

  const { isCorrect, partResults } = checkAnswer(
    question.type,
    question.answer as unknown as QuestionAnswer,
    params.response,
  );

  await recordAttempt({
    userId: params.userId,
    questionId: question.id,
    response: params.response,
    isCorrect,
    timeMs: params.timeMs,
    mockSessionId: params.mockSessionId,
  });

  const feedback = buildFeedback(question, params.response, isCorrect, partResults);

  if (!params.mockSessionId) {
    const stats = await getQuestionStats(question.id, question.type);
    if (stats) feedback.stats = stats;
  }

  return feedback;
}
