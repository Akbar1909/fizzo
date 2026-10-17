import type { PublicQuestion, Y1Option } from "@/lib/content-types";

export function QuestionStatsCard({
  stats,
  question,
}: {
  stats: { accuracyPercent: number; mostCommonAnswer?: string; totalAttempts: number };
  question: PublicQuestion;
}) {
  const mostCommonText =
    question.type === "Y1" && stats.mostCommonAnswer
      ? (question.options as Y1Option[]).find((o) => o.key === stats.mostCommonAnswer)?.key
      : undefined;

  return (
    <div className="card stack-sm" style={{ fontSize: 13, color: "var(--muted)" }}>
      <p>
        Bu savolni <strong style={{ color: "var(--ink)" }}>{stats.accuracyPercent}%</strong> to&apos;g&apos;ri yechgan
      </p>
      {mostCommonText && (
        <p>
          Ko&apos;pchilik <strong style={{ color: "var(--ink)" }}>{mostCommonText}</strong> ni tanlaydi
        </p>
      )}
    </div>
  );
}
