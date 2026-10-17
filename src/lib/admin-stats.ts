import "server-only";
import { db } from "@/lib/db";
import { tashkentDateString, addDaysToTashkentString, tashkentDayRangeUtc, tashkentWeekRangeUtc } from "@/lib/streak";
import { tashkentStringToDbDate } from "@/lib/db-date";

export interface DailySignups {
  dateStr: string;
  count: number;
}

export interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  activeStreakUsers: number;
  totalAttempts: number;
  correctAttempts: number;
  totalQuestions: number;
  pendingReviews: number;
  totalMockSessions: number;
  last7Days: DailySignups[];
}

export async function getDashboardStats(now: Date = new Date()): Promise<DashboardStats> {
  const todayStr = tashkentDateString(now);
  const todayRange = tashkentDayRangeUtc(todayStr);
  const weekRange = tashkentWeekRangeUtc(now);
  const yesterdayStr = addDaysToTashkentString(todayStr, -1);
  const streakCutoff = tashkentStringToDbDate(yesterdayStr);

  const last7DayStrings = Array.from({ length: 7 }, (_, i) => addDaysToTashkentString(todayStr, i - 6));

  const [
    totalUsers,
    newUsersToday,
    newUsersThisWeek,
    activeStreakUsers,
    totalAttempts,
    correctAttempts,
    totalQuestions,
    pendingReviews,
    totalMockSessions,
    last7DaysCounts,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: todayRange.start, lt: todayRange.end } } }),
    db.user.count({ where: { createdAt: { gte: weekRange.start, lt: weekRange.end } } }),
    db.user.count({ where: { streak: { gt: 0 }, lastActiveOn: { gte: streakCutoff } } }),
    db.attempt.count(),
    db.attempt.count({ where: { isCorrect: true } }),
    db.question.count({ where: { isPublished: true } }),
    db.review.count({ where: { status: "PENDING" } }),
    db.mockSession.count(),
    Promise.all(
      last7DayStrings.map((dateStr) => {
        const { start, end } = tashkentDayRangeUtc(dateStr);
        return db.user.count({ where: { createdAt: { gte: start, lt: end } } });
      }),
    ),
  ]);

  return {
    totalUsers,
    newUsersToday,
    newUsersThisWeek,
    activeStreakUsers,
    totalAttempts,
    correctAttempts,
    totalQuestions,
    pendingReviews,
    totalMockSessions,
    last7Days: last7DayStrings.map((dateStr, i) => ({ dateStr, count: last7DaysCounts[i] })),
  };
}
