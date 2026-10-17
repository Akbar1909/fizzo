import { NextResponse, type NextRequest } from "next/server";
import { exchangeGoogleCode, verifyGoogleIdToken } from "@/lib/google-auth";
import { upsertGoogleUser } from "@/lib/users";
import { createSessionToken, sessionCookieOptions } from "@/lib/session";
import { SESSION_COOKIE_NAME, GOOGLE_OAUTH_COOKIE_NAME } from "@/lib/constants";
import { env } from "@/lib/env";
import { sanitizeInternalPath } from "@/lib/safe-path";
import { rateLimit } from "@/lib/rate-limit";
import { publicOrigin } from "@/lib/request-origin";

interface OAuthCookieState {
  state: string;
  keyin: string;
}

function readOAuthCookie(raw: string | undefined): OAuthCookieState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<OAuthCookieState>;
    if (typeof parsed.state !== "string" || typeof parsed.keyin !== "string") return null;
    return { state: parsed.state, keyin: parsed.keyin };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const origin = publicOrigin(request);

  const failureRedirect = () => {
    const response = NextResponse.redirect(new URL("/kirish?xato=1", origin));
    response.cookies.delete(GOOGLE_OAUTH_COOKIE_NAME);
    return response;
  };

  if (!rateLimit(`auth-google:${ip}`, { capacity: 10, refillPerSecond: 10 / 60 })) {
    return NextResponse.redirect(new URL("/kirish?xato=tezkor", origin));
  }

  if (!env.googleClientId || !env.googleClientSecret) {
    return failureRedirect();
  }

  const oauthState = readOAuthCookie(request.cookies.get(GOOGLE_OAUTH_COOKIE_NAME)?.value);
  const stateParam = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");

  if (!oauthState || !stateParam || stateParam !== oauthState.state || !code) {
    return failureRedirect();
  }

  const redirectUri = new URL("/api/auth/google/callback", origin).toString();
  const idToken = await exchangeGoogleCode({
    code,
    redirectUri,
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
  });
  if (!idToken) return failureRedirect();

  const authUser = await verifyGoogleIdToken(idToken, env.googleClientId);
  if (!authUser) return failureRedirect();

  const user = await upsertGoogleUser(authUser);
  const token = await createSessionToken({ userId: user.id });

  const keyin = sanitizeInternalPath(oauthState.keyin);
  const response = NextResponse.redirect(new URL(keyin, origin));
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  response.cookies.delete(GOOGLE_OAUTH_COOKIE_NAME);
  return response;
}
