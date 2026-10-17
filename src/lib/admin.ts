import "server-only";
import { env } from "@/lib/env";

export function isAdminTelegramId(telegramId: bigint): boolean {
  return env.adminTelegramIds.includes(telegramId.toString());
}
