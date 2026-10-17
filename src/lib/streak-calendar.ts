import "server-only";
import { db } from "@/lib/db";
import { tashkentDateString, tashkentDayRangeUtc } from "@/lib/streak";

export interface StreakCalendarDay {
  date: string; // "YYYY-MM-DD"
  dayOfMonth: number;
  active: boolean;
  isToday: boolean;
  isFuture: boolean;
}

/** All days of the current Tashkent month, with activity flags, for a calendar widget. */
export async function getMonthStreakCalendar(
  userId: string,
  now: Date = new Date(),
): Promise<StreakCalendarDay[]> {
  const todayStr = tashkentDateString(now);
  const [year, month] = todayStr.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = `${year}-${String(month).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;
  const { start } = tashkentDayRangeUtc(firstDay);
  const { end } = tashkentDayRangeUtc(lastDay);
  const endInclusive = new Date(end.getTime());

  const attempts = await db.attempt.findMany({
    where: { userId, createdAt: { gte: start, lt: endInclusive } },
    select: { createdAt: true },
  });
  const activeDays = new Set(attempts.map((a) => tashkentDateString(a.createdAt)));

  return Array.from({ length: daysInMonth }, (_, i) => {
    const dayOfMonth = i + 1;
    const date = `${year}-${String(month).padStart(2, "0")}-${String(dayOfMonth).padStart(2, "0")}`;
    return {
      date,
      dayOfMonth,
      active: activeDays.has(date),
      isToday: date === todayStr,
      isFuture: date > todayStr,
    };
  });
}
