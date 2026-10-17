import "server-only";
import { db } from "@/lib/db";
import {
  addDaysToTashkentString,
  tashkentDateString,
  tashkentDayRangeUtc,
  tashkentWeekdayIndex,
} from "@/lib/streak";

export interface DailyTopic {
  id: string;
  code: string;
  name: string;
}

export async function pickDailyTopic(): Promise<DailyTopic | null> {
  const sections = await db.section.findMany({
    where: { isOpen: true },
    orderBy: { order: "asc" },
    include: { topics: { orderBy: { order: "asc" } } },
  });

  for (const section of sections) {
    for (const topic of section.topics) {
      const count = await db.question.count({
        where: { topicId: topic.id, isPublished: true },
      });
      if (count > 0) return { id: topic.id, code: topic.code, name: topic.name };
    }
  }
  return null;
}

export async function countTodayAttempts(userId: string): Promise<number> {
  const { start, end } = tashkentDayRangeUtc(tashkentDateString(new Date()));
  return db.attempt.count({ where: { userId, createdAt: { gte: start, lt: end } } });
}

/** 7 booleans, Monday through Sunday of the current Tashkent week, true where the user was active. */
export async function getWeekActivity(userId: string, now: Date = new Date()): Promise<boolean[]> {
  const todayStr = tashkentDateString(now);
  const mondayStr = addDaysToTashkentString(todayStr, -tashkentWeekdayIndex(now));
  const sundayStr = addDaysToTashkentString(mondayStr, 6);

  const { start } = tashkentDayRangeUtc(mondayStr);
  const { end } = tashkentDayRangeUtc(sundayStr);

  const attempts = await db.attempt.findMany({
    where: { userId, createdAt: { gte: start, lt: end } },
    select: { createdAt: true },
  });
  const activeDays = new Set(attempts.map((attempt) => tashkentDateString(attempt.createdAt)));

  return Array.from({ length: 7 }, (_, i) => activeDays.has(addDaysToTashkentString(mondayStr, i)));
}
