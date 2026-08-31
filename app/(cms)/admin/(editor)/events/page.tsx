import Link from "next/link";

import { ContentListActions } from "@/components/cms/ContentListActions";
import { FormNotice } from "@/components/cms/SaveBar";
import { SourceBadge } from "@/components/cms/SourceBadge";
import {
  compareStartDateAscending,
  compareStartDateDescending,
  isPastAdminEntry,
  listEventEntries,
  type AdminListEntry,
} from "@/lib/cms/admin-list";
import { formatCmsDateRange } from "@/lib/utils";

import { deleteEvent, duplicateEvent, restoreEvent } from "./actions";

export const dynamic = "force-dynamic";

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
            ? formatCmsDateRange(entry.date, entry.endDate)
            : "No date set"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SourceBadge entry={entry} />
        <ContentListActions
          slug={entry.slug}
          hidden={entry.hidden}
          editHref={`/admin/events/${entry.slug}`}
          noun="event"
          duplicate={duplicateEvent}
          restore={restoreEvent}
          remove={deleteEvent}
        />
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
  searchParams: Promise<{ saved?: string; published?: string; deleted?: string }>;
}) {
  const [query, entries] = await Promise.all([
    searchParams,
    listEventEntries(),
  ]);

  const upcoming = entries
    .filter((entry) => !isPastAdminEntry(entry))
    .sort(compareStartDateAscending);
  const past = entries
    .filter(isPastAdminEntry)
    .sort(compareStartDateDescending);

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

      {query.deleted ? (
        <div className="mt-6">
          <FormNotice kind="deleted" />
        </div>
      ) : query.published ? (
        <div className="mt-6">
          <FormNotice kind="published" />
        </div>
      ) : query.saved ? (
        <div className="mt-6">
          <FormNotice kind="saved" />
        </div>
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
