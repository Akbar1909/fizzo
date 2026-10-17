import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getActiveMockSession, getOrderedPublicQuestions, wasFilledFromOtherSections } from "@/lib/mock";
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
    return (
      <main className="page stack" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <header className="stack-sm">
          <span className="mobile-only-logo">
            <Logo height={22} />
          </span>
          <h1 className="display" style={{ fontSize: 22 }}>
            Mock test
          </h1>
          <p style={{ color: "var(--muted)" }}>
            Fizika · Milliy sertifikat mock testi — 45 ta savol, 150 daqiqa.
          </p>
        </header>

        <div className="card stack-sm">
          {COMPOSITION_ROWS.map((row) => (
            <div key={row.section} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span>{row.section}</span>
              <span style={{ color: "var(--muted)" }}>{row.total} ta</span>
            </div>
          ))}
        </div>

        <form action={startMockAction}>
          <button type="submit" className="btn btn-primary btn-block">
            Testni boshlash
          </button>
        </form>
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
