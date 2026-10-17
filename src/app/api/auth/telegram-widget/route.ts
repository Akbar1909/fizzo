import { NextResponse, type NextRequest } from "next/server";
import { verifyLoginWidget } from "@/lib/telegram-auth";
import { upsertTelegramUser } from "@/lib/users";
import { createSessionToken, sessionCookieOptions } from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { env } from "@/lib/env";
import { sanitizeInternalPath } from "@/lib/safe-path";
import { rateLimit } from "@/lib/rate-limit";

const WIDGET_FIELDS = [
  "id",
  "first_name",
  "last_name",
  "username",
  "photo_url",
  "auth_date",
  "hash",
] as const;

function pickWidgetFields(params: URLSearchParams): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of WIDGET_FIELDS) {
    const value = params.get(key);
    if (value !== null) result[key] = value;
  }
  return result;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const keyin = sanitizeInternalPath(request.nextUrl.searchParams.get("keyin"));

  if (!rateLimit(`auth-widget:${ip}`, { capacity: 10, refillPerSecond: 10 / 60 })) {
    return NextResponse.redirect(new URL("/kirish?xato=tezkor", request.url));
  }

  const fields = pickWidgetFields(request.nextUrl.searchParams);
  const authUser = verifyLoginWidget(fields, env.telegramBotToken);
  if (!authUser) {
    return NextResponse.redirect(new URL("/kirish?xato=1", request.url));
  }

  const user = await upsertTelegramUser(authUser);
  const token = await createSessionToken({ userId: user.id });

  const response = NextResponse.redirect(new URL(keyin, request.url));
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  return response;
}
