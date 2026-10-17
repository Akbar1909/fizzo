import "server-only";
import { db } from "@/lib/db";
import type { ReviewStatus } from "@/generated/prisma/client";

function displayName(firstName: string, lastName: string | null): string {
  const initial = lastName ? ` ${lastName.charAt(0).toUpperCase()}.` : "";
  return `${firstName}${initial}`;
}

export interface PublicReview {
  id: string;
  text: string;
  displayName: string;
}

export async function getApprovedReviews(limit = 6): Promise<PublicReview[]> {
  const reviews = await db.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { decidedAt: "desc" },
    take: limit,
    include: { user: { select: { firstName: true, lastName: true } } },
  });
  return reviews.map((r) => ({
    id: r.id,
    text: r.text,
    displayName: displayName(r.user.firstName, r.user.lastName),
  }));
}

export async function createReviewSubmission(userId: string, text: string) {
  return db.review.create({ data: { userId, text, status: "PENDING" } });
}

export async function getUserPendingOrRecentReview(userId: string) {
  return db.review.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function listReviewsForAdmin(status?: ReviewStatus) {
  return db.review.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { firstName: true, lastName: true, username: true } } },
  });
}

export async function decideReview(id: string, status: "APPROVED" | "REJECTED") {
  return db.review.update({ where: { id }, data: { status, decidedAt: new Date() } });
}
