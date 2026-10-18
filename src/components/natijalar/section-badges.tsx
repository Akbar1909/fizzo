import { getSectionBadges } from "@/lib/badges";

const SECTION_COLORS: Record<string, { bg: string; color: string }> = {
  "1": { bg: "#FBE3D2", color: "#C2410C" },
  "2": { bg: "#D7EEDC", color: "#15803D" },
  "3": { bg: "#DCE6FB", color: "#1D4ED8" },
  "4": { bg: "#F3E8C9", color: "#8A5A00" },
  "5": { bg: "#E9E3F5", color: "#5B3FA8" },
};

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 13l4 4L19 7" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="var(--muted)" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="var(--muted)" strokeWidth="2" />
    </svg>
  );
}

export async function SectionBadges({ userId }: { userId: string }) {
  const badges = await getSectionBadges(userId);

  if (badges.length === 0) return null;

  return (
    <section className="stack-sm" aria-label="Bo'lim nishonlari">
      <h2 style={{ fontSize: 16 }}>Bo&apos;lim nishonlari</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 16 }}>
        {badges.map((badge) => {
          const palette = SECTION_COLORS[badge.code] ?? { bg: "var(--surface)", color: "var(--muted)" };
          return (
            <div key={badge.code} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: badge.earned ? palette.bg : "transparent",
                  border: badge.earned ? `2px solid ${palette.color}` : "2px dashed var(--line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                {badge.earned ? <CheckIcon color={palette.color} /> : <LockIcon />}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: badge.earned ? "var(--ink)" : "var(--muted)" }}>
                {badge.code}-bo&apos;lim
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                {badge.solved}/{badge.total}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
