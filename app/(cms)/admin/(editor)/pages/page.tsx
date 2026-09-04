import Link from "next/link";

import { MAIN_PAGES } from "@/lib/cms/editable-pages";
import {
  getDocument,
  hasUnpublishedChanges,
  type CmsDocument,
} from "@/lib/cms/repository";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function PageStatusBadge({
  stored,
}: {
  stored: CmsDocument<unknown> | undefined;
}) {
  const unpublished = stored && (!stored.published || stored.hidden);
  const pending = stored ? hasUnpublishedChanges(stored) : false;
  const label = unpublished
    ? "Unpublished"
    : pending
      ? "Unpublished changes"
      : "Published";
  const tone =
    unpublished || pending
      ? "bg-saffron/10 text-saffron-hover"
      : stored
        ? "bg-emerald-100 text-emerald-800"
        : "bg-sand/50 text-brown";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone,
      )}
    >
      {label}
    </span>
  );
}

export default async function PagesPage() {
  const entries = await Promise.all(
    MAIN_PAGES.map(async (page) => ({
      page,
      stored: await getDocument(page.type, page.slug),
    })),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-charcoal">Main Pages</h1>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white">
        {entries.map(({ page, stored }) => (
          <li key={page.id}>
            <Link
              href={`/admin/pages/${page.id}`}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-cream/50"
            >
              <div className="min-w-0">
                <p className="font-medium text-charcoal">{page.label}</p>
                <p className="mt-0.5 text-sm text-brown">{page.summary}</p>
              </div>
              <div className="flex items-center gap-3">
                <PageStatusBadge stored={stored} />
                <span className="text-sm text-brown">Edit</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
