"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { decideReview } from "@/lib/reviews";

export async function decideReviewAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  if (!id || (status !== "APPROVED" && status !== "REJECTED")) return;

  await decideReview(id, status);
  redirect("/admin/sharhlar");
}
