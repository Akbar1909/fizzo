import { createHash, timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { sendDailyReminders } from "@/lib/reminders";

function safeEqual(a: string, b: string): boolean {
  const ah = createHash("sha256").update(a).digest();
  const bh = createHash("sha256").update(b).digest();
  return timingSafeEqual(ah, bh);
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret") ?? "";
  if (!safeEqual(secret, env.cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sendDailyReminders(new URL("/", request.url).toString());
  return NextResponse.json(result);
}
