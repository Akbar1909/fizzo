import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { sanitizeInternalPath } from "@/lib/safe-path";
import { publicOrigin } from "@/lib/request-origin";

export function proxy(request: NextRequest) {
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
    "/((?!api|_next/static|_next/image|kirish|$|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|webmanifest)$).*)",
  ],
};
