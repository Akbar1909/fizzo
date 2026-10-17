import "server-only";
import { env } from "@/lib/env";

export function isAdminTelegramId(telegramId: bigint | null): boolean {
  if (telegramId === null) return false;
  return env.adminTelegramIds.includes(telegramId.toString());
}
