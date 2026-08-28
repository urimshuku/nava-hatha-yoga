import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getCmsDb, isMissingTableError } from "./db";

/**
 * Image storage for the built-in CMS: bytes in the R2 bucket bound as `MEDIA`,
 * an index row in `cms_media` so the editor can browse what has been uploaded.
 */

export interface MediaItem {
  key: string;
  filename: string;
  contentType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  createdAt: string;
}

interface MediaRow {
  key: string;
  filename: string;
  content_type: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  created_at: string;
}

/**
 * Only formats the browser and Cloudflare resizing both handle. SVG is left out
 * deliberately: it can carry script, and it would be served from our own origin.
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export async function getMediaBucket(): Promise<R2Bucket | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as { MEDIA?: R2Bucket }).MEDIA ?? null;
  } catch {
    return null;
  }
}

function slugifyFilename(filename: string): string {
  return (
    filename
      .replace(/\.[^.]+$/, "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  );
}

/**
 * Keys are grouped by month and suffixed with a random token, so re-uploading a
 * file with the same name never overwrites the image already in use on a page.
 */
function buildKey(filename: string, contentType: string): string {
  const now = new Date();
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const token = crypto.randomUUID().slice(0, 8);
  const extension = EXTENSIONS[contentType] ?? "bin";

  return `${month}/${slugifyFilename(filename)}-${token}.${extension}`;
}

function toItem(row: MediaRow): MediaItem {
  return {
    key: row.key,
    filename: row.filename,
    contentType: row.content_type,
    size: row.size,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    alt: row.alt ?? undefined,
    createdAt: row.created_at,
  };
}

export interface UploadResult {
  key: string;
  width?: number;
  height?: number;
}

export async function uploadImage(input: {
  file: File;
  width?: number;
  height?: number;
  alt?: string;
}): Promise<UploadResult> {
  const bucket = await getMediaBucket();
  if (!bucket) {
    throw new Error(
      "Image storage is not available. Check the R2 binding 'MEDIA'.",
    );
  }

  const contentType = input.file.type;
  if (!ALLOWED_IMAGE_TYPES.includes(contentType as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error("That file is not an image we can use. Use JPG, PNG or WebP.");
  }
  if (input.file.size > MAX_UPLOAD_BYTES) {
    throw new Error("That image is too large. The limit is 10 MB.");
  }

  const key = buildKey(input.file.name, contentType);

  await bucket.put(key, await input.file.arrayBuffer(), {
    httpMetadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  const database = await getCmsDb();
  if (database) {
    await database
      .prepare(
        `INSERT INTO cms_media
           (key, filename, content_type, size, width, height, alt, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        key,
        input.file.name,
        contentType,
        input.file.size,
        input.width ?? null,
        input.height ?? null,
        input.alt ?? null,
        new Date().toISOString(),
      )
      .run();
  }

  return { key, width: input.width, height: input.height };
}

/** Everything uploaded so far, newest first. Never throws. */
export async function listMedia(limit = 200): Promise<MediaItem[]> {
  const database = await getCmsDb();
  if (!database) return [];

  try {
    const { results } = await database
      .prepare(
        `SELECT key, filename, content_type, size, width, height, alt, created_at
           FROM cms_media
          ORDER BY created_at DESC
          LIMIT ?`,
      )
      .bind(limit)
      .all<MediaRow>();

    return (results ?? []).map(toItem);
  } catch (error) {
    if (!isMissingTableError(error)) {
      console.error("Failed to list CMS media.", error);
    }
    return [];
  }
}

export async function getMediaItem(key: string): Promise<MediaItem | undefined> {
  const database = await getCmsDb();
  if (!database) return undefined;

  try {
    const row = await database
      .prepare(
        `SELECT key, filename, content_type, size, width, height, alt, created_at
           FROM cms_media WHERE key = ?`,
      )
      .bind(key)
      .first<MediaRow>();

    return row ? toItem(row) : undefined;
  } catch (error) {
    if (!isMissingTableError(error)) {
      console.error(`Failed to read CMS media ${key}.`, error);
    }
    return undefined;
  }
}
