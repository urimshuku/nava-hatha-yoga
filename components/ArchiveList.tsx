import Link from "next/link";
import type { ElementType } from "react";

import { eventDetailPath, eventTypeTag, formatDateRange, resolveEventCardEndDate } from "@/lib/utils";
import type { PastEvent } from "@/lib/cms/content-types";

export function ArchiveList({
  events,
  headingLevel = 2,
}: {
  events: PastEvent[];
  headingLevel?: 2 | 3;
}) {
  const TitleTag = `h${headingLevel}` as ElementType;

  return (
    <ul className="divide-y divide-border border-y border-border">
      {events.map((event) => (
        <li
          key={event._id}
          className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
        >
          <div className="min-w-0">
            {event.slug ? (
              <TitleTag className="font-heading text-xl text-charcoal">
                <Link
                  href={eventDetailPath(event) ?? `/events/${event.slug}`}
                  className="transition-colors hover:text-saffron"
                >
                  {event.title}
                </Link>
              </TitleTag>
            ) : (
              <TitleTag className="font-heading text-xl text-charcoal">
                {event.title}
              </TitleTag>
            )}
            {event.relatedProgram?.title ? (
              <p className="text-sm text-brown">{event.relatedProgram.title}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-baseline gap-3 text-sm text-brown">
            {event.category ? (
              <span className="rounded-full bg-sand px-3 py-0.5 text-xs uppercase tracking-wide">
                {eventTypeTag(event.category)}
              </span>
            ) : null}
            <time dateTime={event.date}>
              {formatDateRange(event.date, resolveEventCardEndDate(event))}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
}
