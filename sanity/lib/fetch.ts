import { MAIN_PROGRAM_SLUGS } from "@/lib/constants";
import {
  eventEndTimestamp,
  eventStartTimestamp,
  isPastEvent,
  isUpcomingEvent,
} from "@/lib/event-boundary";
import { composeEventTimeLabel, deriveEventSlug } from "@/lib/utils";

import { client } from "./client";
import { isSanityConfigured } from "../env";
import * as Q from "../queries";
import type {
  AboutPage,
  ContactPage,
  EventsPage,
  HomePage,
  LegalPage,
  PastEvent,
  Program,
  ProgramListItem,
  ProgramsPage,
  RegisterPage,
  Retreat,
  RetreatListItem,
  RetreatsPage,
  SiteSettings,
  YogaEvent,
} from "./types";
import {
  placeholderAboutPage,
  placeholderContactPage,
  placeholderEvents,
  placeholderEventsPage,
  placeholderHomePage,
  placeholderLegalPages,
  placeholderPastEvents,
  placeholderProgramBySlug,
  placeholderPrograms,
  placeholderProgramsPage,
  placeholderRetreats,
  placeholderRetreatsPage,
  placeholderSiteSettings,
} from "@/lib/placeholders";

// Revalidate CMS data periodically (ISR-friendly) without per-request overhead.
const REVALIDATE = 60;

type EventBoundary = {
  date: string;
  endDate?: string;
  time?: string;
};

function withComposedEventTime(event: YogaEvent): YogaEvent {
  return {
    ...event,
    time: composeEventTimeLabel(event),
  };
}

function withUniqueEventSlugs(events: YogaEvent[]): YogaEvent[] {
  const used = new Set<string>();
  return events.map((event) => {
    let slug = deriveEventSlug(event);
    if (used.has(slug)) {
      const suffix = event._id.replace(/^drafts\./, "").slice(-6);
      slug = `${slug}-${suffix}`;
    }
    used.add(slug);
    return { ...event, slug };
  });
}

async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE },
    });
  } catch (error) {
    console.error(
      "Sanity fetch failed; using emergency placeholders until CMS data is available.",
      error,
    );
    return null;
  }
}

function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function getUpcomingFrom<T extends EventBoundary>(events: T[]): T[] {
  return [...events]
    .filter((event) => isUpcomingEvent(event))
    .sort((a, b) => eventStartTimestamp(a) - eventStartTimestamp(b));
}

function getPastFrom<T extends EventBoundary>(events: T[]): T[] {
  return [...events]
    .filter((event) => isPastEvent(event))
    .sort((a, b) => eventEndTimestamp(b) - eventEndTimestamp(a));
}

async function getAllEvents(): Promise<YogaEvent[]> {
  const data = await sanityFetch<YogaEvent[]>(Q.allEventsQuery);
  const events = data ?? placeholderEvents;
  return withUniqueEventSlugs(events.map(withComposedEventTime));
}

function toPastEvent(event: YogaEvent): PastEvent {
  return {
    _id: event._id,
    title: event.title,
    slug: event.slug,
    date: event.date,
    endDate: event.endDate,
    time: event.time,
    location: event.location,
    category: event.category,
    relatedProgram: event.relatedProgram,
  };
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
  // Prefer the CMS category when set; fall back to the built-in slug list.
  if (programs.some((program) => program.category)) {
    return programs.filter((program) => program.category === "main");
  }
  const bySlug = new Map(programs.map((program) => [program.slug, program]));
  return MAIN_PROGRAM_SLUGS.flatMap((slug) => {
    const program = bySlug.get(slug);
    return program ? [program] : [];
  });
}

export type SlugEntry = {
  slug: string;
  _updatedAt?: string;
};

export async function getProgramSlugEntries(): Promise<SlugEntry[]> {
  const data = await sanityFetch<SlugEntry[]>(Q.programSlugsQuery);
  if (isEmpty(data)) {
    return placeholderPrograms.map((p) => ({ slug: p.slug }));
  }
  return (data as Array<{ slug?: string; _updatedAt?: string }>)
    .filter((entry): entry is SlugEntry => Boolean(entry?.slug))
    .map((entry) => ({
      slug: entry.slug,
      _updatedAt: entry._updatedAt,
    }));
}

