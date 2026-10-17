import "server-only";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { nextStreak } from "@/lib/streak";
import { dbDateToTashkentString, tashkentStringToDbDate } from "@/lib/db-date";

export interface RecordAttemptInput {
  userId: string;
  questionId: string;
  response: Prisma.InputJsonValue;
  isCorrect: boolean;
  timeMs?: number;
  mockSessionId?: string;
}

export async function recordAttempt(input: RecordAttemptInput): Promise<void> {
  const user = await db.user.findUniqueOrThrow({ where: { id: input.userId } });

  const previousLastActiveOn = dbDateToTashkentString(user.lastActiveOn);
  const streakState = nextStreak(
    { streak: user.streak, bestStreak: user.bestStreak, lastActiveOn: previousLastActiveOn },
    new Date(),
  );
  const streakChanged = streakState.lastActiveOn !== previousLastActiveOn;

  await db.$transaction([
    db.attempt.create({
      data: {
        userId: input.userId,
        questionId: input.questionId,
        response: input.response,
        isCorrect: input.isCorrect,
        timeMs: input.timeMs,
        mockSessionId: input.mockSessionId,
      },
    }),
    ...(streakChanged
      ? [
          db.user.update({
            where: { id: input.userId },
            data: {
              streak: streakState.streak,
              bestStreak: streakState.bestStreak,
              lastActiveOn: tashkentStringToDbDate(streakState.lastActiveOn as string),
            },
          }),
        ]
      : []),
  ]);
}
