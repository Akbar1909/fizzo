import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getMockReview } from "@/lib/mock";
import { MarkdownMath } from "@/components/markdown-math";
import { Y1Options } from "@/components/practice/y1-options";
import { Y2OptionsInput } from "@/components/practice/y2-options";
import { OPartsInput } from "@/components/practice/o-parts";
import type { OPart, Y1Answer, Y2Options } from "@/lib/content-types";
import { Logo } from "@/components/logo";

export default async function MockResultPage({ params }: PageProps<"/mock/[id]/natija">) {
  const { id } = await params;
  const user = await requireUser();
  const review = await getMockReview(id, user.id);
  if (!review) notFound();

  const minutes = Math.round(
    (review.finishedAt.getTime() - review.startedAt.getTime()) / 60_000,
  );

  return (
    <main className="page stack" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <header className="stack-sm">
        <span className="mobile-only-logo">
          <Logo height={22} />
        </span>
        <h1 className="display" style={{ fontSize: 22 }}>
          {review.label} natijasi
        </h1>
      </header>

      <section className="card" style={{ textAlign: "center" }}>
        <p style={{ fontSize: 40, fontFamily: "var(--font-display)", fontWeight: 700 }}>
          {review.score}/{review.total}
        </p>
        <p style={{ color: "var(--muted)" }}>{minutes} daqiqada yakunlandi</p>
      </section>

      <section className="stack-sm">
        <h2 style={{ fontSize: 16 }}>Bo&apos;limlar bo&apos;yicha natija</h2>
        {review.bySection.map((s) => (
          <div key={s.code} className="stack-sm" style={{ gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span>
                {s.code}. {s.name}
              </span>
              <span style={{ color: "var(--muted)" }}>
                {s.correct}/{s.total}
              </span>
            </div>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${s.total > 0 ? (s.correct / s.total) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </section>

      {review.weakTopics.length > 0 && (
        <section className="stack-sm">
          <h2 style={{ fontSize: 16 }}>Zaif mavzular</h2>
          {review.weakTopics.map((t) => (
            <div key={t.code} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ fontSize: 14 }}>
                  {t.code} {t.name}
                </strong>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>
                  {t.correct}/{t.total} to&apos;g&apos;ri
                </p>
              </div>
              <Link href={`/mashq/${encodeURIComponent(t.code)}`} className="btn">
                Mashq qilish
              </Link>
            </div>
          ))}
        </section>
      )}

      <section className="stack">
        <h2 style={{ fontSize: 16 }}>Savollar tahlili</h2>
        {review.items.map((item, i) => (
          <div key={item.question.id} className="card stack-sm">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <strong>{i + 1}-savol</strong>
              <span className="badge badge-accent">{item.question.type}</span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 13,
                  fontWeight: 700,
                  color: item.isCorrect ? "var(--good)" : "var(--bad)",
                }}
              >
                {item.isCorrect ? "To'g'ri" : "Noto'g'ri"}
              </span>
            </div>

            <div style={{ fontSize: 15 }}>
              <MarkdownMath>{item.question.text}</MarkdownMath>
            </div>

            {item.question.type === "Y1" && (
              <Y1Options
                options={item.question.options as Parameters<typeof Y1Options>[0]["options"]}
                selected={typeof item.userResponse === "string" ? (item.userResponse as Y1Answer) : null}
                correctKey={item.correctAnswer as Y1Answer}
                disabled
              />
            )}
            {item.question.type === "Y2" && (
              <Y2OptionsInput
                options={item.question.options as Y2Options}
                response={(item.userResponse as Record<string, string>) ?? {}}
                partResults={item.partResults ?? null}
                disabled
              />
            )}
            {item.question.type === "O" && (
              <OPartsInput
                parts={item.question.options as OPart[]}
                response={(item.userResponse as Record<string, string>) ?? {}}
                partResults={item.partResults ?? null}
                disabled
              />
            )}

            <div className="stack-sm">
              {item.solution.map((step, si) => (
                <div key={si} style={{ fontSize: 14, color: "var(--muted)" }}>
                  {si + 1}. <MarkdownMath inline>{step.text}</MarkdownMath>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Link href="/natijalar" className="btn btn-block">
        Natijalarga qaytish
      </Link>
    </main>
  );
}
