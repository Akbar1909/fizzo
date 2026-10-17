import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { verifyMiniAppInitData } from "@/lib/telegram-auth";
import { upsertTelegramUser } from "@/lib/users";
import { createSessionToken, sessionCookieOptions } from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({ initData: z.string().min(1) });

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`auth-miniapp:${ip}`, { capacity: 10, refillPerSecond: 10 / 60 })) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const authUser = verifyMiniAppInitData(parsed.data.initData, env.telegramBotToken);
  if (!authUser) {
    return NextResponse.json({ error: "Tasdiqlashda xatolik yuz berdi." }, { status: 401 });
  }

  const user = await upsertTelegramUser(authUser);
  const token = await createSessionToken({ userId: user.id });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  return response;
}
