import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;

export interface TelegramAuthUser {
  telegramId: bigint;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}

function buildDataCheckString(params: URLSearchParams, excludeKeys: string[]): string {
  const entries: string[] = [];
  for (const [key, value] of params.entries()) {
    if (excludeKeys.includes(key)) continue;
    entries.push(`${key}=${value}`);
  }
  entries.sort();
  return entries.join("\n");
}

function safeHexEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function isAuthDateFresh(authDate: string | null, now: number): boolean {
  if (!authDate) return false;
  const authSeconds = Number(authDate);
  if (!Number.isFinite(authSeconds)) return false;
  return now - authSeconds <= MAX_AUTH_AGE_SECONDS && now - authSeconds >= 0;
}

function parseUserField(raw: string | null): {
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
} | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as {
      first_name?: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
    if (!parsed.first_name) return null;
    return {
      firstName: parsed.first_name,
      lastName: parsed.last_name,
      username: parsed.username,
      photoUrl: parsed.photo_url,
    };
  } catch {
    return null;
  }
}

/**
 * Verifies `Telegram.WebApp.initData` sent from inside a Mini App.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyMiniAppInitData(
  initData: string,
  botToken: string,
  now: number = Math.floor(Date.now() / 1000),
): TelegramAuthUser | null {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;

  if (!isAuthDateFresh(params.get("auth_date"), now)) return null;

  const dataCheckString = buildDataCheckString(params, ["hash"]);
  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (!safeHexEqual(computedHash, hash)) return null;

  const userField = parseUserField(params.get("user"));
  const telegramIdRaw = userField ? JSON.parse(params.get("user")!).id : null;
  if (!userField || telegramIdRaw === undefined || telegramIdRaw === null) return null;

  return {
    telegramId: BigInt(telegramIdRaw),
    firstName: userField.firstName,
    lastName: userField.lastName,
    username: userField.username,
    photoUrl: userField.photoUrl,
  };
}

export interface LoginWidgetPayload {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
}

/**
 * Verifies the payload from the Telegram Login Widget used outside the Mini App.
 * https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyLoginWidget(
  payload: Record<string, string>,
  botToken: string,
  now: number = Math.floor(Date.now() / 1000),
): TelegramAuthUser | null {
  const { hash, ...rest } = payload;
  if (!hash) return null;

  if (!isAuthDateFresh(rest.auth_date ?? null, now)) return null;

  const dataCheckString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("\n");

  const secretKey = createHash("sha256").update(botToken).digest();
  const computedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (!safeHexEqual(computedHash, hash)) return null;
  if (!rest.id || !rest.first_name) return null;

  return {
    telegramId: BigInt(rest.id),
    firstName: rest.first_name,
    lastName: rest.last_name,
    username: rest.username,
    photoUrl: rest.photo_url,
  };
}
