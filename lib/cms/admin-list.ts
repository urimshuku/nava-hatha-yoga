import { eventStartTimestamp, isPastEvent } from "@/lib/event-boundary";
import type {
  ProgramListItem,
  RetreatListItem,
  YogaEvent,
} from "@/lib/cms/content-types";

import {
  hasUnpublishedChanges,
  listDocuments,
  type CmsDocument,
} from "./repository";

/**
 * Builds the lists the editor shows: every event, program and retreat stored
 * here, including hidden ones so they can be brought back.
 */

export type ContentSource = "cms";

export interface AdminListEntry {
  slug: string;
  title: string;
  source: ContentSource;
  /** True when the entry is deliberately kept off the public website. */
  hidden: boolean;
  /** Editing in progress: saved in the CMS but not shown on the website yet. */
  draft: boolean;
  /** Live on the website, but the editor has a newer saved copy. */
  unpublishedChanges: boolean;
  updatedAt?: string;
  date?: string;
  endDate?: string;
}

function toEntry<T extends { title?: string; date?: string; endDate?: string }>(
  document: CmsDocument<T>,
): AdminListEntry {
  const data = document.data;

  return {
    slug: document.slug,
    title: data?.title?.trim() || document.slug,
    source: "cms",
    hidden: document.hidden,
    draft: !document.published && !document.hidden,
    unpublishedChanges: hasUnpublishedChanges(document),
    updatedAt: document.updatedAt,
    date: data?.date,
    endDate: data?.endDate,
  };
}

function boundary(entry: AdminListEntry) {
  return { date: entry.date ?? "", endDate: entry.endDate };
}

export function isPastAdminEntry(entry: AdminListEntry): boolean {
  if (!entry.date && !entry.endDate) return false;
  return isPastEvent(boundary(entry));
}

/** Earliest date first. Entries with no date go last. */
export function compareStartDateAscending(
  a: AdminListEntry,
  b: AdminListEntry,
): number {
  return eventStartTimestamp(boundary(a)) - eventStartTimestamp(boundary(b));
}

/** Latest date first. */
export function compareStartDateDescending(
  a: AdminListEntry,
  b: AdminListEntry,
): number {
  return compareStartDateAscending(b, a);
}

export async function listEventEntries(): Promise<AdminListEntry[]> {
  const documents = await listDocuments<YogaEvent>("event");
  return documents.map(toEntry);
}

export async function listRetreatEntries(): Promise<AdminListEntry[]> {
  const documents = await listDocuments<RetreatListItem>("retreat");
  return documents.map(toEntry);
}

export async function listProgramEntries(): Promise<AdminListEntry[]> {
  const documents = await listDocuments<ProgramListItem>("program");
  return documents.map(toEntry).sort((a, b) => a.title.localeCompare(b.title));
}
