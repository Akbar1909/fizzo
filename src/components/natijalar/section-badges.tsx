import { getSectionBadges } from "@/lib/badges";

const SECTION_COLORS: Record<string, { bg: string; color: string }> = {
  "1": { bg: "#FBE3D2", color: "#C2410C" },
  "2": { bg: "#D7EEDC", color: "#15803D" },
  "3": { bg: "#DCE6FB", color: "#1D4ED8" },
  "4": { bg: "#F3E8C9", color: "#8A5A00" },
  "5": { bg: "#E9E3F5", color: "#5B3FA8" },
};

/** Mexanika — mayatnik (pendulum). */
function PendulumIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="5" y1="4" x2="19" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="4" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="3.2" fill={color} />
    </svg>
  );
}

/** Molekulyar fizika va termodinamika — termometr. */
function ThermometerIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M11 4.5a1.5 1.5 0 0 1 3 0v8.6a4 4 0 1 1-3 0V4.5z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line x1="12.5" y1="7" x2="12.5" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12.5" cy="17" r="2.2" fill={color} />
    </svg>
  );
}

/** Elektr va magnitizm — chaqmoq. */
function BoltIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2 5 14h5l-1 8 8-12h-5l1-8z" fill={color} stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

/** Optika. Nisbiylik nazariyasi asoslari — linza va nur. */
function LensIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4c-3.5 0-5.5 3.5-5.5 8s2 8 5.5 8 5.5-3.5 5.5-8-2-8-5.5-8z"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <line x1="1.5" y1="12" x2="6" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="12" x2="22.5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Kvant fizikasi. Atom va yadro fizikasi — atom. */
function AtomIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="2.2" fill={color} />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" fill="none" stroke={color} strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" fill="none" stroke={color} strokeWidth="1.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" fill="none" stroke={color} strokeWidth="1.6" transform="rotate(120 12 12)" />
    </svg>
  );
}

const SECTION_ICONS: Record<string, (props: { color: string }) => React.ReactNode> = {
  "1": PendulumIcon,
  "2": ThermometerIcon,
  "3": BoltIcon,
  "4": LensIcon,
  "5": AtomIcon,
};

export async function SectionBadges({ userId }: { userId: string }) {
  const badges = await getSectionBadges(userId);

  if (badges.length === 0) return null;

  return (
    <section className="stack-sm" aria-label="Bo'lim nishonlari">
      <h2 style={{ fontSize: 16 }}>Bo&apos;lim nishonlari</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 16 }}>
        {badges.map((badge) => {
          const palette = SECTION_COLORS[badge.code] ?? { bg: "var(--surface)", color: "var(--muted)" };
          const Icon = SECTION_ICONS[badge.code] ?? AtomIcon;
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
                  opacity: badge.earned ? 1 : 0.55,
                }}
              >
                <Icon color={badge.earned ? palette.color : "var(--muted)"} />
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
