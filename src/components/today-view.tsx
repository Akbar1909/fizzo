import Link from "next/link";
import { countTodayAttempts, getWeekActivity, pickDailyTopic } from "@/lib/today";
import { getSectionsWithProgress } from "@/lib/progress";
import { displayStreak, tashkentDateString, tashkentHour, tashkentWeekdayIndex } from "@/lib/streak";
import { getUserTotalXp } from "@/lib/social";
import { CircularProgress } from "@/components/circular-progress";
import { Logo } from "@/components/logo";
import { LiveCountBanner } from "@/components/today/live-count-banner";
import { StreakCalendarWidget } from "@/components/today/streak-calendar-widget";
import { LeaderboardWidget } from "@/components/today/leaderboard-widget";
import { ActivityFeedWidget } from "@/components/today/activity-feed-widget";
import { StatTiles } from "@/components/today/stat-tiles";
import type { PublicUser } from "@/lib/users";

const DAILY_GOAL = 10;
const WEEKDAY_LABELS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const MONTH_NAMES = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];
const WEEKDAY_FULL_NAMES = ["dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba", "yakshanba"];

function getGreeting(hour: number): string {
  if (hour < 6) return "Xayrli tun";
  if (hour < 11) return "Xayrli tong";
  if (hour < 17) return "Xayrli kun";
  if (hour < 23) return "Xayrli kech";
  return "Xayrli tun";
}

export async function TodayView({ user }: { user: PublicUser }) {
  const [dailyTopic, todayCount, weekActivity, sections, totalXp] = await Promise.all([
    pickDailyTopic(),
    countTodayAttempts(user.id),
    getWeekActivity(user.id),
    getSectionsWithProgress(user.id),
    getUserTotalXp(user.id),
  ]);

  const done = Math.min(DAILY_GOAL, todayCount);
  const remaining = Math.max(0, DAILY_GOAL - todayCount);
  const now = new Date();
  const streakToShow = displayStreak(
    { streak: user.streak, bestStreak: user.bestStreak, lastActiveOn: user.lastActiveOn },
    now,
  );
  const solvedCount = sections.reduce((sum, s) => sum + s.solved, 0);
  const greeting = getGreeting(tashkentHour(now));
  const [, month, day] = tashkentDateString(now).split("-").map(Number);
  const dateLabel = `${day}-${MONTH_NAMES[month - 1]}, ${WEEKDAY_FULL_NAMES[tashkentWeekdayIndex(now)]}`;

  return (
    <main className="page-wide today-grid" style={{ paddingTop: 24, paddingBottom: 32 }}>
      <div className="stack">
        <header className="stack-sm">
          <span className="mobile-only-logo">
            <Logo height={22} />
          </span>
          <div className="today-header-row">
            <div>
              <h1 className="display" style={{ fontSize: 22 }}>
                {greeting}, {user.firstName}!
              </h1>
              <p style={{ color: "var(--muted)", fontSize: 15, marginTop: 4 }}>
                {remaining > 0
                  ? `Bugun yana ${remaining} ta savol qoldi`
                  : "Bugungi maqsadga yetdingiz!"}
              </p>
            </div>
            <span className="today-dateline">{dateLabel}</span>
          </div>
        </header>

        <LiveCountBanner />

        {dailyTopic ? (
          <section className="card-hero pop-in" aria-labelledby="kunlik-mashq-heading">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <CircularProgress value={done} max={DAILY_GOAL} />
              <div className="stack-sm" style={{ flex: 1 }}>
                <span className="badge" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.3)", color: "#f6f3ec" }}>
                  Kunlik mashq
                </span>
                <h2 id="kunlik-mashq-heading" style={{ fontSize: 19, fontFamily: "var(--font-display)" }}>
                  {dailyTopic.name}
                </h2>
              </div>
            </div>
            <Link
              href={`/mashq/${encodeURIComponent(dailyTopic.code)}`}
              className="btn btn-primary btn-block"
              style={{ marginTop: 18 }}
            >
              Davom etish
            </Link>
          </section>
        ) : (
          <section className="card-dashed">
            <p style={{ color: "var(--muted)" }}>Hozircha mashq uchun savollar yo&apos;q.</p>
          </section>
        )}

        <StatTiles streak={streakToShow} totalXp={totalXp} solvedCount={solvedCount} />

        <section className="stack-sm" aria-label="Bo'limlar">
          {sections.map((section) => (
            <div key={section.id} className="card stack-sm">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 15 }}>
                  {section.code}. {section.name}
                </h3>
                {section.isOpen ? (
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>
                    {section.solved}/{section.total}
                  </span>
                ) : (
                  <span className="badge">Tez orada</span>
                )}
              </div>
              <div className="bar">
                <div
                  className="bar-fill"
                  style={{
                    width: `${section.total > 0 ? (section.solved / section.total) * 100 : 0}%`,
                    background: section.isOpen ? "var(--accent)" : "var(--quiet)",
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        <Link href="/mock" className="card-dashed stack-sm" style={{ textAlign: "center" }}>
          <strong style={{ fontFamily: "var(--font-display)" }}>To&apos;liq mock testni sinab ko&apos;ring</strong>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>45 ta savol · 150 daqiqa</span>
        </Link>
      </div>

      <aside className="today-side-panel">
        <section className="card stack-sm" aria-label="Seriya">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <h2 className="display" style={{ fontSize: 17 }}>
              {streakToShow} kunlik seriya
            </h2>
            {user.bestStreak > 0 && (
              <span style={{ fontSize: 13, color: "var(--quiet)" }}>Rekord: {user.bestStreak}</span>
            )}
          </div>
          <div className="week-dots">
            {WEEKDAY_LABELS.map((label, i) => (
              <div className="week-dot" key={label + i}>
                <span className="week-dot-circle" data-done={weekActivity[i]} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <LeaderboardWidget userId={user.id} />
        <StreakCalendarWidget userId={user.id} />
        <ActivityFeedWidget excludeUserId={user.id} />
      </aside>
    </main>
  );
}
