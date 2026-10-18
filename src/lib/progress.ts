import "server-only";
import { db } from "@/lib/db";

export interface TopicProgress {
  id: string;
  code: string;
  name: string;
  solved: number;
  total: number;
}

export interface SectionProgress {
  id: string;
  code: string;
  name: string;
  order: number;
  isOpen: boolean;
  topics: TopicProgress[];
  solved: number;
  total: number;
}

export interface SectionOverview {
  code: string;
  name: string;
  isOpen: boolean;
  totalQuestions: number;
}

/** Public, no-login section summary (counts only) — for the landing page. */
export async function getSectionsOverview(): Promise<SectionOverview[]> {
  const sections = await db.section.findMany({
    orderBy: { order: "asc" },
    include: {
      topics: { include: { questions: { where: { isPublished: true }, select: { id: true } } } },
    },
  });
  return sections.map((section) => ({
    code: section.code,
    name: section.name,
    isOpen: section.isOpen,
    totalQuestions: section.topics.reduce((sum, t) => sum + t.questions.length, 0),
  }));
}

export async function getSectionsWithProgress(userId: string): Promise<SectionProgress[]> {
  const sections = await db.section.findMany({
    orderBy: { order: "asc" },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: { questions: { where: { isPublished: true }, select: { id: true } } },
      },
    },
  });

  const correctAttempts = await db.attempt.findMany({
    where: { userId, isCorrect: true },
    select: { questionId: true },
    distinct: ["questionId"],
  });
  const solvedQuestionIds = new Set(correctAttempts.map((attempt) => attempt.questionId));

  return sections.map((section) => {
    const topics: TopicProgress[] = section.topics.map((topic) => {
      const total = topic.questions.length;
      const solved = topic.questions.filter((q) => solvedQuestionIds.has(q.id)).length;
      return { id: topic.id, code: topic.code, name: topic.name, solved, total };
    });
    return {
      id: section.id,
      code: section.code,
      name: section.name,
      order: section.order,
      isOpen: section.isOpen,
      topics,
      solved: topics.reduce((sum, t) => sum + t.solved, 0),
      total: topics.reduce((sum, t) => sum + t.total, 0),
    };
  });
}
