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
    time: composeEventTimeLabel(event) ?? event.time,
  };
}

function hasDate(event: EventNavItem): event is EventNavItem & { date: string } {
  return Boolean(event.date);
}

function eventItem(S: StructureBuilder, event: EventNavItem) {
  return S.listItem()
    .title(event.title || "Untitled event")
    .id(event._id)
    .schemaType("event")
    .child(S.document().schemaType("event").documentId(event._id));
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

  const dated = events.filter(hasDate);
  const upcoming = [
    ...events.filter((event) => !event.date),
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
