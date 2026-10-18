"use server";

import { redirect } from "next/navigation";
import { requireDashboardAuth } from "@/lib/dashboard-auth";
import { decideReview } from "@/lib/reviews";

export async function decideReviewAction(formData: FormData): Promise<void> {
  await requireDashboardAuth();
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  if (!id || (status !== "APPROVED" && status !== "REJECTED")) return;

  await decideReview(id, status);
  redirect("/panel/sharhlar");
}
