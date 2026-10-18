import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { sanitizeInternalPath } from "@/lib/safe-path";
import { publicOrigin } from "@/lib/request-origin";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isRoot = request.nextUrl.pathname === "/";

  // head.fizzo.app serves the same app, but should land straight on the password-gated panel.
  if (isRoot && host.startsWith("head.")) {
    return NextResponse.rewrite(new URL("/panel", request.url));
  }

  if (isRoot) {
    return NextResponse.next();
  }

  if (request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/kirish", publicOrigin(request));
  const keyin = sanitizeInternalPath(request.nextUrl.pathname + request.nextUrl.search);
  if (keyin !== "/") {
    loginUrl.searchParams.set("keyin", keyin);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    // "panel" is excluded because it has its own username+password gate
    // (src/lib/dashboard-auth.ts), independent of the Telegram/Google session.
    // robots.txt / sitemap.xml / opengraph-image must stay public for crawlers,
    // which never carry a session cookie.
    "/((?!api|_next/static|_next/image|kirish|panel|robots.txt|sitemap.xml|opengraph-image|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|webmanifest)$).*)",
  ],
};
