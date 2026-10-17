import "server-only";
import { db } from "@/lib/db";

export async function getTopicByCode(code: string) {
  return db.topic.findUnique({
    where: { code },
    include: { section: true },
  });
}
