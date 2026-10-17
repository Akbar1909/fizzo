import { getSectionsForAdmin } from "@/lib/admin-questions";
import { QuestionForm } from "@/components/admin/question-form";

export default async function YangiSavolPage() {
  const sections = await getSectionsForAdmin();
  const topics = sections.flatMap((s) => s.topics.map((t) => ({ ...t, sectionName: s.name })));

  return (
    <div className="stack">
      <h1 className="display" style={{ fontSize: 22 }}>
        Yangi savol
      </h1>
      <QuestionForm topics={topics} />
    </div>
  );
}
