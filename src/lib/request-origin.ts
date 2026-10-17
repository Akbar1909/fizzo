import type { NextRequest } from "next/server";

/**
 * Next.js's standalone server (server.js) always passes an explicit
 * hostname/port to startServer (HOSTNAME env var, defaulting to "0.0.0.0"
 * even when unset) - and whenever both are set, next-server.js builds
 * `request.url`'s origin from them unconditionally, ignoring the actual
 * Host header. Behind a reverse proxy (Caddy/Nginx), that makes
 * `new URL(path, request.url)` resolve to e.g. "http://0.0.0.0:3000/...",
 * which is unreachable from a browser. Build outward-facing URLs (redirects,
 * OAuth redirect_uri) from the forwarded headers instead.
 */
export function publicOrigin(request: NextRequest): string {
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "localhost";
  return `${proto}://${host}`;
}
