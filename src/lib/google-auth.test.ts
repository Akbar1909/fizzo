import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGoogleAuthUrl } from "./google-auth";

test("buildGoogleAuthUrl: includes client id, redirect uri, and state", () => {
  const url = new URL(
    buildGoogleAuthUrl({
      clientId: "test-client-id",
      redirectUri: "https://fizzo.app/api/auth/google/callback",
      state: "abc123",
    }),
  );

  assert.equal(url.origin + url.pathname, "https://accounts.google.com/o/oauth2/v2/auth");
  assert.equal(url.searchParams.get("client_id"), "test-client-id");
  assert.equal(url.searchParams.get("redirect_uri"), "https://fizzo.app/api/auth/google/callback");
  assert.equal(url.searchParams.get("state"), "abc123");
  assert.equal(url.searchParams.get("response_type"), "code");
  assert.equal(url.searchParams.get("scope"), "openid email profile");
});
