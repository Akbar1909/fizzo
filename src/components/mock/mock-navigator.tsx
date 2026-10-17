export function MockNavigator({
  total,
  current,
  answeredIndexes,
  flaggedIndexes,
  onJump,
}: {
  total: number;
  current: number;
  answeredIndexes: Set<number>;
  flaggedIndexes: Set<number>;
  onJump: (index: number) => void;
}) {
  const answeredCount = answeredIndexes.size;

  return (
    <aside className="card stack-sm" aria-label="Savollar navigatori">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 1fr)",
          gap: 6,
        }}
      >
        {Array.from({ length: total }, (_, i) => {
          const isAnswered = answeredIndexes.has(i);
          const isFlagged = flaggedIndexes.has(i);
          const isCurrent = i === current;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              aria-current={isCurrent}
              aria-label={`${i + 1}-savol${isAnswered ? ", javob berilgan" : ""}${isFlagged ? ", belgilangan" : ""}`}
              style={{
                aspectRatio: "1",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                border: isFlagged ? "2px solid var(--accent)" : "1px solid var(--line)",
                background: isAnswered ? "var(--ink)" : "var(--surface)",
                color: isAnswered ? "var(--paper)" : "var(--ink)",
                boxShadow: isCurrent ? "0 0 0 2px var(--force-normal)" : undefined,
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="stack-sm" style={{ fontSize: 12, color: "var(--muted)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: "var(--ink)", display: "inline-block" }} />
          Javob berilgan
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, border: "2px solid var(--accent)", display: "inline-block" }} />
          Belgilangan
        </div>
      </div>

      <strong style={{ fontSize: 13 }}>
        {answeredCount} / {total} javob berildi
      </strong>
    </aside>
  );
}
