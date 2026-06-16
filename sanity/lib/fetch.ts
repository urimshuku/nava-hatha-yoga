import { MAIN_PROGRAM_SLUGS } from "@/lib/constants";

import { client } from "./client";
import { isSanityConfigured } from "../env";
import * as Q from "./queries";
import type {
  AboutPage,
  HomePage,
  LegalPage,
  PastEvent,
  Program,
  ProgramListItem,
  Retreat,
  RetreatListItem,
  SiteSettings,
  YogaEvent,
} from "./types";
import {
  placeholderAboutPage,
  placeholderEvents,
  placeholderHomePage,
  placeholderLegalPages,
  placeholderPastEvents,
  placeholderProgramBySlug,
  placeholderPrograms,
  placeholderRetreats,
  placeholderSiteSettings,
} from "@/lib/placeholders";

// Revalidate CMS data periodically (ISR-friendly) without per-request overhead.
const REVALIDATE = 60;

async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE },
    });
  } catch (error) {
    console.error("Sanity fetch failed; falling back to placeholders.", error);
    return null;
  }
}

function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<SiteSettings>(Q.siteSettingsQuery);
  return isEmpty(data) ? placeholderSiteSettings : (data as SiteSettings);
}

export async function getHomePage(): Promise<HomePage> {
  const data = await sanityFetch<HomePage>(Q.homePageQuery);
  return isEmpty(data) ? placeholderHomePage : (data as HomePage);
}

export async function getAboutPage(): Promise<AboutPage> {
  const data = await sanityFetch<AboutPage>(Q.aboutPageQuery);
  return isEmpty(data) ? placeholderAboutPage : (data as AboutPage);
}

export async function getPrograms(): Promise<ProgramListItem[]> {
  const data = await sanityFetch<ProgramListItem[]>(Q.programsQuery);
  return isEmpty(data) ? placeholderPrograms : (data as ProgramListItem[]);
}

export async function getFeaturedPrograms(): Promise<ProgramListItem[]> {
  const programs = await getPrograms();
  const bySlug = new Map(programs.map((program) => [program.slug, program]));
  return MAIN_PROGRAM_SLUGS.flatMap((slug) => {
    const program = bySlug.get(slug);
    return program ? [program] : [];
  });
}

export async function getProgramSlugs(): Promise<string[]> {
  const data = await sanityFetch<string[]>(Q.programSlugsQuery);
  return isEmpty(data) ? placeholderPrograms.map((p) => p.slug) : (data as string[]);
}

export async function getProgramBySlug(slug: string): Promise<Program | undefined> {
  const data = await sanityFetch<Program | null>(Q.programBySlugQuery, { slug });
  return data ?? placeholderProgramBySlug(slug);
}

export async function getUpcomingEvents(): Promise<YogaEvent[]> {
  const data = await sanityFetch<YogaEvent[]>(Q.upcomingEventsQuery);
  return data ?? placeholderEvents;
}

export async function getUpcomingEventsByProgram(
  slug: string,
): Promise<YogaEvent[]> {
  const data = await sanityFetch<YogaEvent[]>(Q.upcomingEventsByProgramQuery, {
    slug,
  });
  if (data) return data;
  return placeholderEvents.filter((event) => event.relatedProgram?.slug === slug);
}

export async function getPastEvents(): Promise<PastEvent[]> {
  const data = await sanityFetch<PastEvent[]>(Q.pastEventsQuery);
  return data ?? placeholderPastEvents;
}

export async function getRetreats(): Promise<RetreatListItem[]> {
  const data = await sanityFetch<RetreatListItem[]>(Q.retreatsQuery);
  return data ?? placeholderRetreats;
}

export async function getRetreatSlugs(): Promise<string[]> {
  const data = await sanityFetch<string[]>(Q.retreatSlugsQuery);
  return data ?? [];
}

export async function getRetreatBySlug(slug: string): Promise<Retreat | undefined> {
  const data = await sanityFetch<Retreat | null>(Q.retreatBySlugQuery, { slug });
  return data ?? undefined;
}

export async function getLegalPage(slug: string): Promise<LegalPage | undefined> {
  const data = await sanityFetch<LegalPage | null>(Q.legalPageQuery, { slug });
  return data ?? placeholderLegalPages[slug];
}
