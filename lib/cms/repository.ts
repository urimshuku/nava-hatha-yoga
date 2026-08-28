import { cache } from "react";

import { getCmsDb, isMissingColumnError, isMissingTableError } from "./db";

/**
 * Read/write layer for `cms_documents`.
 *
 * Reads are deliberately forgiving: if the database, the table, or the JSON in a
 * row is unusable, they return nothing so the public site falls back to
 * lib/placeholders.ts. Writes throw, so the editor can surface the
 * failure to whoever is saving.
 *
 * `data` is the editor's working copy. `liveData` is the last published
 * snapshot. Save writes `data` only; Publish copies it into `liveData`.
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
  /** Working copy shown in the editor. */
  data: T;
  /** Last version put on the website, or null if it has never been published. */
  liveData: T | null;
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
  /**
   * Put this version on the website: set published and copy `data` into the
   * live snapshot. Omit this on a Save so the public site is left alone.
   */
  publish?: boolean;
  /**
   * Explicit published flag for hide / restore / duplicate. Ignored when
   * `publish` is true. Omit on a Save to keep the current flag.
   */
  published?: boolean;
  hidden?: boolean;
  sortOrder?: number | null;
  /** When renaming, inherit published/live state from this slug. */
  copyStateFromSlug?: string;
}

interface CmsRow {
  type: string;
  slug: string;
  data: string;
  live_data?: string | null;
  published: number;
  hidden: number;
  sort_order: number | null;
  updated_at: string;
}

const SELECT_COLUMNS =
  "type, slug, data, live_data, published, hidden, sort_order, updated_at";

const SELECT_COLUMNS_LEGACY =
  "type, slug, data, published, hidden, sort_order, updated_at";

/** Cross-request reuse inside a warm isolate. 30s is short enough that a save
 *  on another isolate is visible quickly, and long enough that a crawl does
 *  not re-parse every CMS document on each page. */
const READ_TTL_MS = 30_000;

type ListCacheEntry = {
  expires: number;
  documents: CmsDocument<unknown>[];
};

const listCache = new Map<string, ListCacheEntry>();

/** Drop cached CMS reads after a write so the editor sees what they just saved. */
export function invalidateCmsDocumentCache(): void {
  listCache.clear();
}

function rememberList(
  type: CmsDocumentType,
  documents: CmsDocument<unknown>[],
): void {
  listCache.set(type, { expires: Date.now() + READ_TTL_MS, documents });
}

function listFromIsolateCache(
  type: CmsDocumentType,
): CmsDocument<unknown>[] | undefined {
  const hit = listCache.get(type);
  if (!hit || hit.expires <= Date.now()) return undefined;
  return hit.documents;
}

function parseLiveData<T>(raw: string | null | undefined, label: string): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(
      `CMS document ${label} holds invalid live JSON and was ignored.`,
      error,
    );
    return null;
  }
}