export async function getProgramSlugs(): Promise<string[]> {
  return (await getProgramSlugEntries()).map((entry) => entry.slug);
}

export async function getProgramBySlug(slug: string): Promise<Program | undefined> {
  const data = await sanityFetch<Program | null>(Q.programBySlugQuery, { slug });
  return data ?? placeholderProgramBySlug(slug);
}

export async function getUpcomingEvents(): Promise<YogaEvent[]> {
  return getUpcomingFrom(await getAllEvents());
}

export async function getUpcomingEventsByProgram(
  slug: string,
): Promise<YogaEvent[]> {
  const events = await getAllEvents();
  return getUpcomingFrom(
    events.filter((event) => event.relatedProgram?.slug === slug),
  );
}

export async function getEventSlugEntries(): Promise<SlugEntry[]> {
  const events = await getAllEvents();
  return events
    .filter((event) => event.slug)
    .map((event) => ({
      slug: event.slug as string,
      _updatedAt: event._updatedAt,
    }));
}

export async function getEventSlugs(): Promise<string[]> {
  return (await getEventSlugEntries()).map((entry) => entry.slug);
}

export async function getEventBySlug(slug: string): Promise<YogaEvent | undefined> {
  if (!slug || slug === "archive") return undefined;
  const events = await getAllEvents();
  return events.find((event) => event.slug === slug);
}

export async function getPastEvents(): Promise<PastEvent[]> {
  const events = await getAllEvents();
  return getPastFrom([
    ...placeholderPastEvents,
    ...events.map(toPastEvent),
  ]);
}

function withDateBoundary<T extends { date?: string }>(
  item: T,
): T & EventBoundary {
  return { ...item, date: item.date ?? "" };
}

async function getAllPublishedRetreats(): Promise<RetreatListItem[]> {
  const data = await sanityFetch<RetreatListItem[]>(Q.retreatsQuery);
  return data ?? placeholderRetreats;
}

export async function getRetreats(): Promise<RetreatListItem[]> {
  return getUpcomingFrom(
    (await getAllPublishedRetreats()).map(withDateBoundary),
  );
}

export async function getPastRetreats(): Promise<RetreatListItem[]> {
  return getPastFrom((await getAllPublishedRetreats()).map(withDateBoundary));
}

export async function getRetreatSlugEntries(): Promise<SlugEntry[]> {
  const data = await sanityFetch<SlugEntry[]>(Q.retreatSlugsQuery);
  if (!data) return [];
  return data
    .filter((entry): entry is SlugEntry => Boolean(entry?.slug))
    .map((entry) => ({
      slug: entry.slug,
      _updatedAt: entry._updatedAt,
    }));
}

export async function getRetreatSlugs(): Promise<string[]> {
  return (await getRetreatSlugEntries()).map((entry) => entry.slug);
}

export async function getRetreatBySlug(slug: string): Promise<Retreat | undefined> {
  const data = await sanityFetch<Retreat | null>(Q.retreatBySlugQuery, { slug });
  return data ?? undefined;
}

export async function getLegalPage(slug: string): Promise<LegalPage | undefined> {
  const data = await sanityFetch<LegalPage | null>(Q.legalPageQuery, { slug });
  return data ?? placeholderLegalPages[slug];
}

export async function getContactPage(): Promise<ContactPage> {
  const data = await sanityFetch<ContactPage>(Q.contactPageQuery);
  return isEmpty(data) ? placeholderContactPage : (data as ContactPage);
}

export async function getProgramsPage(): Promise<ProgramsPage> {
  const data = await sanityFetch<ProgramsPage>(Q.programsPageQuery);
  return isEmpty(data) ? placeholderProgramsPage : (data as ProgramsPage);
}

export async function getEventsPage(): Promise<EventsPage> {
  const data = await sanityFetch<EventsPage>(Q.eventsPageQuery);
  return isEmpty(data) ? placeholderEventsPage : (data as EventsPage);
}

export async function getRetreatsPage(): Promise<RetreatsPage> {
  const data = await sanityFetch<RetreatsPage>(Q.retreatsPageQuery);
  return isEmpty(data) ? placeholderRetreatsPage : (data as RetreatsPage);
}

/** Returns null when Sanity is not configured; callers fall back to code defaults. */
export async function getRegisterPage(): Promise<RegisterPage | null> {
  return sanityFetch<RegisterPage>(Q.registerPageQuery);
}
