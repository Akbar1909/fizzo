export function CircularProgress({
  value,
  max,
  size = 64,
  strokeWidth = 6,
  trackColor = "rgba(255,255,255,0.2)",
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  const offset = circumference * (1 - ratio);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${value} / ${max} bajarildi`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.35s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize={size * 0.24}
        fill="currentColor"
        fontFamily="var(--font-ui)"
        fontWeight={700}
      >
        {value}/{max}
      </text>
    </svg>
  );
}
