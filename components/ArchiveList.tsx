import { formatDate } from "@/lib/utils";
import type { PastEvent } from "@/sanity/lib/types";

export function ArchiveList({ events }: { events: PastEvent[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {events.map((event) => (
        <li
          key={event._id}
          className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
        >
          <div className="min-w-0">
            <h3 className="font-heading text-xl text-charcoal">{event.title}</h3>
            {event.relatedProgram?.title ? (
              <p className="text-sm text-brown">{event.relatedProgram.title}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-baseline gap-3 text-sm text-brown">
            {event.category ? (
              <span className="rounded-full bg-sand px-3 py-0.5 text-xs uppercase tracking-wide">
                {event.category}
              </span>
            ) : null}
            <time dateTime={event.date}>{formatDate(event.date)}</time>
          </div>
        </li>
      ))}
    </ul>
  );
}
