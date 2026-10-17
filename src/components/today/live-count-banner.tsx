import { getRandomContentFact, getTodayActiveCount, LIVE_COUNT_MIN_THRESHOLD } from "@/lib/social";

function BulbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11.2c.6.4 1 1.1 1 1.8h4c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function LiveCountBanner() {
  const count = await getTodayActiveCount();

  if (count < LIVE_COUNT_MIN_THRESHOLD) {
    return (
      <div className="fact-card">
        <span className="fact-card-icon">
          <BulbIcon />
        </span>
        <div>
          <span className="fact-card-label">Bilasizmi?</span>
          <p className="fact-card-text">{getRandomContentFact()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--good)", flexShrink: 0 }} aria-hidden="true" />
      Bugun <strong>{count}</strong> o&apos;quvchi mashq qilmoqda
    </div>
  );
}
