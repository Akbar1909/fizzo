import { notFound } from "next/navigation";
import { getQuestionByIdForAdmin, getSectionsForAdmin } from "@/lib/admin-questions";
import { QuestionForm } from "@/components/admin/question-form";
import { deleteQuestionAction } from "../actions";

function stringify(value: unknown): string {
  return value === null || value === undefined ? "" : JSON.stringify(value, null, 2);
}

export default async function EditSavolPage({ params }: PageProps<"/admin/savollar/[id]">) {
  const { id } = await params;
  const [sections, question] = await Promise.all([getSectionsForAdmin(), getQuestionByIdForAdmin(id)]);
  if (!question) notFound();

  const topics = sections.flatMap((s) => s.topics.map((t) => ({ ...t, sectionName: s.name })));

  return (
    <div className="stack">
      <h1 className="display" style={{ fontSize: 22 }}>
        Savolni tahrirlash
      </h1>
      <QuestionForm
        topics={topics}
        initialQuestion={{
          id: question.id,
          slug: question.slug,
          topicId: question.topicId,
          type: question.type,
          difficulty: question.difficulty,
          text: question.text,
          optionsJson: stringify(question.options),
          answerJson: stringify(question.answer),
          solutionJson: stringify(question.solution),
          mistakesJson: stringify(question.mistakes),
          figureJson: stringify(question.figure),
          isPublished: question.isPublished,
        }}
      />

      <form action={deleteQuestionAction}>
        <input type="hidden" name="id" value={question.id} />
        <button type="submit" className="btn" style={{ color: "var(--bad)", borderColor: "var(--bad)" }}>
          Savolni o&apos;chirish
        </button>
      </form>
    </div>
  );
}
