import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { buildGoogleAuthUrl } from "@/lib/google-auth";
import { env } from "@/lib/env";
import { sanitizeInternalPath } from "@/lib/safe-path";
import { rateLimit } from "@/lib/rate-limit";
import { GOOGLE_OAUTH_COOKIE_NAME, GOOGLE_OAUTH_MAX_AGE_SECONDS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const keyin = sanitizeInternalPath(request.nextUrl.searchParams.get("keyin"));

  if (!rateLimit(`auth-google:${ip}`, { capacity: 10, refillPerSecond: 10 / 60 })) {
    return NextResponse.redirect(new URL("/kirish?xato=tezkor", request.url));
  }

  if (!env.googleClientId) {
    return NextResponse.redirect(new URL("/kirish?xato=1", request.url));
  }

  const state = randomUUID();
  const redirectUri = new URL("/api/auth/google/callback", request.url).toString();
  const authUrl = buildGoogleAuthUrl({ clientId: env.googleClientId, redirectUri, state });

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(GOOGLE_OAUTH_COOKIE_NAME, JSON.stringify({ state, keyin }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GOOGLE_OAUTH_MAX_AGE_SECONDS,
  });
  return response;
}
