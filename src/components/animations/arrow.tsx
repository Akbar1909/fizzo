import { MARKER_COLORS, type ArrowColorKey } from "./arrow-defs";

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  colorKey,
  dashed = false,
  label,
  labelDx = 6,
  labelDy = -6,
  opacity,
  animate = true,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  colorKey: ArrowColorKey;
  dashed?: boolean;
  label?: string;
  labelDx?: number;
  labelDy?: number;
  opacity?: number;
  animate?: boolean;
}) {
  const color = MARKER_COLORS[colorKey];
  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        pathLength={100}
        markerEnd={`url(#arrow-${colorKey})`}
        className={animate ? "fx-draw-in" : undefined}
        style={{ stroke: color, strokeWidth: 2.5, strokeDasharray: dashed ? "6 4" : "100" }}
      />
      {label && (
        <text
          x={x2 + labelDx}
          y={y2 + labelDy}
          fontSize={12}
          style={{ fill: color, fontFamily: "var(--font-math)" }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
