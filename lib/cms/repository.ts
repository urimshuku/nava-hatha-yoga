import { getCmsDb, isMissingTableError } from "./db";

/**
 * Read/write layer for `cms_documents`.
 *
 * Reads are deliberately forgiving: if the database, the table, or the JSON in a
 * row is unusable, they return nothing so the public site falls back to
 * lib/placeholders.ts. Writes throw, so the editor can surface the
 * failure to whoever is saving.
 */

/**
 * Collections hold many documents keyed by slug; the page types hold exactly one
 * document, stored under the slug `default`.
 */
export type CmsDocumentType =
  | "event"
  | "program"
  | "retreat"
  | "siteSettings"
  | "homePage"
  | "aboutPage"
  | "programsPage"
  | "eventsPage"
  | "retreatsPage"
  | "contactPage"
  | "registerPage"
  | "legalPage";

/** Slug used by the document types that only ever have one document. */
export const SINGLETON_SLUG = "default";

export interface CmsDocument<T> {
  type: CmsDocumentType;
  slug: string;
  data: T;
  /** False keeps a document out of the public site while it is being written. */
  published: boolean;
  /** True removes this document from the public site. */
  hidden: boolean;
  sortOrder: number | null;
  updatedAt: string;
}

export interface SaveCmsDocumentInput<T> {
  type: CmsDocumentType;
  slug: string;
  data: T;
  published?: boolean;
  hidden?: boolean;
  sortOrder?: number | null;
}

interface CmsRow {
  type: string;
  slug: string;
  data: string;
  published: number;
  hidden: number;
  sort_order: number | null;
  updated_at: string;
}

const SELECT_COLUMNS =
  "type, slug, data, published, hidden, sort_order, updated_at";

function parseRow<T>(row: CmsRow): CmsDocument<T> | null {
  try {
    return {
      type: row.type as CmsDocumentType,
      slug: row.slug,
      data: JSON.parse(row.data) as T,
      published: row.published === 1,
      hidden: row.hidden === 1,
      sortOrder: row.sort_order,
      updatedAt: row.updated_at,
    };
  } catch (error) {
    console.error(
      `CMS document ${row.type}/${row.slug} holds invalid JSON and was skipped.`,
      error,
    );
    return null;
  }
}

/** Every document of a type, ordered as the editor lists them. Never throws. */
export async function listDocuments<T>(
  type: CmsDocumentType,
  db?: D1Database,
): Promise<CmsDocument<T>[]> {
  const database = await getCmsDb(db);
  if (!database) return [];

  try {
    const { results } = await database
      .prepare(
        `SELECT ${SELECT_COLUMNS}
           FROM cms_documents
          WHERE type = ?
          ORDER BY sort_order IS NULL, sort_order ASC, updated_at DESC`,
      )
      .bind(type)
      .all<CmsRow>();

    return (results ?? []).flatMap((row) => {
      const parsed = parseRow<T>(row);
      return parsed ? [parsed] : [];
    });
  } catch (error) {
    if (!isMissingTableError(error)) {
      console.error(`Failed to list CMS documents of type "${type}".`, error);
    }
    return [];
  }
}

/** A single document, or undefined when it does not exist. Never throws. */
export async function getDocument<T>(
  type: CmsDocumentType,
  slug: string,
  db?: D1Database,
): Promise<CmsDocument<T> | undefined> {
  const database = await getCmsDb(db);
  if (!database) return undefined;

  try {
    const row = await database
      .prepare(
        `SELECT ${SELECT_COLUMNS}
           FROM cms_documents
          WHERE type = ? AND slug = ?`,
      )
      .bind(type, slug)
      .first<CmsRow>();

    if (!row) return undefined;
    return parseRow<T>(row) ?? undefined;
  } catch (error) {
    if (!isMissingTableError(error)) {
      console.error(`Failed to read CMS document ${type}/${slug}.`, error);
    }
    return undefined;
  }
}

/** Creates or replaces a document. Throws when the write cannot be completed. */
export async function saveDocument<T>(
  input: SaveCmsDocumentInput<T>,
  db?: D1Database,
): Promise<void> {
  const database = await getCmsDb(db);
  if (!database) {
    throw new Error(
      "The CMS database is not available. Check the D1 binding 'DB'.",
    );
  }

  await database
    .prepare(
      `INSERT INTO cms_documents
         (type, slug, data, published, hidden, sort_order, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (type, slug) DO UPDATE SET
         data       = excluded.data,
         published  = excluded.published,
         hidden     = excluded.hidden,
         sort_order = excluded.sort_order,
         updated_at = excluded.updated_at`,
    )
    .bind(
      input.type,
      input.slug,
      JSON.stringify(input.data),
      input.published === false ? 0 : 1,
      input.hidden ? 1 : 0,
      input.sortOrder ?? null,
      new Date().toISOString(),
    )
    .run();
}

/** Removes a document outright. Throws when the write cannot be completed. */
export async function deleteDocument(
  type: CmsDocumentType,
  slug: string,
  db?: D1Database,
): Promise<void> {
  const database = await getCmsDb(db);
  if (!database) {
    throw new Error(
      "The CMS database is not available. Check the D1 binding 'DB'.",
    );
  }

  await database
    .prepare(`DELETE FROM cms_documents WHERE type = ? AND slug = ?`)
    .bind(type, slug)
    .run();
}

/**
 * A tombstone is a leftover row whose only purpose was to hide a document that
 * no longer exists. Restoring it means deleting the row; restoring a hidden
 * document that does have content means clearing the flag instead.
 */
export function isTombstone(data: unknown): boolean {
  return Boolean(
    data && typeof data === "object" && "__tombstone" in (data as object),
  );
}

/** Hides a document that exists only in Sanity, without inventing content. */
export async function hideSanityDocument(
  type: CmsDocumentType,
  slug: string,
  title: string,
  db?: D1Database,
): Promise<void> {
  await saveDocument(
    {
      type,
      slug,
      data: { __tombstone: true, title, slug },
      published: false,
      hidden: true,
    },
    db,
  );
}

/**
 * Takes a document off the website or puts it back, leaving its content alone so
 * nothing is lost while it is hidden.
 */
export async function setDocumentHidden(
  type: CmsDocumentType,
  slug: string,
  hidden: boolean,
  db?: D1Database,
): Promise<void> {
  const existing = await getDocument<unknown>(type, slug, db);
  if (!existing) return;

  if (!hidden && isTombstone(existing.data)) {
    await deleteDocument(type, slug, db);
    return;
  }

  await saveDocument(
    {
      type,
      slug,
      data: existing.data,
      published: hidden ? false : true,
      hidden,
      sortOrder: existing.sortOrder,
    },
    db,
  );
}
