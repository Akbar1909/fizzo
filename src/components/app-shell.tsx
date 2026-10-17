import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { TopNav } from "@/components/top-nav";
import { displayStreak } from "@/lib/streak";
import { getUserTotalXp } from "@/lib/social";
import type { PublicUser } from "@/lib/users";

export async function AppShell({ user, children }: { user: PublicUser; children: ReactNode }) {
  const streakToShow = displayStreak(
    { streak: user.streak, bestStreak: user.bestStreak, lastActiveOn: user.lastActiveOn },
    new Date(),
  );
  const totalXp = await getUserTotalXp(user.id);

  return (
    <div className="app-shell" style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <TopNav user={user} streakToShow={streakToShow} totalXp={totalXp} />
      <div className="app-shell-content">{children}</div>
      <BottomNav />
    </div>
  );
}
