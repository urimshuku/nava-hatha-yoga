import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * D1 access for the built-in CMS. Shares the `DB` binding with form submissions
 * (see lib/form-store.ts) — the CMS lives in its own `cms_documents` table.
 */

/**
 * Resolve the D1 binding, or null when it is unavailable (for example a local
 * dev server started without the Cloudflare bindings). Callers treat null as
 * "the CMS has no content", so the site keeps rendering from placeholders.
 */
export async function getCmsDb(db?: D1Database): Promise<D1Database | null> {
  if (db) return db;

  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as { DB?: D1Database }).DB ?? null;
  } catch {
    return null;
  }
}

/**
 * True once the `cms_documents` table exists. A fresh database that has not had
 * migrations applied yet must not break the public site, so we detect the
 * missing table instead of letting the query throw.
 */
export function isMissingTableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /no such table/i.test(message);
}
