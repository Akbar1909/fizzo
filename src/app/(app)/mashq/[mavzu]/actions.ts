"use server";

import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { submitAnswer } from "@/lib/submit-answer";
import type { Prisma } from "@/generated/prisma/client";
import type { AnswerFeedback } from "@/lib/content-types";

const inputSchema = z.object({
  questionId: z.string().min(1),
  response: z.unknown(),
  timeMs: z.number().int().nonnegative().optional(),
});

export async function checkAnswerAction(input: unknown): Promise<AnswerFeedback> {
  const user = await requireUser();

  if (!rateLimit(`check-answer:${user.id}`, { capacity: 60, refillPerSecond: 1 })) {
    throw new Error("Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring.");
  }

  const parsed = inputSchema.parse(input);

  return submitAnswer({
    userId: user.id,
    questionId: parsed.questionId,
    response: parsed.response as Prisma.InputJsonValue,
    timeMs: parsed.timeMs,
  });
}
