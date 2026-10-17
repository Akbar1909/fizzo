const MARKER_COLORS = {
  ink: "var(--ink)",
  accent: "var(--accent)",
  muted: "var(--quiet)",
  blue: "var(--force-normal)",
  velocity: "var(--quantity-velocity)",
  acceleration: "var(--good)",
} as const;

export type ArrowColorKey = keyof typeof MARKER_COLORS;

export function ArrowDefs() {
  return (
    <defs>
      {(Object.keys(MARKER_COLORS) as ArrowColorKey[]).map((key) => (
        <marker
          key={key}
          id={`arrow-${key}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 Z" style={{ fill: MARKER_COLORS[key] }} />
        </marker>
      ))}
    </defs>
  );
}

export { MARKER_COLORS };
