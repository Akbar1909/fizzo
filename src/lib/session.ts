import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";
import { SESSION_MAX_AGE_SECONDS } from "@/lib/constants";

export interface SessionPayload {
  userId: string;
}

function secretKey() {
  return new TextEncoder().encode(env.sessionSecret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.userId !== "string") return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    // Shared across fizzo.app and its subdomains (e.g. head.fizzo.app) so an
    // admin session from the main site also works on the admin dashboard.
    domain: isProd ? ".fizzo.app" : undefined,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
