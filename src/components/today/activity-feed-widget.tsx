import { getActivityFeed } from "@/lib/social";

function formatMinutesAgo(minutes: number): string {
  if (minutes < 1) return "hozirgina";
  if (minutes < 60) return `${minutes} daqiqa oldin`;
  const hours = Math.round(minutes / 60);
  return `${hours} soat oldin`;
}

export async function ActivityFeedWidget({ excludeUserId }: { excludeUserId: string }) {
  const feed = await getActivityFeed(excludeUserId);

  if (feed.length === 0) {
    return (
      <section className="card stack-sm" aria-label="Jonli faollik">
        <strong style={{ fontSize: 14 }}>Jonli faollik</strong>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Hozircha faollik yo&apos;q.</p>
      </section>
    );
  }

  return (
    <section className="card stack-sm" aria-label="Jonli faollik">
      <strong style={{ fontSize: 14 }}>Jonli faollik</strong>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {feed.map((entry, i) => (
          <li key={i} style={{ fontSize: 13 }}>
            <strong>{entry.displayName}</strong>{" "}
            <span style={{ color: "var(--muted)" }}>
              · {entry.topicName} · {entry.correct}/{entry.total} · {formatMinutesAgo(entry.minutesAgo)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
