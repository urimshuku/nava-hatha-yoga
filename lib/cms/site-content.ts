import { cache } from "react";

import { MAIN_PROGRAM_SLUGS } from "@/lib/constants";
import {
  eventEndTimestamp,
  eventStartTimestamp,
  isPastEvent,
  isUpcomingEvent,
} from "@/lib/event-boundary";
import {
  REGISTER_DOCUMENT_SLUG,
  type RegistrationKind,
} from "@/lib/registration-kind";
import {
  composeEventTimeLabel,
  deriveEventSlug,
  formatRegistrationEventLabel,
} from "@/lib/utils";

import {
  applyEventOverrides,
  applyProgramOverrides,
  applyProgramSlugOverrides,
  applyRetreatOverrides,
  applyRetreatSlugOverrides,
  getProgramOverride,
  getRetreatOverride,
} from "./overrides";
import { getPageOverride } from "./page-overrides";
import { cmsOwnsType, listDocuments } from "./repository";
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
} from "./content-types";

/**
 * Public content for the website. Every getter reads the built-in CMS and falls
 * back to lib/placeholders.ts only when that type has no published documents.
 *
 * Placeholders are loaded only on that fallback path so the Worker does not
 * parse the full seed content on every request.
 */

const loadPlaceholders = cache(() => import("@/lib/placeholders"));

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

const getAllEvents = cache(async (): Promise<YogaEvent[]> => {
  const fromCms = await applyEventOverrides([]);
  if (fromCms.length > 0) return fromCms;
  if (cmsOwnsType(await listDocuments("event"))) return fromCms;
  const { placeholderEvents } = await loadPlaceholders();
  return withUniqueEventSlugs(placeholderEvents.map(withComposedEventTime));
});

function toPastEvent(event: YogaEvent): PastEvent {
  return {
    _id: event._id,
    title: event.title,
    slug: event.slug,
    date: event.date,
    endDate: event.endDate,
    time: event.time,
    location: event.location,
    cityCountry: event.cityCountry,
    category: event.category,
    relatedProgram: event.relatedProgram,
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return (
    (await getPageOverride<SiteSettings>("siteSettings")) ??
    (await loadPlaceholders()).placeholderSiteSettings
  );
});

export const getHomePage = cache(async (): Promise<HomePage> => {
  const override = await getPageOverride<HomePage>("homePage");
  if (!override) return (await loadPlaceholders()).placeholderHomePage;

  const { featuredProgramSlugs, ...page } = override;
  const bySlug = new Map((await getPrograms()).map((p) => [p.slug, p]));

  if (featuredProgramSlugs?.length) {
    const featuredPrograms = featuredProgramSlugs.flatMap((slug) => {
      const program = bySlug.get(slug);
      return program ? [program] : [];
    });
    if (featuredPrograms.length > 0) {
      return { ...page, featuredPrograms };
    }
  }

  const featured = await getFeaturedPrograms();
  if (featured.length > 0) {
    return { ...page, featuredPrograms: featured };
  }

  return {
    ...page,
    featuredPrograms: (await loadPlaceholders()).placeholderHomePage.featuredPrograms,
  };
});

export async function getAboutPage(): Promise<AboutPage> {
  return (
    (await getPageOverride<AboutPage>("aboutPage")) ??
    (await loadPlaceholders()).placeholderAboutPage
  );
}

export const getPrograms = cache(async (): Promise<ProgramListItem[]> => {
  const fromCms = await applyProgramOverrides([]);
  if (fromCms.length > 0) return fromCms;
  if (cmsOwnsType(await listDocuments("program"))) return fromCms;
  return (await loadPlaceholders()).placeholderPrograms;
});

export async function getFeaturedPrograms(): Promise<ProgramListItem[]> {
  const programs = await getPrograms();
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
  const fromCms = await applyProgramSlugOverrides([]);
  if (fromCms.length > 0) return fromCms;
  if (cmsOwnsType(await listDocuments("program"))) return fromCms;
  return (await loadPlaceholders()).placeholderPrograms.map((p) => ({ slug: p.slug }));
}

export async function getProgramSlugs(): Promise<string[]> {
  return (await getProgramSlugEntries()).map((entry) => entry.slug);
}

