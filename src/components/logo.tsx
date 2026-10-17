const LOCKUP_ASPECT = 353 / 88;

export function Logo({ height = 24 }: { height?: number }) {
  const width = Math.round(height * LOCKUP_ASPECT);
  return (
    <span className="logo-swap" style={{ width, height }}>
      <img src="/brand/fizzo-lockup.svg" alt="fizzo" width={width} height={height} className="logo-light" />
      <img
        src="/brand/fizzo-lockup-on-dark.svg"
        alt="fizzo"
        width={width}
        height={height}
        className="logo-dark"
      />
    </span>
  );
}
