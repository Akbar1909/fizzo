import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getTopicByCode } from "@/lib/topics";
import { selectPracticeQuestions } from "@/lib/practice";
import { env } from "@/lib/env";
import { PracticeSession } from "@/components/practice/practice-session";

export default async function MashqPage({ params }: PageProps<"/mashq/[mavzu]">) {
  const { mavzu } = await params;
  const user = await requireUser();

  const topic = await getTopicByCode(decodeURIComponent(mavzu));
  if (!topic) notFound();

  if (!topic.section.isOpen) {
    return (
      <main className="page stack" style={{ paddingTop: 48, textAlign: "center", alignItems: "center" }}>
        <span className="badge">Tez orada</span>
        <h1 className="display" style={{ fontSize: 20 }}>
          {topic.name}
        </h1>
        <p style={{ color: "var(--muted)" }}>Bu mavzu hali ochilmagan.</p>
      </main>
    );
  }

  const questions = await selectPracticeQuestions(topic.id, user.id);

  return (
    <PracticeSession questions={questions} topicName={topic.name} botUsername={env.telegramBotUsername} />
  );
}
