"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { createReviewSubmission } from "@/lib/reviews";

export async function updateShareActivityAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const shareActivity = formData.get("shareActivity") === "on";
  await db.user.update({ where: { id: user.id }, data: { shareActivity } });
  revalidatePath("/natijalar");
}

const reviewTextSchema = z
  .string()
  .trim()
  .min(10, "Sharh kamida 10 ta belgidan iborat bo'lishi kerak")
  .max(500, "Sharh 500 belgidan oshmasligi kerak");

export interface SubmitReviewState {
  error: string | null;
  success: boolean;
}

export async function submitReviewAction(
  _prevState: SubmitReviewState,
  formData: FormData,
): Promise<SubmitReviewState> {
  const user = await requireUser();

  if (!rateLimit(`submit-review:${user.id}`, { capacity: 3, refillPerSecond: 1 / 3600 })) {
    return { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring.", success: false };
  }

  if (formData.get("consent") !== "on") {
    return { error: "Sharhni chop etish uchun rozilik belgisini qo'ying.", success: false };
  }

  const parsed = reviewTextSchema.safeParse(formData.get("text")?.toString() ?? "");
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot", success: false };
  }

  await createReviewSubmission(user.id, parsed.data);
  revalidatePath("/natijalar");
  return { error: null, success: true };
}
