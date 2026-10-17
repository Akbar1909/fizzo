import { getLevel } from "@/lib/social";

function FlameIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-8z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12.5l5 5L20 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.8z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatTiles({
  streak,
  totalXp,
  solvedCount,
}: {
  streak: number;
  totalXp: number;
  solvedCount: number;
}) {
  const tiles = [
    { Icon: FlameIcon, value: streak, label: "kunlik seriya", color: "var(--stat-streak)" },
    { Icon: BoltIcon, value: totalXp, label: "jami XP", color: "var(--stat-xp)" },
    { Icon: CheckIcon, value: solvedCount, label: "yechilgan savol", color: "var(--stat-mastery)" },
    { Icon: StarIcon, value: getLevel(totalXp), label: "daraja", color: "var(--stat-level)" },
  ];

  return (
    <div className="stat-tiles">
      {tiles.map((tile) => (
        <div key={tile.label} className="stat-tile">
          <span className="stat-tile-icon">
            <tile.Icon color={tile.color} />
          </span>
          <span className="stat-tile-value" style={{ color: tile.color }}>
            {tile.value}
          </span>
          <span className="stat-tile-label">{tile.label}</span>
        </div>
      ))}
    </div>
  );
}
