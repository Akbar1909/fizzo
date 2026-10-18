import Link from "next/link";
import { getResultsSummary } from "@/lib/results";

export async function WeakTopicsWidget({ userId }: { userId: string }) {
  const { weakTopics } = await getResultsSummary(userId);

  if (weakTopics.length === 0) return null;

  return (
    <section className="stack-sm" aria-label="Zaif mavzular">
      <h2 style={{ fontSize: 16 }}>Eng zaif mavzular</h2>
      <div className="stack-sm">
        {weakTopics.map((topic) => (
          <div key={topic.id} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: 14 }}>
                {topic.code} {topic.name}
              </strong>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>
                {Math.round(topic.accuracy * 100)}% to&apos;g&apos;ri ({topic.correct}/{topic.attempts})
              </p>
            </div>
            <Link href={`/mashq/${encodeURIComponent(topic.code)}`} className="btn" style={{ color: "var(--bad)", borderColor: "var(--bad)" }}>
              Mashq qilish
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
