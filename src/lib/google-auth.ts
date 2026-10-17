import { createRemoteJWKSet, jwtVerify } from "jose";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function googleJwks() {
  if (!jwks) jwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URL));
  return jwks;
}

export interface GoogleAuthUser {
  googleId: string;
  email: string;
  firstName: string;
  lastName?: string;
  photoUrl?: string;
}

export function buildGoogleAuthUrl(params: { clientId: string; redirectUri: string; state: string }): string {
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", params.state);
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

/** Exchanges an authorization code for an ID token. Returns null on any failure. */
export async function exchangeGoogleCode(params: {
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
}): Promise<string | null> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: params.code,
      client_id: params.clientId,
      client_secret: params.clientSecret,
      redirect_uri: params.redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { id_token?: string };
  return data.id_token ?? null;
}

/** Verifies the ID token's signature against Google's JWKS and checks issuer/audience. */
export async function verifyGoogleIdToken(idToken: string, clientId: string): Promise<GoogleAuthUser | null> {
  try {
    const { payload } = await jwtVerify(idToken, googleJwks(), {
      issuer: GOOGLE_ISSUERS,
      audience: clientId,
    });

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    if (payload.email_verified === false) return null;

    const firstName =
      typeof payload.given_name === "string"
        ? payload.given_name
        : typeof payload.name === "string"
          ? payload.name
          : "Foydalanuvchi";

    return {
      googleId: payload.sub,
      email: payload.email,
      firstName,
      lastName: typeof payload.family_name === "string" ? payload.family_name : undefined,
      photoUrl: typeof payload.picture === "string" ? payload.picture : undefined,
    };
  } catch {
    return null;
  }
}
