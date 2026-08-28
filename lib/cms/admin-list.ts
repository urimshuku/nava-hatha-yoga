import type {
  ProgramListItem,
  RetreatListItem,
  YogaEvent,
} from "@/lib/cms/content-types";

import { listDocuments, type CmsDocument } from "./repository";

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
    updatedAt: document.updatedAt,
    date: data?.date,
    endDate: data?.endDate,
  };
}

export async function listEventEntries(): Promise<AdminListEntry[]> {
  const documents = await listDocuments<YogaEvent>("event");
  return documents
    .map(toEntry)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export async function listRetreatEntries(): Promise<AdminListEntry[]> {
  const documents = await listDocuments<RetreatListItem>("retreat");
  return documents
    .map(toEntry)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export async function listProgramEntries(): Promise<AdminListEntry[]> {
  const documents = await listDocuments<ProgramListItem>("program");
  return documents.map(toEntry).sort((a, b) => a.title.localeCompare(b.title));
}
