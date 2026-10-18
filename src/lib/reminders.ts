import "server-only";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { tashkentDateString, addDaysToTashkentString } from "@/lib/streak";
import { tashkentStringToDbDate } from "@/lib/db-date";
import { getResultsSummary } from "@/lib/results";

async function sendTelegramMessage(chatId: string, text: string, appUrl: string): Promise<boolean> {
  const response = await fetch(`https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: { inline_keyboard: [[{ text: "Davom etish", url: appUrl }]] },
    }),
  });
  return response.ok;
}

function buildMessage(firstName: string, streak: number, weakTopicName: string | null): string {
  const base = `${firstName}, ${streak} kunlik streak'ingiz bugun uzilishi mumkin! Saqlab qolish uchun hech bo'lmasa 1 ta savolga javob bering.`;
  return weakTopicName ? `${base}\n\nTavsiya: "${weakTopicName}" mavzusini mashq qiling.` : base;
}

export interface ReminderRunResult {
  candidates: number;
  sent: number;
  failed: number;
}

/**
 * Streak-risk reminder: users who practiced yesterday (Tashkent) and still have an
 * active streak, but haven't practiced yet today, are about to lose it at midnight.
 * Naturally fires once per lapse since `lastActiveOn` moves on as soon as they act.
 */
export async function sendDailyReminders(appUrl: string): Promise<ReminderRunResult> {
  const yesterday = addDaysToTashkentString(tashkentDateString(new Date()), -1);

  const candidates = await db.user.findMany({
    where: {
      telegramId: { not: null },
      streak: { gt: 0 },
      lastActiveOn: tashkentStringToDbDate(yesterday),
    },
    select: { id: true, telegramId: true, firstName: true, streak: true },
  });

  let sent = 0;
  let failed = 0;

  for (const user of candidates) {
    const summary = await getResultsSummary(user.id);
    const weakTopicName = summary.weakTopics[0]?.name ?? null;
    const message = buildMessage(user.firstName, user.streak, weakTopicName);
    const ok = await sendTelegramMessage(user.telegramId!.toString(), message, appUrl);
    if (ok) sent += 1;
    else failed += 1;
  }

  return { candidates: candidates.length, sent, failed };
}
