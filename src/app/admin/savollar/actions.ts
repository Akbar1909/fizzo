"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  createQuestionForAdmin,
  deleteQuestionForAdmin,
  importQuestionsForTopic,
  setQuestionPublished,
  updateQuestionForAdmin,
} from "@/lib/admin-questions";
import { parseQuestionContent, questionFormSchema } from "@/lib/admin-schemas";
import { z } from "zod";

export interface SaveQuestionState {
  error: string | null;
}

export async function saveQuestionAction(
  _prevState: SaveQuestionState,
  formData: FormData,
): Promise<SaveQuestionState> {
  await requireAdmin();

  const raw = {
    id: formData.get("id")?.toString() || undefined,
    slug: formData.get("slug")?.toString() ?? "",
    topicId: formData.get("topicId")?.toString() ?? "",
    type: formData.get("type")?.toString() ?? "Y1",
    difficulty: formData.get("difficulty")?.toString() ?? "MEDIUM",
    text: formData.get("text")?.toString() ?? "",
    optionsJson: formData.get("optionsJson")?.toString() ?? "",
    answerJson: formData.get("answerJson")?.toString() ?? "",
    solutionJson: formData.get("solutionJson")?.toString() ?? "",
    mistakesJson: formData.get("mistakesJson")?.toString() ?? "",
    figureJson: formData.get("figureJson")?.toString() ?? "",
    isPublished: formData.get("isPublished") === "on",
  };

  const parsed = questionFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot" };
  }

  let content;
  try {
    content = parseQuestionContent(parsed.data);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "JSON xatolik" };
  }

  const payload = {
    slug: parsed.data.slug,
    topicId: parsed.data.topicId,
    type: parsed.data.type,
    difficulty: parsed.data.difficulty,
    text: parsed.data.text,
    ...content,
    isPublished: parsed.data.isPublished,
  };

  try {
    if (parsed.data.id) {
      await updateQuestionForAdmin(parsed.data.id, payload);
    } else {
      await createQuestionForAdmin(payload);
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Saqlashda xatolik" };
  }

  redirect("/admin/savollar");
}

export async function deleteQuestionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;
  await deleteQuestionForAdmin(id);
  redirect("/admin/savollar");
}

export async function togglePublishAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  const next = formData.get("next") === "true";
  if (!id) return;
  await setQuestionPublished(id, next);
  redirect("/admin/savollar");
}

const importSchema = z.object({ topicId: z.string().min(1) });

export async function importQuestionsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = importSchema.safeParse({ topicId: formData.get("topicId")?.toString() });
  if (!parsed.success) return;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const text = await file.text();
  const entries = JSON.parse(text);
  if (!Array.isArray(entries)) throw new Error("JSON massiv bo'lishi kerak");

  await importQuestionsForTopic(parsed.data.topicId, entries);
  redirect("/admin/savollar");
}
