import type { StructureBuilder, StructureResolverContext } from "sanity/structure";

import {
  eventEndTimestamp,
  eventStartTimestamp,
  isPastEvent,
  isUpcomingEvent,
} from "@/lib/event-boundary";
import { composeEventTimeLabel } from "@/lib/utils";

import { apiVersion } from "../env";

type EventNavItem = {
  _id: string;
  title?: string;
  date?: string;
  endDate?: string;
  sessions?: { day?: string; hours?: string }[];
  sessionNote?: string;
  time?: string;
};

function withBoundary(event: EventNavItem): EventNavItem {
  return {
    ...event,
    time: composeEventTimeLabel(event),
  };
}

function publishedId(id: string): string {
  return id.replace(/^drafts\./, "");
}

/** One row per event: prefer the draft so unpublished deletes are what you see. */
function preferDrafts(events: EventNavItem[]): EventNavItem[] {
  const byId = new Map<string, EventNavItem>();
  for (const event of events) {
    const id = publishedId(event._id);
    const existing = byId.get(id);
    if (!existing || event._id.startsWith("drafts.")) {
      byId.set(id, event);
    }
  }
  return [...byId.values()];
}

function hasDate(event: EventNavItem): event is EventNavItem & { date: string } {
  return Boolean(event.date);
}

function eventItem(S: StructureBuilder, event: EventNavItem) {
  const id = publishedId(event._id);
  return S.listItem()
    .title(event.title || "Untitled event")
    .id(id)
    .schemaType("event")
    .child(S.document().schemaType("event").documentId(id));
}

export async function eventsList(
  S: StructureBuilder,
  context: StructureResolverContext,
) {
  const client = context.getClient({ apiVersion });
  const events = (
    await client.fetch<EventNavItem[]>(
      `*[_type == "event"]{
        _id,
        title,
        date,
        endDate,
        sessions[]{ day, hours },
        sessionNote,
        time
      }`,
    )
  ).map(withBoundary);

  const uniqueEvents = preferDrafts(events);
  const dated = uniqueEvents.filter(hasDate);
  const upcoming = [
    ...uniqueEvents.filter((event) => !event.date),
    ...dated
      .filter((event) => isUpcomingEvent(event))
      .sort((a, b) => eventStartTimestamp(a) - eventStartTimestamp(b)),
  ];
  const past = dated
    .filter((event) => isPastEvent(event))
    .sort((a, b) => eventEndTimestamp(b) - eventEndTimestamp(a));

  return S.list()
    .title("Events")
    .items([
      S.listItem()
        .title("Events page")
        .id("eventsPage")
        .child(S.document().schemaType("eventsPage").documentId("eventsPage")),
      S.divider(),
      ...upcoming.map((event) => eventItem(S, event)),
      ...(upcoming.length > 0 ? [S.divider()] : []),
      S.listItem()
        .title("Archive")
        .id("events-archive")
        .child(
          S.list()
            .title("Archive")
            .items(past.map((event) => eventItem(S, event))),
        ),
    ]);
}
