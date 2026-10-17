"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/nav-items";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/avatar";
import type { PublicUser } from "@/lib/users";

function FlameIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-8z"
        fill="currentColor"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
    </svg>
  );
}

export function TopNav({
  user,
  streakToShow,
  totalXp,
}: {
  user: PublicUser;
  streakToShow: number;
  totalXp: number;
}) {
  const pathname = usePathname();

  return (
    <header className="top-nav" aria-label="Asosiy navigatsiya">
      <div className="page-wide top-nav-inner">
        <Logo height={24} />

        <nav className="top-nav-items">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="top-nav-pill" aria-current={isActive ? "page" : undefined}>
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="top-nav-right">
          <span className="stat-pill stat-pill-streak">
            <FlameIcon />
            {streakToShow}
          </span>
          <span className="stat-pill stat-pill-xp">
            <BoltIcon />
            {totalXp}
          </span>
          <span className="nav-avatar">
            <Avatar name={user.firstName} photoUrl={user.photoUrl} />
          </span>
        </div>
      </div>
    </header>
  );
}
