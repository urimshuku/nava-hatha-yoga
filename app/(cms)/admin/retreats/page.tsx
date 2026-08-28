import Link from "next/link";

import { SourceBadge } from "@/components/cms/SourceBadge";
import { listRetreatEntries } from "@/lib/cms/admin-list";

import { restoreRetreat } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminRetreatsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, entries] = await Promise.all([
    searchParams,
    listRetreatEntries(),
  ]);

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

      {saved ? (
        <p className="mt-6 rounded border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-brown">
          Saved. The website is showing your change now.
        </p>
      ) : null}

      {entries.length === 0 ? (
        <p className="mt-8 rounded-lg border border-border bg-white px-4 py-8 text-center text-sm text-brown">
          No retreats yet. Use “Add a retreat” to create the first one.
        </p>
      ) : (
        <ul className="mt-8 overflow-hidden rounded-lg border border-border bg-white">
          {entries.map((entry) => (
            <li
              key={entry.slug}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 last:border-b-0"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/retreats/${entry.slug}`}
                  className="font-medium text-charcoal hover:text-saffron"
                >
                  {entry.title}
                </Link>
                <p className="mt-1 text-sm text-brown">/retreats/{entry.slug}</p>
              </div>

              <div className="flex items-center gap-3">
                <SourceBadge entry={entry} />
                {entry.hidden ? (
                  <form action={restoreRetreat}>
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
                    href={`/admin/retreats/${entry.slug}`}
                    className="text-sm text-brown transition-colors hover:text-saffron"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