function parseRow<T>(row: CmsRow): CmsDocument<T> | null {
  try {
    return {
      type: row.type as CmsDocumentType,
      slug: row.slug,
      data: JSON.parse(row.data) as T,
      liveData: parseLiveData<T>(row.live_data, `${row.type}/${row.slug}`),
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

/** Content the public website should show, or undefined if this row is not live. */
export function publicPayload<T>(document: CmsDocument<T>): T | undefined {
  if (document.hidden || !document.published) return undefined;
  return document.liveData ?? document.data;
}

/** True when the CMS has taken over this type on the public site. */
export function cmsOwnsType<T>(documents: CmsDocument<T>[]): boolean {
  return documents.some((document) => document.hidden || document.published);
}

/** True when a live document has a newer working copy than the website shows. */
export function hasUnpublishedChanges<T>(document: CmsDocument<T>): boolean {
  if (!document.published || document.hidden) return false;
  if (document.liveData == null) return false;
  return JSON.stringify(document.data) !== JSON.stringify(document.liveData);
}

function liveSnapshotJson<T>(existing: CmsDocument<T> | undefined): string | null {
  if (!existing) return null;
  if (existing.liveData != null) return JSON.stringify(existing.liveData);
  if (existing.published) return JSON.stringify(existing.data);
  return null;
}

async function selectRows(
  database: D1Database,
  sql: string,
  binds: unknown[],
): Promise<CmsRow[]> {
  const statement = database.prepare(sql);
  const bound = binds.length > 0 ? statement.bind(...binds) : statement;
  const { results } = await bound.all<CmsRow>();
  return results ?? [];
}

async function listDocumentsFromDb<T>(
  type: CmsDocumentType,
  db?: D1Database,
): Promise<CmsDocument<T>[]> {
  if (!db) {
    const cached = listFromIsolateCache(type);
    if (cached) return cached as CmsDocument<T>[];
  }

  const database = await getCmsDb(db);
  if (!database) return [];

  const order =
    "ORDER BY sort_order IS NULL, sort_order ASC, updated_at DESC";

  try {
    let rows: CmsRow[];
    try {
      rows = await selectRows(
        database,
        `SELECT ${SELECT_COLUMNS} FROM cms_documents WHERE type = ? ${order}`,
        [type],
      );
    } catch (error) {
      if (!isMissingColumnError(error)) throw error;
      rows = await selectRows(
        database,
        `SELECT ${SELECT_COLUMNS_LEGACY} FROM cms_documents WHERE type = ? ${order}`,
        [type],
      );
    }

    const documents = rows.flatMap((row) => {
      const parsed = parseRow<T>(row);
      return parsed ? [parsed] : [];
    });
    if (!db) rememberList(type, documents);
    return documents;
  } catch (error) {
    if (!isMissingTableError(error)) {
      console.error(`Failed to list CMS documents of type "${type}".`, error);
    }
    return [];
  }
}

const listDocumentsCached = cache((type: CmsDocumentType) =>
  listDocumentsFromDb(type),
);

/** Every document of a type, ordered as the editor lists them. Never throws. */
export function listDocuments<T>(
  type: CmsDocumentType,
  db?: D1Database,
): Promise<CmsDocument<T>[]> {
  if (db) return listDocumentsFromDb(type, db);
  return listDocumentsCached(type) as Promise<CmsDocument<T>[]>;
}

async function getDocumentFromDb<T>(
  type: CmsDocumentType,
  slug: string,
  db?: D1Database,
): Promise<CmsDocument<T> | undefined> {
  if (!db) {
    const cached = listFromIsolateCache(type);
    if (cached) {
      return cached.find((entry) => entry.slug === slug) as
        | CmsDocument<T>
        | undefined;
    }
  }

  const database = await getCmsDb(db);
  if (!database) return undefined;

  try {
    let row: CmsRow | null;
    try {
      row = await database
        .prepare(
          `SELECT ${SELECT_COLUMNS}
             FROM cms_documents
            WHERE type = ? AND slug = ?`,
        )
        .bind(type, slug)
        .first<CmsRow>();
    } catch (error) {
      if (!isMissingColumnError(error)) throw error;
      row = await database
        .prepare(
          `SELECT ${SELECT_COLUMNS_LEGACY}
             FROM cms_documents
            WHERE type = ? AND slug = ?`,
        )
        .bind(type, slug)
        .first<CmsRow>();
    }

    if (!row) return undefined;
    return parseRow<T>(row) ?? undefined;
  } catch (error) {
    if (!isMissingTableError(error)) {
      console.error(`Failed to read CMS document ${type}/${slug}.`, error);
    }
    return undefined;
  }
}

const getDocumentCached = cache((type: CmsDocumentType, slug: string) =>
  getDocumentFromDb(type, slug),
);

/** A single document, or undefined when it does not exist. Never throws. */
export function getDocument<T>(
  type: CmsDocumentType,
  slug: string,
  db?: D1Database,
): Promise<CmsDocument<T> | undefined> {
  if (db) return getDocumentFromDb(type, slug, db);
  return getDocumentCached(type, slug) as Promise<CmsDocument<T> | undefined>;
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

  const existing =
    (await getDocumentFromDb<T>(input.type, input.slug, database)) ??
    (input.copyStateFromSlug && input.copyStateFromSlug !== input.slug
      ? await getDocumentFromDb<T>(
          input.type,
          input.copyStateFromSlug,
          database,
        )
      : undefined);

  const dataJson = JSON.stringify(input.data);
  const hidden =
    input.hidden === undefined ? Boolean(existing?.hidden) : Boolean(input.hidden);
  const sortOrder =
    input.sortOrder !== undefined ? input.sortOrder : (existing?.sortOrder ?? null);

  let published: number;
  let liveJson: string | null;

  if (input.publish) {
    published = 1;
    liveJson = dataJson;
  } else if (input.published === false) {
    published = 0;
    liveJson = liveSnapshotJson(existing);
  } else if (input.published === true) {
    published = 1;
    liveJson = liveSnapshotJson(existing) ?? dataJson;
  } else {
    published = existing?.published ? 1 : 0;
    liveJson = liveSnapshotJson(existing);
  }

  await database
    .prepare(
      `INSERT INTO cms_documents
         (type, slug, data, live_data, published, hidden, sort_order, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (type, slug) DO UPDATE SET
         data       = excluded.data,
         live_data  = excluded.live_data,
         published  = excluded.published,
         hidden     = excluded.hidden,
         sort_order = excluded.sort_order,
         updated_at = excluded.updated_at`,
    )
    .bind(
      input.type,
      input.slug,
      dataJson,
      liveJson,
      published,
      hidden ? 1 : 0,
      sortOrder,
      new Date().toISOString(),
    )
    .run();

  invalidateCmsDocumentCache();
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

  invalidateCmsDocumentCache();
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
      publish: hidden ? undefined : true,
      published: hidden ? false : undefined,
      hidden,
      sortOrder: existing.sortOrder,
    },
    db,
  );
}
