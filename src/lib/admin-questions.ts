import "server-only";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import type { Difficulty, QuestionType } from "@/generated/prisma/client";

function json(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export interface AdminQuestionFilters {
  topicId?: string;
  type?: QuestionType;
  difficulty?: Difficulty;
  published?: "all" | "published" | "unpublished";
}

export async function listQuestionsForAdmin(filters: AdminQuestionFilters) {
  return db.question.findMany({
    where: {
      topicId: filters.topicId || undefined,
      type: filters.type || undefined,
      difficulty: filters.difficulty || undefined,
      isPublished:
        filters.published === "published" ? true : filters.published === "unpublished" ? false : undefined,
    },
    include: { topic: { include: { section: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getQuestionByIdForAdmin(id: string) {
  return db.question.findUnique({ where: { id }, include: { topic: true } });
}

export async function getSectionsForAdmin() {
  return db.section.findMany({
    orderBy: { order: "asc" },
    include: { topics: { orderBy: { order: "asc" } } },
  });
}

export interface QuestionContentInput {
  slug: string;
  topicId: string;
  type: QuestionType;
  difficulty: Difficulty;
  text: string;
  options: unknown;
  answer: unknown;
  solution: unknown;
  mistakes: unknown;
  figure: unknown;
  isPublished: boolean;
}

export async function createQuestionForAdmin(input: QuestionContentInput) {
  return db.question.create({
    data: {
      slug: input.slug,
      topicId: input.topicId,
      type: input.type,
      difficulty: input.difficulty,
      text: input.text,
      options: input.options !== undefined ? json(input.options) : Prisma.JsonNull,
      answer: json(input.answer),
      solution: json(input.solution),
      mistakes: input.mistakes !== undefined ? json(input.mistakes) : Prisma.JsonNull,
      figure: input.figure !== undefined ? json(input.figure) : Prisma.JsonNull,
      isPublished: input.isPublished,
    },
  });
}

export async function updateQuestionForAdmin(id: string, input: QuestionContentInput) {
  return db.question.update({
    where: { id },
    data: {
      slug: input.slug,
      topicId: input.topicId,
      type: input.type,
      difficulty: input.difficulty,
      text: input.text,
      options: input.options !== undefined ? json(input.options) : Prisma.JsonNull,
      answer: json(input.answer),
      solution: json(input.solution),
      mistakes: input.mistakes !== undefined ? json(input.mistakes) : Prisma.JsonNull,
      figure: input.figure !== undefined ? json(input.figure) : Prisma.JsonNull,
      isPublished: input.isPublished,
    },
  });
}

export async function setQuestionPublished(id: string, isPublished: boolean) {
  return db.question.update({ where: { id }, data: { isPublished } });
}

export async function deleteQuestionForAdmin(id: string) {
  return db.question.delete({ where: { id } });
}

export async function exportQuestionsByTopic(topicId: string) {
  const questions = await db.question.findMany({ where: { topicId }, orderBy: { slug: "asc" } });
  return questions.map((q) => ({
    slug: q.slug,
    type: q.type,
    difficulty: q.difficulty,
    text: q.text,
    options: q.options,
    answer: q.answer,
    solution: q.solution,
    mistakes: q.mistakes,
    figure: q.figure,
    isPublished: q.isPublished,
  }));
}

export interface ImportQuestionEntry {
  slug: string;
  type: QuestionType;
  difficulty: Difficulty;
  text: string;
  options?: unknown;
  answer: unknown;
  solution: unknown;
  mistakes?: unknown;
  figure?: unknown;
  isPublished?: boolean;
}

export async function importQuestionsForTopic(topicId: string, entries: ImportQuestionEntry[]) {
  let created = 0;
  let updated = 0;
  for (const entry of entries) {
    const existing = await db.question.findUnique({ where: { slug: entry.slug } });
    const data = {
      slug: entry.slug,
      topicId,
      type: entry.type,
      difficulty: entry.difficulty,
      text: entry.text,
      options: entry.options !== undefined ? json(entry.options) : Prisma.JsonNull,
      answer: json(entry.answer),
      solution: json(entry.solution),
      mistakes: entry.mistakes !== undefined ? json(entry.mistakes) : Prisma.JsonNull,
      figure: entry.figure !== undefined ? json(entry.figure) : Prisma.JsonNull,
      isPublished: entry.isPublished ?? true,
    };
    if (existing) {
      await db.question.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      await db.question.create({ data });
      created += 1;
    }
  }
  return { created, updated };
}
