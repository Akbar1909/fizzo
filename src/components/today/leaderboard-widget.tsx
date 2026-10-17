import { getWeeklyLeaderboard } from "@/lib/social";
import { Avatar } from "@/components/avatar";

export async function LeaderboardWidget({ userId }: { userId: string }) {
  const { top, you } = await getWeeklyLeaderboard(userId);

  if (top.length === 0) {
    return (
      <section className="card stack-sm" aria-label="Haftalik reyting" style={{ height: "100%" }}>
        <strong style={{ fontSize: 14 }}>Haftalik reyting</strong>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Bu hafta hali hech kim XP to&apos;plamadi.</p>
      </section>
    );
  }

  const youInTop = you !== null && you.rank <= top.length;

  return (
    <section className="card stack-sm" aria-label="Haftalik reyting" style={{ height: "100%" }}>
      <strong style={{ fontSize: 14 }}>Haftalik reyting</strong>
      <div>
        {top.slice(0, 5).map((entry, i) => {
          const isYou = entry.userId === userId;
          return (
            <div key={entry.userId} className="leaderboard-row">
              <span className="leaderboard-rank" style={i === 0 ? { color: "var(--accent)" } : undefined}>
                {i + 1}
              </span>
              <span className="leaderboard-avatar">
                <Avatar name={entry.displayName} photoUrl={entry.photoUrl} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: isYou ? 700 : 600,
                    color: isYou ? "var(--accent)" : "var(--ink)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {entry.displayName}
                </div>
              </div>
              <span style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>{entry.xp} XP</span>
            </div>
          );
        })}
      </div>
      {you && !youInTop && (
        <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
          <span>Sizning o&apos;rningiz: {you.rank}</span>
          <span>{you.xp} XP</span>
        </div>
      )}
    </section>
  );
}
