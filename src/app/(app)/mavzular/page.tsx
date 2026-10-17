import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSectionsWithProgress } from "@/lib/progress";
import { Logo } from "@/components/logo";

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ fontSize: 16 }}>
                {section.code}. {section.name}
              </h2>
              {!section.isOpen && <span className="badge">Tez orada</span>}
            </div>

            <div className="stack-sm">
              {section.topics.map((topic) => (
                <div key={topic.id} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stack-sm" style={{ flex: 1, gap: 4 }}>
                    <strong style={{ fontSize: 15 }}>
                      {topic.code} {topic.name}
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
