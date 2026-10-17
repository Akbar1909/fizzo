import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { verifyLoginWidget, verifyMiniAppInitData } from "./telegram-auth";

const BOT_TOKEN = "123456:TEST-TOKEN-abcDEF";

function signInitData(fields: Record<string, string>): string {
  const dataCheckString = Object.keys(fields)
    .sort()
    .map((key) => `${key}=${fields[key]}`)
    .join("\n");
  const secretKey = createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const hash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  const params = new URLSearchParams({ ...fields, hash });
  return params.toString();
}

function signLoginWidget(fields: Record<string, string>): Record<string, string> {
  const dataCheckString = Object.keys(fields)
    .sort()
    .map((key) => `${key}=${fields[key]}`)
    .join("\n");
  const secretKey = createHash("sha256").update(BOT_TOKEN).digest();
  const hash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  return { ...fields, hash };
}

test("verifyMiniAppInitData: accepts a validly signed payload", () => {
  const now = 1_700_000_000;
  const initData = signInitData({
    auth_date: String(now - 10),
    user: JSON.stringify({ id: 42, first_name: "Aziz", username: "aziz" }),
  });
  const result = verifyMiniAppInitData(initData, BOT_TOKEN, now);
  assert.ok(result);
  assert.equal(result?.telegramId, 42n);
  assert.equal(result?.firstName, "Aziz");
  assert.equal(result?.username, "aziz");
});

test("verifyMiniAppInitData: rejects a tampered field", () => {
  const now = 1_700_000_000;
  const initData = signInitData({
    auth_date: String(now - 10),
    user: JSON.stringify({ id: 42, first_name: "Aziz" }),
  });
  const tampered = initData.replace("Aziz", "Hacker");
  assert.equal(verifyMiniAppInitData(tampered, BOT_TOKEN, now), null);
});

test("verifyMiniAppInitData: rejects an expired auth_date", () => {
  const now = 1_700_000_000;
  const initData = signInitData({
    auth_date: String(now - 25 * 60 * 60),
    user: JSON.stringify({ id: 42, first_name: "Aziz" }),
  });
  assert.equal(verifyMiniAppInitData(initData, BOT_TOKEN, now), null);
});

test("verifyMiniAppInitData: rejects a wrong hash", () => {
  const now = 1_700_000_000;
  const params = new URLSearchParams({
    auth_date: String(now - 10),
    user: JSON.stringify({ id: 42, first_name: "Aziz" }),
    hash: "0".repeat(64),
  });
  assert.equal(verifyMiniAppInitData(params.toString(), BOT_TOKEN, now), null);
});

test("verifyLoginWidget: accepts a validly signed payload", () => {
  const now = 1_700_000_000;
  const payload = signLoginWidget({
    id: "42",
    first_name: "Aziz",
    auth_date: String(now - 10),
  });
  const result = verifyLoginWidget(payload, BOT_TOKEN, now);
  assert.ok(result);
  assert.equal(result?.telegramId, 42n);
});

test("verifyLoginWidget: rejects a tampered field", () => {
  const now = 1_700_000_000;
  const payload = signLoginWidget({
    id: "42",
    first_name: "Aziz",
    auth_date: String(now - 10),
  });
  payload.first_name = "Hacker";
  assert.equal(verifyLoginWidget(payload, BOT_TOKEN, now), null);
});

test("verifyLoginWidget: rejects an expired auth_date", () => {
  const now = 1_700_000_000;
  const payload = signLoginWidget({
    id: "42",
    first_name: "Aziz",
    auth_date: String(now - 25 * 60 * 60),
  });
  assert.equal(verifyLoginWidget(payload, BOT_TOKEN, now), null);
});
