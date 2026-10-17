const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000; // UTC+5, no DST

/** The user's calendar day in Asia/Tashkent, as "YYYY-MM-DD". */
export function tashkentDateString(instant: Date): string {
  const shifted = new Date(instant.getTime() + TASHKENT_OFFSET_MS);
  const yyyy = shifted.getUTCFullYear();
  const mm = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(shifted.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const fromMs = Date.UTC(fy, fm - 1, fd);
  const toMs = Date.UTC(ty, tm - 1, td);
  return Math.round((toMs - fromMs) / 86_400_000);
}

export interface StreakState {
  streak: number;
  bestStreak: number;
  /** Tashkent calendar day of the last activity, as "YYYY-MM-DD", or null if never active. */
  lastActiveOn: string | null;
}

/** Call once, when the user answers their first question of the day. */
export function nextStreak(state: StreakState, now: Date): StreakState {
  const today = tashkentDateString(now);
  if (state.lastActiveOn === today) {
    return state;
  }
  const streak =
    state.lastActiveOn !== null && daysBetween(state.lastActiveOn, today) === 1
      ? state.streak + 1
      : 1;
  return {
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    lastActiveOn: today,
  };
}

/** The streak number to show in the UI: 0 unless the user was active today or yesterday. */
export function displayStreak(state: StreakState, now: Date): number {
  if (state.lastActiveOn === null) return 0;
  const diff = daysBetween(state.lastActiveOn, tashkentDateString(now));
  return diff === 0 || diff === 1 ? state.streak : 0;
}

/** 0 = Monday ... 6 = Sunday, in the Tashkent calendar. */
export function tashkentWeekdayIndex(instant: Date): number {
  const shifted = new Date(instant.getTime() + TASHKENT_OFFSET_MS);
  const jsDay = shifted.getUTCDay(); // 0 = Sunday ... 6 = Saturday
  return (jsDay + 6) % 7;
}

/** Hour of day (0-23) in the Tashkent calendar. */
export function tashkentHour(instant: Date): number {
  const shifted = new Date(instant.getTime() + TASHKENT_OFFSET_MS);
  return shifted.getUTCHours();
}

export function addDaysToTashkentString(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const shifted = new Date(Date.UTC(y, m - 1, d) + delta * 86_400_000);
  const yyyy = shifted.getUTCFullYear();
  const mm = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(shifted.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** The [start, end) instant range, in UTC, covering a Tashkent calendar day. */
export function tashkentDayRangeUtc(dateStr: string): { start: Date; end: Date } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, -5, 0, 0, 0));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

/** The [start, end) instant range, in UTC, covering the Monday-Sunday Tashkent week containing `now`. */
export function tashkentWeekRangeUtc(now: Date): { start: Date; end: Date } {
  const todayStr = tashkentDateString(now);
  const mondayStr = addDaysToTashkentString(todayStr, -tashkentWeekdayIndex(now));
  const sundayStr = addDaysToTashkentString(mondayStr, 6);
  const { start } = tashkentDayRangeUtc(mondayStr);
  const { end } = tashkentDayRangeUtc(sundayStr);
  return { start, end };
}