export async function getProgramBySlug(slug: string): Promise<Program | undefined> {
  const override = await getProgramOverride(slug);
  if (override.status === "found") return override.program;
  if (override.status === "hidden") return undefined;

  if (cmsOwnsType(await listDocuments("program"))) {
    return undefined;
  }
  return (await loadPlaceholders()).placeholderProgramBySlug(slug);
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

/** Resolve the event a registration URL refers to (slug first, then the label). */
export async function findEventForRegistration(input: {
  slug?: string | null;
  label?: string | null;
}): Promise<YogaEvent | undefined> {
  const slug = input.slug?.trim();
  if (slug) {
    const bySlug = await getEventBySlug(slug);
    if (bySlug) return bySlug;
  }

  const label = input.label?.trim();
  if (!label) return undefined;

  const events = await getAllEvents();
  return events.find((event) => formatRegistrationEventLabel(event) === label);
}

export async function getPastEvents(): Promise<PastEvent[]> {
  const events = await getAllEvents();
  const { placeholderPastEvents } = await loadPlaceholders();
  return getPastFrom([...placeholderPastEvents, ...events.map(toPastEvent)]);
}

function withDateBoundary<T extends { date?: string }>(
  item: T,
): T & EventBoundary {
  return { ...item, date: item.date ?? "" };
}

async function getAllPublishedRetreats(): Promise<RetreatListItem[]> {
  const fromCms = await applyRetreatOverrides([]);
  if (fromCms.length > 0) return fromCms;
  if (cmsOwnsType(await listDocuments("retreat"))) return fromCms;
  return (await loadPlaceholders()).placeholderRetreats;
}

export async function getRetreats(): Promise<RetreatListItem[]> {
  return getUpcomingFrom(
    (await getAllPublishedRetreats()).map(withDateBoundary),
  );
}

function listingFromRetreat(retreat: RetreatListItem): YogaEvent {
  return {
    _id: retreat._id,
    title: retreat.title,
    slug: retreat.slug,
    date: retreat.date ?? "",
    endDate: retreat.endDate,
    cityCountry: retreat.cityCountry,
    location: retreat.location,
    priceLabel: retreat.priceLabel,
    description: retreat.description,
    image: retreat.image,
    category: "Retreat",
  };
}

/**
 * The list shown on /events and in the homepage upcoming section: published
 * events and retreats, soonest first.
 */
export async function getUpcomingListings(): Promise<YogaEvent[]> {
  const [events, retreats] = await Promise.all([
    getUpcomingEvents(),
    getRetreats(),
  ]);

  return [...events, ...retreats.map(listingFromRetreat)].sort(
    (a, b) => eventStartTimestamp(a) - eventStartTimestamp(b),
  );
}

export async function getPastRetreats(): Promise<RetreatListItem[]> {
  return getPastFrom((await getAllPublishedRetreats()).map(withDateBoundary));
}

/**
 * Past workshops and retreats for the Events archive, newest first.
 */
export async function getPastListings(): Promise<PastEvent[]> {
  const [events, retreats] = await Promise.all([
    getPastEvents(),
    getPastRetreats(),
  ]);

  return getPastFrom([
    ...events,
    ...retreats.map((retreat) => toPastEvent(listingFromRetreat(retreat))),
  ]);
}

export async function getRetreatSlugEntries(): Promise<SlugEntry[]> {
  return applyRetreatSlugOverrides([]);
}

export async function getRetreatSlugs(): Promise<string[]> {
  return (await getRetreatSlugEntries()).map((entry) => entry.slug);
}

export async function getRetreatBySlug(slug: string): Promise<Retreat | undefined> {
  const override = await getRetreatOverride(slug);
  if (override.status === "found") return override.retreat;
  if (override.status === "hidden") return undefined;
  return undefined;
}

export async function getLegalPage(slug: string): Promise<LegalPage | undefined> {
  return (
    (await getPageOverride<LegalPage>("legalPage", slug)) ??
    (await loadPlaceholders()).placeholderLegalPages[slug]
  );
}

export async function getContactPage(): Promise<ContactPage> {
  return (
    (await getPageOverride<ContactPage>("contactPage")) ??
    (await loadPlaceholders()).placeholderContactPage
  );
}

export async function getProgramsPage(): Promise<ProgramsPage> {
  return (
    (await getPageOverride<ProgramsPage>("programsPage")) ??
    (await loadPlaceholders()).placeholderProgramsPage
  );
}

export async function getEventsPage(): Promise<EventsPage> {
  return (
    (await getPageOverride<EventsPage>("eventsPage")) ??
    (await loadPlaceholders()).placeholderEventsPage
  );
}

export async function getRetreatsPage(): Promise<RetreatsPage> {
  return (
    (await getPageOverride<RetreatsPage>("retreatsPage")) ??
    (await loadPlaceholders()).placeholderRetreatsPage
  );
}

/** Returns null when the CMS has no registration copy; callers use code defaults. */
export async function getRegisterPage(
  kind: RegistrationKind = "workshop",
): Promise<RegisterPage | null> {
  const slug = REGISTER_DOCUMENT_SLUG[kind];
  const page =
    (await getPageOverride<RegisterPage>("registerPage", slug)) ?? null;
  if (page) return page;
  if (kind === "retreat" || kind === "module") {
    return (
      (await getPageOverride<RegisterPage>(
        "registerPage",
        REGISTER_DOCUMENT_SLUG.workshop,
      )) ?? null
    );
  }
  return null;
}
