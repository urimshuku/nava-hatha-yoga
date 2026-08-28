import { composeEventTimeLabel } from "@/lib/utils";
import type {
  Program,
  ProgramListItem,
  Retreat,
  RetreatListItem,
  YogaEvent,
} from "./content-types";

import { listDocuments, type CmsDocument } from "./repository";

/**
 * Turns published CMS documents into the lists the website renders.
 *
 * Hidden documents are omitted. Unpublished documents are ignored. Documents
 * that only exist in the CMS are included. When there are no CMS rows of a
 * type, callers fall back to lib/placeholders.ts.
 */

/** Ids are namespaced so CMS documents can never collide with Sanity ids. */
export function cmsDocumentId(type: string, slug: string): string {
  return `cms.${type}.${slug}`;
}

type Partitioned<T> = {
  hiddenSlugs: Set<string>;
  liveBySlug: Map<string, CmsDocument<T>>;
};

function partition<T>(documents: CmsDocument<T>[]): Partitioned<T> {
  const hiddenSlugs = new Set<string>();
  const liveBySlug = new Map<string, CmsDocument<T>>();

  for (const document of documents) {
    if (document.hidden) {
      hiddenSlugs.add(document.slug);
      continue;
    }
    if (!document.published) continue;
    liveBySlug.set(document.slug, document);
  }

  return { hiddenSlugs, liveBySlug };
}

/**
 * Replaces, adds and removes entries in a Sanity-sourced list. `normalize` turns
 * a stored document into the shape the site's components expect.
 */
function merge<TStored, TResult extends { slug?: string }>(
  fromSanity: TResult[],
  documents: CmsDocument<TStored>[],
  normalize: (document: CmsDocument<TStored>) => TResult,
): TResult[] {
  if (documents.length === 0) return fromSanity;

  const { hiddenSlugs, liveBySlug } = partition(documents);
  const replaced = new Set<string>();
  const merged: TResult[] = [];

  for (const item of fromSanity) {
    const slug = item.slug;
    if (slug && hiddenSlugs.has(slug)) continue;

    const override = slug ? liveBySlug.get(slug) : undefined;
    if (override) {
      merged.push(normalize(override));
      replaced.add(override.slug);
      continue;
    }

    merged.push(item);
  }

  for (const [slug, document] of liveBySlug) {
    if (!replaced.has(slug)) merged.push(normalize(document));
  }

  return merged;
}

function normalizeEvent(document: CmsDocument<YogaEvent>): YogaEvent {
  const event = document.data;

  return {
    ...event,
    _id: event._id ?? cmsDocumentId("event", document.slug),
    // The row's slug is the document's identity; the stored copy may lag behind.
    slug: document.slug,
    _updatedAt: document.updatedAt,
    time: composeEventTimeLabel(event),
  };
}

function normalizeProgram(document: CmsDocument<Program>): Program {
  const program = document.data;

  return {
    ...program,
    _id: program._id ?? cmsDocumentId("program", document.slug),
    slug: document.slug,
  };
}

function normalizeRetreat(document: CmsDocument<Retreat>): Retreat {
  const retreat = document.data;

  return {
    ...retreat,
    _id: retreat._id ?? cmsDocumentId("retreat", document.slug),
    slug: document.slug,
  };
}

function byDateAscending(a: { date?: string }, b: { date?: string }): number {
  return (a.date ?? "").localeCompare(b.date ?? "");
}

/**
 * Applies CMS overrides to the full event list. Call this after the Sanity
 * events have had their slugs resolved, so both sides are keyed the same way.
 */
export async function applyEventOverrides(
  fromSanity: YogaEvent[],
): Promise<YogaEvent[]> {
  const documents = await listDocuments<YogaEvent>("event");
  if (documents.length === 0) return fromSanity;

  return merge(fromSanity, documents, normalizeEvent).sort(byDateAscending);
}

export async function applyProgramOverrides(
  fromSanity: ProgramListItem[],
): Promise<ProgramListItem[]> {
  const documents = await listDocuments<Program>("program");
  if (documents.length === 0) return fromSanity;

  return merge(fromSanity, documents, normalizeProgram);
}

/**
 * Keeps generated routes and the sitemap in step with the CMS: programs added
 * there get a page, hidden ones lose theirs.
 */
export async function applyProgramSlugOverrides(
  fromSanity: { slug: string; _updatedAt?: string }[],
): Promise<{ slug: string; _updatedAt?: string }[]> {
  const documents = await listDocuments<Program>("program");
  if (documents.length === 0) return fromSanity;

  return merge(fromSanity, documents, (document) => ({
    slug: document.slug,
    _updatedAt: document.updatedAt,
  }));
}

export async function applyRetreatOverrides(
  fromSanity: RetreatListItem[],
): Promise<RetreatListItem[]> {
  const documents = await listDocuments<Retreat>("retreat");
  if (documents.length === 0) return fromSanity;

  return merge(fromSanity, documents, normalizeRetreat);
}

export async function applyRetreatSlugOverrides(
  fromSanity: { slug: string; _updatedAt?: string }[],
): Promise<{ slug: string; _updatedAt?: string }[]> {
  const documents = await listDocuments<Retreat>("retreat");
  if (documents.length === 0) return fromSanity;

  return merge(fromSanity, documents, (document) => ({
    slug: document.slug,
    _updatedAt: document.updatedAt,
  }));
}

export type RetreatOverride =
  | { status: "none" }
  | { status: "hidden" }
  | { status: "found"; retreat: Retreat };

export async function getRetreatOverride(
  slug: string,
): Promise<RetreatOverride> {
  const documents = await listDocuments<Retreat>("retreat");
  const document = documents.find((entry) => entry.slug === slug);

  if (!document) return { status: "none" };
  if (document.hidden) return { status: "hidden" };
  if (!document.published) return { status: "none" };

  return { status: "found", retreat: normalizeRetreat(document) };
}

export type ProgramOverride =
  | { status: "none" }
  | { status: "hidden" }
  | { status: "found"; program: Program };

/**
 * A single program from the CMS. `hidden` tells the caller to treat the program
 * as non-existent rather than falling back to a placeholder.
 */
export async function getProgramOverride(
  slug: string,
): Promise<ProgramOverride> {
  const documents = await listDocuments<Program>("program");
  const document = documents.find((entry) => entry.slug === slug);

  if (!document) return { status: "none" };
  if (document.hidden) return { status: "hidden" };
  if (!document.published) return { status: "none" };

  return { status: "found", program: normalizeProgram(document) };
}
