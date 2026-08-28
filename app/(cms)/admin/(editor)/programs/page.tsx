import Link from "next/link";

import { ContentListActions } from "@/components/cms/ContentListActions";
import { FormNotice } from "@/components/cms/SaveBar";
import { SourceBadge } from "@/components/cms/SourceBadge";
import { listProgramEntries } from "@/lib/cms/admin-list";

import { deleteProgram, duplicateProgram, restoreProgram } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; published?: string; deleted?: string }>;
}) {
  const [query, entries] = await Promise.all([
    searchParams,
    listProgramEntries(),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">Programs</h1>
          <p className="mt-2 max-w-prose text-sm text-brown">
            The yoga programs and their descriptions, as shown on the Programs
            pages.
          </p>
        </div>
        <Link
          href="/admin/programs/new"
          className="rounded bg-saffron px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saffron-hover"
        >
          Add a program
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

      <ul className="mt-8 overflow-hidden rounded-lg border border-border bg-white">
        {entries.map((entry) => (
          <li
            key={entry.slug}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 last:border-b-0"
          >
            <div className="min-w-0">
              <Link
                href={`/admin/programs/${entry.slug}`}
                className="font-medium text-charcoal hover:text-saffron"
              >
                {entry.title}
              </Link>
              <p className="mt-1 text-sm text-brown">/programs/{entry.slug}</p>
            </div>

            <div className="flex items-center gap-3">
              <SourceBadge entry={entry} />
              <ContentListActions
                slug={entry.slug}
                hidden={entry.hidden}
                editHref={`/admin/programs/${entry.slug}`}
                noun="program"
                duplicate={duplicateProgram}
                restore={restoreProgram}
                remove={deleteProgram}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
