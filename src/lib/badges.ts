import "server-only";
import { getSectionsWithProgress } from "@/lib/progress";

export interface SectionBadge {
  code: string;
  name: string;
  earned: boolean;
  solved: number;
  total: number;
}

/** A section badge is earned once every published question in that (open) section has been solved correctly. */
export async function getSectionBadges(userId: string): Promise<SectionBadge[]> {
  const sections = await getSectionsWithProgress(userId);
  return sections
    .filter((s) => s.isOpen && s.total > 0)
    .map((s) => ({ code: s.code, name: s.name, earned: s.solved === s.total, solved: s.solved, total: s.total }));
}
