import Link from "next/link";

import { SourceBadge } from "@/components/cms/SourceBadge";
import { listEventEntries, type AdminListEntry } from "@/lib/cms/admin-list";
import { formatDateRange } from "@/lib/utils";

import { restoreEvent } from "./actions";

export const dynamic = "force-dynamic";

function isPast(entry: AdminListEntry): boolean {
  const end = entry.endDate ?? entry.date;
  return Boolean(end) && Date.parse(end as string) < Date.now();
}

function EventRow({ entry }: { entry: AdminListEntry }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 last:border-b-0">
      <div className="min-w-0">
        <Link
          href={`/admin/events/${entry.slug}`}
          className="font-medium text-charcoal hover:text-saffron"
        >
          {entry.title}
        </Link>
        <p className="mt-1 text-sm text-brown">
          {entry.date
            ? formatDateRange(entry.date, entry.endDate)
            : "No date set"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SourceBadge entry={entry} />
        {entry.hidden ? (
          <form action={restoreEvent}>
            <input type="hidden" name="slug" value={entry.slug} />
            <button
              type="submit"
              className="text-sm text-brown transition-colors hover:text-saffron"
            >
              Put back
            </button>
          </form>
        ) : (
          <Link
            href={`/admin/events/${entry.slug}`}
            className="text-sm text-brown transition-colors hover:text-saffron"
          >
            Edit
          </Link>
        )}
      </div>
    </li>
  );
}

function EventList({
  title,
  entries,
  emptyMessage,
}: {
  title: string;
  entries: AdminListEntry[];
  emptyMessage: string;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xs uppercase tracking-widest text-brown">
        {title}
      </h2>
      {entries.length === 0 ? (
        <p className="rounded-lg border border-border bg-white px-4 py-6 text-sm text-brown">
          {emptyMessage}
        </p>
      ) : (
        <ul className="overflow-hidden rounded-lg border border-border bg-white">
          {entries.map((entry) => (
            <EventRow key={entry.slug} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, entries] = await Promise.all([
    searchParams,
    listEventEntries(),
  ]);

  const upcoming = entries.filter((entry) => !isPast(entry));
  const past = entries.filter(isPast);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">Events</h1>
          <p className="mt-2 max-w-prose text-sm text-brown">
            Dates, times and prices for sessions. Past events move to the
            archive on their own.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="rounded bg-saffron px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saffron-hover"
        >
          Add an event
        </Link>
      </div>

      {saved ? (
        <p className="mt-6 rounded border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-brown">
          Saved. The website is showing your change now.
        </p>
      ) : null}

      <EventList
        title="Upcoming"
        entries={upcoming}
        emptyMessage="No upcoming events yet. Use “Add an event” to create one."
      />
      <EventList
        title="Past"
        entries={past}
        emptyMessage="No past events."
      />
    </div>
  );
}
