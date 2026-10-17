import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { publicOrigin } from "./request-origin";

function requestWith(headers: Record<string, string>): NextRequest {
  return new NextRequest("http://0.0.0.0:3000/api/auth/google", { headers });
}

test("publicOrigin: prefers x-forwarded-proto/x-forwarded-host (reverse proxy)", () => {
  const request = requestWith({
    host: "0.0.0.0:3000",
    "x-forwarded-proto": "https",
    "x-forwarded-host": "fizzo.app",
  });
  assert.equal(publicOrigin(request), "https://fizzo.app");
});

test("publicOrigin: falls back to the host header when not behind a proxy", () => {
  const request = requestWith({ host: "localhost:3000" });
  assert.equal(publicOrigin(request), "http://localhost:3000");
});

test("publicOrigin: falls back to localhost when no host header at all", () => {
  const request = requestWith({});
  assert.equal(publicOrigin(request), "http://localhost");
});
