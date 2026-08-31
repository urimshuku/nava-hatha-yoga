import Link from "next/link";

import { ContentListActions } from "@/components/cms/ContentListActions";
import { FormNotice } from "@/components/cms/SaveBar";
import { SourceBadge } from "@/components/cms/SourceBadge";
import {
  compareStartDateAscending,
  compareStartDateDescending,
  isPastAdminEntry,
  listRetreatEntries,
  type AdminListEntry,
} from "@/lib/cms/admin-list";
import { formatCmsDateRange } from "@/lib/utils";

import { deleteRetreat, duplicateRetreat, restoreRetreat } from "./actions";

export const dynamic = "force-dynamic";

function RetreatRow({ entry }: { entry: AdminListEntry }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 last:border-b-0">
      <div className="min-w-0">
        <Link
          href={`/admin/retreats/${entry.slug}`}
          className="font-medium text-charcoal hover:text-saffron"
        >
          {entry.title}
        </Link>
        <p className="mt-1 text-sm text-brown">
          {entry.date
            ? formatCmsDateRange(entry.date, entry.endDate)
            : `/retreats/${entry.slug}`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SourceBadge entry={entry} />
        <ContentListActions
          slug={entry.slug}
          hidden={entry.hidden}
          editHref={`/admin/retreats/${entry.slug}`}
          noun="retreat"
          duplicate={duplicateRetreat}
          restore={restoreRetreat}
          remove={deleteRetreat}
        />
      </div>
    </li>
  );
}

function RetreatList({
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
            <RetreatRow key={entry.slug} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function AdminRetreatsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; published?: string; deleted?: string }>;
}) {
  const [query, entries] = await Promise.all([
    searchParams,
    listRetreatEntries(),
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
          <h1 className="font-heading text-3xl text-charcoal">Retreats</h1>
          <p className="mt-2 max-w-prose text-sm text-brown">
            The retreats, with their dates, photos and full descriptions. The
            wording around the list is under Pages.
          </p>
        </div>
        <Link
          href="/admin/retreats/new"
          className="rounded bg-saffron px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saffron-hover"
        >
          Add a retreat
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

      {entries.length === 0 ? (
        <p className="mt-8 rounded-lg border border-border bg-white px-4 py-8 text-center text-sm text-brown">
          No retreats yet. Use “Add a retreat” to create the first one.
        </p>
      ) : (
        <>
          <RetreatList
            title="Upcoming"
            entries={upcoming}
            emptyMessage="No upcoming retreats yet. Use “Add a retreat” to create one."
          />
          <RetreatList
            title="Past"
            entries={past}
            emptyMessage="No past retreats."
          />
        </>
      )}
    </div>
  );
}
