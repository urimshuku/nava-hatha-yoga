import { eventStartTimestamp, isPastEvent } from "@/lib/event-boundary";
import { composeEventTimeLabel, resolveEventCardEndDate } from "@/lib/utils";
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
  /** Composed session schedule, used so last session end matches the public site. */
  time?: string;
  /** Event type shown on the public cards, for example Workshop or Retreat. */
  category?: string;
}

function toEntry<
  T extends {
    title?: string;
    date?: string;
    endDate?: string;
    category?: string;
    sessions?: { day?: string; hours?: string }[];
    sessionNote?: string;
    time?: string;
    description?: string;
  },
>(document: CmsDocument<T>, fallbackCategory?: string): AdminListEntry {
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
    endDate: resolveEventCardEndDate(data ?? {}) ?? data?.endDate,
    time: composeEventTimeLabel(data ?? {}),
    category: data?.category ?? fallbackCategory,
  };
}

function boundary(entry: AdminListEntry) {
  return { date: entry.date ?? "", endDate: entry.endDate, time: entry.time };
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
  return documents.map((document) => toEntry(document));
}

export async function listRetreatEntries(): Promise<AdminListEntry[]> {
  const documents = await listDocuments<RetreatListItem>("retreat");
  return documents.map((document) => toEntry(document, "Retreat"));
}

export async function listProgramEntries(): Promise<AdminListEntry[]> {
  const documents = await listDocuments<ProgramListItem>("program");
  return documents.map((document) => toEntry(document)).sort((a, b) => a.title.localeCompare(b.title));
}
