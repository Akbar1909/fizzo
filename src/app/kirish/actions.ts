"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { upsertTelegramUser } from "@/lib/users";
import { createSessionToken, sessionCookieOptions } from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { sanitizeInternalPath } from "@/lib/safe-path";
import { rateLimit } from "@/lib/rate-limit";

const DEV_USER_TELEGRAM_ID = 999999999n;

export async function devLoginAction(formData: FormData): Promise<void> {
  if (!env.devLoginEnabled) {
    throw new Error("DEV_LOGIN o'chirilgan.");
  }

  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`dev-login:${ip}`, { capacity: 20, refillPerSecond: 1 })) {
    throw new Error("Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring.");
  }

  const user = await upsertTelegramUser({
    telegramId: DEV_USER_TELEGRAM_ID,
    firstName: "Test",
    lastName: "Foydalanuvchi",
    username: "test_user",
  });

  const token = await createSessionToken({ userId: user.id });
  (await cookies()).set(SESSION_COOKIE_NAME, token, sessionCookieOptions());

  const keyin = sanitizeInternalPath(formData.get("keyin")?.toString());
  redirect(keyin);
}
