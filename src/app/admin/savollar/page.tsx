import Link from "next/link";
import { getSectionsForAdmin, listQuestionsForAdmin } from "@/lib/admin-questions";
import type { Difficulty, QuestionType } from "@/generated/prisma/client";
import { importQuestionsAction, togglePublishAction } from "./actions";

function isQuestionType(value: string | undefined): value is QuestionType {
  return value === "Y1" || value === "Y2" || value === "O";
}
function isDifficulty(value: string | undefined): value is Difficulty {
  return value === "EASY" || value === "MEDIUM" || value === "HARD";
}

export default async function AdminSavollarPage({ searchParams }: PageProps<"/admin/savollar">) {
  const params = await searchParams;
  const topicId = typeof params.topicId === "string" ? params.topicId : undefined;
  const type = typeof params.type === "string" && isQuestionType(params.type) ? params.type : undefined;
  const difficulty =
    typeof params.difficulty === "string" && isDifficulty(params.difficulty) ? params.difficulty : undefined;
  const published =
    params.published === "published" || params.published === "unpublished" ? params.published : "all";

  const [sections, questions] = await Promise.all([
    getSectionsForAdmin(),
    listQuestionsForAdmin({ topicId, type, difficulty, published }),
  ]);

  const topics = sections.flatMap((s) => s.topics.map((t) => ({ ...t, sectionName: s.name })));

  return (
    <div className="stack">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <h1 className="display" style={{ fontSize: 22 }}>
          Savollar
        </h1>
        <Link href="/admin/savollar/yangi" className="btn btn-primary">
          + Yangi savol
        </Link>
      </div>

      <form method="get" className="card" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div className="field">
          <label htmlFor="topicId">Mavzu</label>
          <select id="topicId" name="topicId" className="input" defaultValue={topicId ?? ""}>
            <option value="">Barchasi</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code} {t.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="type">Turi</label>
          <select id="type" name="type" className="input" defaultValue={type ?? ""}>
            <option value="">Barchasi</option>
            <option value="Y1">Y1</option>
            <option value="Y2">Y2</option>
            <option value="O">O</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="difficulty">Qiyinlik</label>
          <select id="difficulty" name="difficulty" className="input" defaultValue={difficulty ?? ""}>
            <option value="">Barchasi</option>
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="published">Holati</label>
          <select id="published" name="published" className="input" defaultValue={published}>
            <option value="all">Barchasi</option>
            <option value="published">Nashr qilingan</option>
            <option value="unpublished">Qoralama</option>
          </select>
        </div>
        <button type="submit" className="btn">
          Filtrlash
        </button>
      </form>

      <div className="card stack-sm">
        <h2 style={{ fontSize: 15 }}>JSON import / export</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <form action="/admin/savollar/eksport" method="get" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select name="topicId" className="input" required>
              <option value="">Mavzuni tanlang</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} {t.name}
                </option>
              ))}
            </select>
            <button type="submit" className="btn">
              Eksport
            </button>
          </form>

          <form action={importQuestionsAction} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select name="topicId" className="input" required>
              <option value="">Mavzuni tanlang</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} {t.name}
                </option>
              ))}
            </select>
            <input type="file" name="file" accept="application/json" required />
            <button type="submit" className="btn">
              Import
            </button>
          </form>
        </div>
      </div>

      <div className="stack-sm">
        {questions.map((q) => (
          <div key={q.id} className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span className="badge badge-accent">{q.type}</span>
                <span className="badge">{q.difficulty}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  {q.topic.code} {q.topic.name}
                </span>
                {!q.isPublished && <span className="badge">Qoralama</span>}
              </div>
              <p style={{ fontSize: 14, marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {q.slug} — {q.text}
              </p>
            </div>
            <Link href={`/admin/savollar/${q.id}`} className="btn">
              Tahrirlash
            </Link>
            <form action={togglePublishAction}>
              <input type="hidden" name="id" value={q.id} />
              <input type="hidden" name="next" value={(!q.isPublished).toString()} />
              <button type="submit" className="btn">
                {q.isPublished ? "Yashirish" : "Nashr qilish"}
              </button>
            </form>
          </div>
        ))}
        {questions.length === 0 && <p style={{ color: "var(--muted)" }}>Savollar topilmadi.</p>}
      </div>
    </div>
  );
}
