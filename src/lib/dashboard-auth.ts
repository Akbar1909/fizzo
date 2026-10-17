import "server-only";
import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";
import { DASHBOARD_COOKIE_NAME, DASHBOARD_SESSION_MAX_AGE_SECONDS } from "@/lib/constants";

const DASHBOARD_SCOPE = "dashboard";

function secretKey() {
  return new TextEncoder().encode(env.sessionSecret);
}

/** Constant-time string compare, regardless of input length (hash first so lengths always match). */
function safeEqual(a: string, b: string): boolean {
  const ah = createHash("sha256").update(a).digest();
  const bh = createHash("sha256").update(b).digest();
  return timingSafeEqual(ah, bh);
}

export function verifyDashboardCredentials(username: string, password: string): boolean {
  return safeEqual(username, env.dashboardUsername) && safeEqual(password, env.dashboardPassword);
}

export async function createDashboardSessionToken(): Promise<string> {
  return new SignJWT({ scope: DASHBOARD_SCOPE })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DASHBOARD_SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export function dashboardCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/panel",
    maxAge: DASHBOARD_SESSION_MAX_AGE_SECONDS,
  };
}

async function hasValidDashboardSession(): Promise<boolean> {
  const token = (await cookies()).get(DASHBOARD_COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.scope === DASHBOARD_SCOPE;
  } catch {
    return false;
  }
}

export async function requireDashboardAuth(): Promise<void> {
  if (!(await hasValidDashboardSession())) {
    redirect("/panel/login");
  }
}
