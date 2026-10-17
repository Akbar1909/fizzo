import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function readSessionSecret(): string {
  const secret = required("SESSION_SECRET");
  if (secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long");
  }
  return secret;
}

export const env = {
  get telegramBotToken() {
    return required("TELEGRAM_BOT_TOKEN");
  },
  get telegramBotUsername() {
    return process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "";
  },
  get sessionSecret() {
    return readSessionSecret();
  },
  get adminTelegramIds(): string[] {
    return (process.env.ADMIN_TELEGRAM_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  },
  get devLoginEnabled(): boolean {
    return process.env.DEV_LOGIN === "true" && process.env.NODE_ENV !== "production";
  },
  get gaMeasurementId(): string | null {
    return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;
  },
};
