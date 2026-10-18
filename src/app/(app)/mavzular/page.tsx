import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSectionsWithProgress } from "@/lib/progress";
import { Logo } from "@/components/logo";

function TopicCheck() {
  return (
    <span
      title="Barcha savollar yechildi"
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        background: "var(--good)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2 6.5l2.5 2.5L10 3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default async function MavzularPage() {
  const user = await requireUser();
  const sections = await getSectionsWithProgress(user.id);

  return (
    <main className="page stack" style={{ paddingTop: 24, paddingBottom: 32 }}>
      <header className="stack-sm">
        <span className="mobile-only-logo">
          <Logo height={22} />
        </span>
        <h1 className="display" style={{ fontSize: 22 }}>
          Mavzular
        </h1>
      </header>

      <div className="stack">
        {sections.map((section) => (
          <section key={section.id} className="stack-sm">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <h2 style={{ fontSize: 16, display: "flex", alignItems: "center", gap: 6 }}>
                {section.code}. {section.name}
                {section.total > 0 && section.solved === section.total && <TopicCheck />}
              </h2>
              {!section.isOpen && <span className="badge">Tez orada</span>}
            </div>

            <div className="stack-sm">
              {section.topics.map((topic) => (
                <div key={topic.id} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stack-sm" style={{ flex: 1, gap: 4 }}>
                    <strong style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                      {topic.code} {topic.name}
                      {topic.total > 0 && topic.solved === topic.total && <TopicCheck />}
                    </strong>
                    <div className="bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${topic.total > 0 ? (topic.solved / topic.total) * 100 : 0}%`,
                          background: section.isOpen ? "var(--accent)" : "var(--quiet)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>
                      {topic.solved}/{topic.total} yechilgan
                    </span>
                  </div>
                  {section.isOpen && topic.total > 0 ? (
                    <Link href={`/mashq/${encodeURIComponent(topic.code)}`} className="btn">
                      Mashq qilish
                    </Link>
                  ) : (
                    <span className="badge">Tez orada</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
