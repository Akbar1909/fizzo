"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import {
  createFullMockSession,
  createQuickMockSession,
  createSectionMockSession,
  finishMockSession,
  getActiveMockSession,
  saveMockAnswer,
  toggleMockFlag,
} from "@/lib/mock";

export async function startMockAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const existing = await getActiveMockSession(user.id);
  if (!existing) {
    const mode = formData.get("mode")?.toString();
    if (mode === "quick") {
      await createQuickMockSession(user.id);
    } else if (mode === "section") {
      const sectionCode = formData.get("sectionCode")?.toString();
      if (!sectionCode) throw new Error("sectionCode is required for a section mock");
      await createSectionMockSession(user.id, sectionCode);
    } else {
      await createFullMockSession(user.id);
    }
  }
  redirect("/mock");
}

const saveAnswerSchema = z.object({
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  response: z.unknown(),
});

export async function saveMockAnswerAction(input: unknown): Promise<{ ok: boolean }> {
  const user = await requireUser();
  if (!rateLimit(`mock-answer:${user.id}`, { capacity: 90, refillPerSecond: 1.5 })) {
    return { ok: false };
  }
  const parsed = saveAnswerSchema.parse(input);
  const result = await saveMockAnswer(parsed.sessionId, user.id, parsed.questionId, parsed.response);
  return { ok: Boolean(result) };
}

const flagSchema = z.object({
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
});

export async function toggleFlagAction(input: unknown): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const parsed = flagSchema.parse(input);
  const result = await toggleMockFlag(parsed.sessionId, user.id, parsed.questionId);
  return { ok: Boolean(result) };
}

const finishSchema = z.object({ sessionId: z.string().min(1) });

export async function finishMockAction(input: unknown): Promise<void> {
  const user = await requireUser();
  const parsed = finishSchema.parse(input);
  const session = await finishMockSession(parsed.sessionId, user.id);
  redirect(`/mock/${session.id}/natija`);
}
