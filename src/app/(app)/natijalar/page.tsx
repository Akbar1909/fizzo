import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getMockHistory, getResultsSummary } from "@/lib/results";
import { getUserPendingOrRecentReview } from "@/lib/reviews";
import { Logo } from "@/components/logo";
import { ReviewForm } from "@/components/natijalar/review-form";
import { SectionBadges } from "@/components/natijalar/section-badges";
import { updateShareActivityAction } from "./actions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("uz-UZ", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export default async function NatijalarPage() {
  const user = await requireUser();
  const [summary, mockHistory, myReview] = await Promise.all([
    getResultsSummary(user.id),
    getMockHistory(user.id),
    getUserPendingOrRecentReview(user.id),
  ]);

  return (
    <main className="page stack" style={{ paddingTop: 24, paddingBottom: 32 }}>
      <header className="stack-sm">
        <span className="mobile-only-logo">
          <Logo height={22} />
        </span>
        <h1 className="display" style={{ fontSize: 22 }}>
          Natijalar
        </h1>
      </header>

      <section className="card" style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
        <div>
          <p style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 700 }}>
            {summary.totalAttempts}
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Jami urinish</p>
        </div>
        <div>
          <p style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 700 }}>
            {Math.round(summary.accuracy * 100)}%
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>To&apos;g&apos;rilik</p>
        </div>
      </section>

      <SectionBadges userId={user.id} />

      {summary.weakTopics.length > 0 && (
        <section className="stack-sm">
          <h2 style={{ fontSize: 16 }}>Eng zaif mavzular</h2>
          <div className="stack-sm">
            {summary.weakTopics.map((topic) => (
              <div key={topic.id} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 14 }}>
                    {topic.code} {topic.name}
                  </strong>
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>
                    {Math.round(topic.accuracy * 100)}% to&apos;g&apos;ri ({topic.correct}/{topic.attempts})
                  </p>
                </div>
                <Link href={`/mashq/${encodeURIComponent(topic.code)}`} className="btn">
                  Mashq qilish
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {summary.topics.length > 0 && (
        <section className="stack-sm">
          <h2 style={{ fontSize: 16 }}>Mavzular bo&apos;yicha to&apos;g&apos;rilik</h2>
          <div className="stack-sm">
            {summary.topics.map((topic) => (
              <div key={topic.id} className="stack-sm" style={{ gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>
                    {topic.code} {topic.name}
                  </span>
                  <span style={{ color: "var(--muted)" }}>{Math.round(topic.accuracy * 100)}%</span>
                </div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${topic.accuracy * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {summary.totalAttempts === 0 && (
        <p style={{ color: "var(--muted)", textAlign: "center" }}>
          Hali mashq qilmadingiz. Boshlash uchun{" "}
          <Link href="/mavzular" style={{ color: "var(--accent)", fontWeight: 600 }}>
            mavzularni ko&apos;ring
          </Link>
          .
        </p>
      )}

      <section className="stack-sm">
        <h2 style={{ fontSize: 16 }}>Mock test tarixi</h2>
        {mockHistory.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Hali mock test topshirmadingiz.</p>
        ) : (
          <div className="stack-sm">
            {mockHistory.map((entry) => (
              <Link
                key={entry.id}
                href={`/mock/${entry.id}/natija`}
                className="card"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
              >
                <span style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, display: "block" }}>{entry.label}</span>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{formatDate(entry.startedAt)}</span>
                </span>
                <strong style={{ flexShrink: 0 }}>
                  {entry.score}/{entry.total}
                </strong>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="stack-sm">
        <h2 style={{ fontSize: 16 }}>Fikringizni qoldiring</h2>
        {myReview?.status === "PENDING" ? (
          <div className="card">
            <p style={{ fontSize: 14, color: "var(--muted)" }}>
              Sharhingiz ko&apos;rib chiqilmoqda. Tasdiqlangandan so&apos;ng bosh sahifada chop etiladi.
            </p>
          </div>
        ) : myReview?.status === "APPROVED" ? (
          <div className="card">
            <p style={{ fontSize: 14, color: "var(--good)" }}>Sharhingiz bosh sahifada chop etilgan. Rahmat!</p>
          </div>
        ) : (
          <ReviewForm />
        )}
      </section>

      <section className="stack-sm">
        <h2 style={{ fontSize: 16 }}>Sozlamalar</h2>
        <form action={updateShareActivityAction} className="card stack-sm">
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14 }}>
            <input type="checkbox" name="shareActivity" defaultChecked={user.shareActivity} style={{ marginTop: 3 }} />
            <span>
              Ismim boshqa foydalanuvchilarga faollik lentasi va haftalik reytingda ko&apos;rsatilsin
              <br />
              <span style={{ color: "var(--quiet)", fontSize: 12 }}>
                (masalan, &quot;{user.firstName} {user.lastName ? `${user.lastName.slice(0, 1)}.` : ""} · Dinamika · 9/10 · 3 daqiqa oldin&quot;)
              </span>
            </span>
          </label>
          <button type="submit" className="btn" style={{ alignSelf: "flex-start" }}>
            Saqlash
          </button>
        </form>
      </section>
    </main>
  );
}
