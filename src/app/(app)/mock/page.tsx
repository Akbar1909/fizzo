import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  getActiveMockSession,
  getOrderedPublicQuestions,
  wasFilledFromOtherSections,
  SECTION_COMPOSITION,
  MOCK_TOTAL_QUESTIONS,
  QUICK_MOCK_TOTAL_QUESTIONS,
} from "@/lib/mock";
import { getSectionsOverview } from "@/lib/progress";
import { MockTestClient } from "@/components/mock/mock-test-client";
import { Logo } from "@/components/logo";
import { startMockAction } from "./actions";

const COMPOSITION_ROWS = [
  { section: "1. Mexanika", y1: 10, o: 3, total: 13 },
  { section: "2. Molekulyar fizika va termodinamika", y1: 5, o: 2, total: 7 },
  { section: "3. Elektr va magnitizm", y1: 10, o: 2, total: 12 },
  { section: "4. Optika. Nisbiylik nazariyasi asoslari", y1: 3, o: 2, total: 5 },
  { section: "5. Kvant fizikasi. Atom va yadro fizikasi", y1: 3, o: 1, total: 4 },
  { section: "Mantiqiy va hayotiy masala", y1: 1, o: 0, total: 1 },
  { section: "Moslashtirish (Y-2), istalgan mavzu", y1: 0, o: 0, total: 3 },
];

export default async function MockPage() {
  const user = await requireUser();
  const session = await getActiveMockSession(user.id);

  if (session?.finishedAt) {
    redirect(`/mock/${session.id}/natija`);
  }

  if (!session) {
    const sections = (await getSectionsOverview()).filter((s) => s.isOpen);

    return (
      <main className="page stack" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <header className="stack-sm">
          <span className="mobile-only-logo">
            <Logo height={22} />
          </span>
          <h1 className="display" style={{ fontSize: 22 }}>
            Mock test
          </h1>
          <p style={{ color: "var(--muted)" }}>Qaysi turdagi mock testni boshlaysiz?</p>
        </header>

        <div className="stack-sm">
          <div className="card stack-sm">
            <strong style={{ fontSize: 16 }}>To&apos;liq mock</strong>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              {MOCK_TOTAL_QUESTIONS} ta savol · 150 daqiqa · rasmiy imtihon formati
            </p>
            <div className="stack-sm" style={{ marginTop: 4 }}>
              {COMPOSITION_ROWS.map((row) => (
                <div key={row.section} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>{row.section}</span>
                  <span style={{ color: "var(--muted)" }}>{row.total} ta</span>
                </div>
              ))}
            </div>
            <form action={startMockAction}>
              <input type="hidden" name="mode" value="full" />
              <button type="submit" className="btn btn-primary btn-block">
                Boshlash
              </button>
            </form>
          </div>

          <div className="card stack-sm">
            <strong style={{ fontSize: 16 }}>Tezkor aralash mock</strong>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              {QUICK_MOCK_TOTAL_QUESTIONS} ta savol · 30 daqiqa · barcha bo&apos;limlardan aralashtirilgan
            </p>
            <form action={startMockAction}>
              <input type="hidden" name="mode" value="quick" />
              <button type="submit" className="btn btn-block">
                Boshlash
              </button>
            </form>
          </div>

          <div className="card stack-sm">
            <strong style={{ fontSize: 16 }}>Bo&apos;lim bo&apos;yicha mock</strong>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Bitta bo&apos;limni tanlang — shu bo&apos;lim bo&apos;yicha qisqaroq mock test topshirasiz.
            </p>
            <div className="stack-sm">
              {sections.map((s) => {
                const comp = SECTION_COMPOSITION.find((c) => c.sectionCode === s.code);
                const total = comp ? comp.y1 + comp.o + 1 : 0;
                return (
                  <form
                    key={s.code}
                    action={startMockAction}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
                  >
                    <input type="hidden" name="mode" value="section" />
                    <input type="hidden" name="sectionCode" value={s.code} />
                    <span style={{ fontSize: 14 }}>
                      {s.code}. {s.name} <span style={{ color: "var(--muted)" }}>({total} ta)</span>
                    </span>
                    <button type="submit" className="btn" style={{ flexShrink: 0 }}>
                      Boshlash
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const questions = await getOrderedPublicQuestions(session.questionIds);

  return (
    <MockTestClient
      sessionId={session.id}
      questions={questions}
      initialAnswers={session.answers as Record<string, unknown>}
      initialFlagged={session.flagged}
      endsAt={session.endsAt.toISOString()}
      shortBank={wasFilledFromOtherSections(session)}
    />
  );
}
