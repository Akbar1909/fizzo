import { getMonthStreakCalendar } from "@/lib/streak-calendar";

const WEEKDAY_LABELS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const MONTH_NAMES = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

function weekdayIndexMondayFirst(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const jsDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sunday
  return (jsDay + 6) % 7;
}

export async function StreakCalendarWidget({ userId }: { userId: string }) {
  const days = await getMonthStreakCalendar(userId);
  if (days.length === 0) return null;

  const [year, month] = days[0].date.split("-").map(Number);
  const leadingBlanks = weekdayIndexMondayFirst(days[0].date);

  return (
    <section className="card stack-sm" aria-label="Seriya taqvimi">
      <strong style={{ fontSize: 14 }}>
        {MONTH_NAMES[month - 1]} {year}
      </strong>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, fontSize: 11, color: "var(--quiet)", textAlign: "center" }}>
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {days.map((day) => (
          <span
            key={day.date}
            style={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: day.isToday ? 700 : 400,
              color: day.isFuture ? "var(--quiet)" : day.active ? "#fff" : "var(--muted)",
              background: day.active ? "var(--accent)" : day.isFuture ? "transparent" : "var(--line-soft)",
              border: day.isFuture ? "1px dashed var(--line)" : undefined,
              boxShadow: day.isToday ? "0 0 0 2px var(--force-normal)" : undefined,
            }}
          >
            {day.dayOfMonth}
          </span>
        ))}
      </div>
    </section>
  );
}
