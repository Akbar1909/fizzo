import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-stats";
import { tashkentWeekdayIndex } from "@/lib/streak";

const WEEKDAY_LABELS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card stack-sm">
      <span style={{ fontSize: 13, color: "var(--muted)" }}>{label}</span>
      <span className="display" style={{ fontSize: 28 }}>
        {value}
      </span>
      {hint && <span style={{ fontSize: 12, color: "var(--muted)" }}>{hint}</span>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const correctRate = stats.totalAttempts > 0 ? Math.round((stats.correctAttempts / stats.totalAttempts) * 100) : 0;
  const maxDay = Math.max(1, ...stats.last7Days.map((d) => d.count));

  return (
    <div className="stack">
      <h1 className="display" style={{ fontSize: 22 }}>
        Dashboard
      </h1>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <StatCard label="Jami foydalanuvchilar" value={stats.totalUsers.toLocaleString("uz-UZ")} />
        <StatCard label="Bugun qo&apos;shilgan" value={stats.newUsersToday.toLocaleString("uz-UZ")} />
        <StatCard label="Shu hafta qo&apos;shilgan" value={stats.newUsersThisWeek.toLocaleString("uz-UZ")} />
        <StatCard label="Faol seriyali" value={stats.activeStreakUsers.toLocaleString("uz-UZ")} hint="streak > 0, bugun/kecha faol" />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <StatCard label="Jami urinishlar" value={stats.totalAttempts.toLocaleString("uz-UZ")} />
        <StatCard label="To'g'ri javob %" value={`${correctRate}%`} />
        <StatCard label="Chop etilgan savollar" value={stats.totalQuestions.toLocaleString("uz-UZ")} />
        <StatCard label="Mock testlar" value={stats.totalMockSessions.toLocaleString("uz-UZ")} />
      </section>

      <section className="card stack-sm">
        <span style={{ fontSize: 13, color: "var(--muted)" }}>Oxirgi 7 kunlik ro&apos;yxatdan o&apos;tishlar</span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100, paddingTop: 8 }}>
          {stats.last7Days.map((day) => {
            const [, , d] = day.dateStr.split("-");
            const heightPct = (day.count / maxDay) * 100;
            return (
              <div key={day.dateStr} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{day.count}</span>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 32,
                    height: `${Math.max(heightPct, day.count > 0 ? 6 : 2)}%`,
                    background: "var(--accent)",
                    borderRadius: 4,
                  }}
                />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  {WEEKDAY_LABELS[tashkentWeekdayIndex(new Date(`${day.dateStr}T12:00:00Z`))]} {d}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {stats.pendingReviews > 0 && (
        <div className="card-dashed stack-sm" style={{ borderColor: "var(--accent)" }}>
          <span style={{ fontSize: 14 }}>
            {stats.pendingReviews} ta sharh ko&apos;rib chiqilishini kutmoqda —{" "}
            <Link href="/admin/sharhlar" style={{ fontWeight: 600 }}>
              ko&apos;rish
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}
