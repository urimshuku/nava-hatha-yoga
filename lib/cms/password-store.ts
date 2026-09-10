import { getCmsDb, isMissingTableError } from "./db";

/**
 * Hashed CMS password kept in D1 so the site owner can change it from /admin
 * without updating the Cloudflare secret. Sign-in prefers this row; it falls
 * back to CMS_PASSWORD when the table is empty.
 */

const PBKDF2_ITERATIONS = 100_000;
const HASH_PREFIX = "pbkdf2-sha256";

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function equalsInConstantTime(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left[i] ^ right[i];
  }
  return diff === 0;
}

async function deriveBits(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt as BufferSource,
      iterations,
    },
    material,
    256,
  );
  return new Uint8Array(bits);
}

export async function hashCmsPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveBits(password, salt, PBKDF2_ITERATIONS);
  return `${HASH_PREFIX}$${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(hash)}`;
}

export async function cmsPasswordMatchesHash(
  password: string,
  stored: string,
): Promise<boolean> {
  const [prefix, iterationText, saltText, hashText] = stored.split("$");
  const iterations = Number(iterationText);
  if (
    prefix !== HASH_PREFIX ||
    !Number.isFinite(iterations) ||
    iterations < 1 ||
    !saltText ||
    !hashText
  ) {
    return false;
  }

  const salt = fromBase64Url(saltText);
  const expected = fromBase64Url(hashText);
  const actual = await deriveBits(password, salt, iterations);
  return equalsInConstantTime(actual, expected);
}

export async function getStoredCmsPasswordHash(): Promise<string | null> {
  const db = await getCmsDb();
  if (!db) return null;

  try {
    const row = await db
      .prepare("SELECT password_hash FROM cms_password WHERE id = 1")
      .first<{ password_hash: string }>();
    const hash = row?.password_hash?.trim();
    return hash ? hash : null;
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

export async function saveCmsPasswordHash(passwordHash: string): Promise<void> {
  const db = await getCmsDb();
  if (!db) {
    throw new Error(
      "The password could not be saved because the database is not available.",
    );
  }

  try {
    await db
      .prepare(
        `INSERT INTO cms_password (id, password_hash, updated_at)
         VALUES (1, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           password_hash = excluded.password_hash,
           updated_at = excluded.updated_at`,
      )
      .bind(passwordHash, new Date().toISOString())
      .run();
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new Error(
        "The password could not be saved because the database is not ready yet.",
      );
    }
    throw error;
  }
}
