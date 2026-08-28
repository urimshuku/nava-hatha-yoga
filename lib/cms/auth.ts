import { getCmsEnv } from "./env";

/**
 * Login for the built-in CMS: one shared password, and a signed cookie that
 * proves the password was entered. Nothing is stored in the database — the
 * cookie carries its own expiry and an HMAC signature over it, so a tampered or
 * expired cookie is rejected without a lookup.
 *
 * Uses Web Crypto only, so it runs unchanged in middleware and on the worker.
 */

export const CMS_SESSION_COOKIE = "nhy_cms_session";

/** Sessions last 30 days; the client stays logged in between visits. */
export const CMS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const TOKEN_VERSION = "v1";

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Compares two strings without leaking their contents through timing. */
function equalsInConstantTime(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);

  // Comparing lengths directly is fine: the length of a secret is not secret.
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left[i] ^ right[i];
  }
  return diff === 0;
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(signature);
}

export type CmsAuthConfig =
  | { ready: true; password: string; secret: string }
  | { ready: false; reason: string };

/**
 * The CMS refuses to authenticate anyone until both settings exist, so a
 * missing password can never mean "no password required".
 */
export async function getCmsAuthConfig(): Promise<CmsAuthConfig> {
  const [password, secret] = await Promise.all([
    getCmsEnv("CMS_PASSWORD"),
    getCmsEnv("CMS_SESSION_SECRET"),
  ]);

  if (!password || !secret) {
    const missing = [
      !password ? "CMS_PASSWORD" : null,
      !secret ? "CMS_SESSION_SECRET" : null,
    ].filter(Boolean);

    return {
      ready: false,
      reason: `The CMS is not configured yet. Missing: ${missing.join(", ")}.`,
    };
  }

  return { ready: true, password, secret };
}

export async function isPasswordCorrect(input: string): Promise<boolean> {
  const config = await getCmsAuthConfig();
  if (!config.ready) return false;
  return equalsInConstantTime(input, config.password);
}

/** Builds a signed session token valid for CMS_SESSION_MAX_AGE_SECONDS. */
export async function createSessionToken(): Promise<string> {
  const config = await getCmsAuthConfig();
  if (!config.ready) throw new Error(config.reason);

  const expiresAt =
    Math.floor(Date.now() / 1000) + CMS_SESSION_MAX_AGE_SECONDS;
  const payload = `${TOKEN_VERSION}.${expiresAt}`;

  return `${payload}.${await sign(payload, config.secret)}`;
}

/** True when the token is well formed, correctly signed, and not expired. */
export async function isSessionTokenValid(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [version, expiresAt, signature] = parts;
  if (version !== TOKEN_VERSION) return false;

  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || expiry * 1000 <= Date.now()) return false;

  const config = await getCmsAuthConfig();
  if (!config.ready) return false;

  const expected = await sign(`${version}.${expiresAt}`, config.secret);

  return equalsInConstantTime(signature, expected);
}
