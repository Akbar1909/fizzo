import Link from "next/link";

export function SessionSummary({
  correctCount,
  total,
  elapsedMs,
  topicName,
  onRestart,
}: {
  correctCount: number;
  total: number;
  elapsedMs: number;
  topicName: string;
  onRestart: () => void;
}) {
  const accuracy = total > 0 ? correctCount / total : 0;
  const minutes = Math.floor(elapsedMs / 60_000);
  const seconds = Math.round((elapsedMs % 60_000) / 1000);

  return (
    <main
      className="page stack"
      style={{ paddingTop: 48, paddingBottom: 32, textAlign: "center", alignItems: "center" }}
    >
      <h1 className="display" style={{ fontSize: 24 }}>
        Natija
      </h1>

      <div className="card stack-sm" style={{ width: "100%" }}>
        <p style={{ fontSize: 36, fontFamily: "var(--font-display)", fontWeight: 700 }}>
          {correctCount}/{total}
        </p>
        <p style={{ color: "var(--muted)" }}>
          {minutes} daq {seconds} soniya
        </p>
      </div>

      {accuracy < 0.7 && total > 0 && (
        <div className="card-dashed stack-sm" style={{ width: "100%" }}>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Qayta ko&apos;rib chiqish tavsiya etiladi:</p>
          <strong>{topicName}</strong>
        </div>
      )}

      <div className="stack" style={{ width: "100%" }}>
        <button type="button" className="btn btn-primary btn-block" onClick={onRestart}>
          Yana 10 ta
        </button>
        <Link href="/" className="btn btn-block">
          Bosh sahifa
        </Link>
      </div>
    </main>
  );
}
