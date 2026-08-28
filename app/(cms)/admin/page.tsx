import Link from "next/link";

import {
  listEventEntries,
  listProgramEntries,
  listRetreatEntries,
} from "@/lib/cms/admin-list";
import { EDITABLE_PAGES } from "@/lib/cms/editable-pages";
import { getDocument } from "@/lib/cms/repository";
import { CMS_SECTIONS } from "@/lib/cms/sections";

export const dynamic = "force-dynamic";

function visibilityCounts(entries: { hidden: boolean; draft: boolean }[]) {
  const published = entries.filter((entry) => !entry.hidden && !entry.draft)
    .length;
  const unpublished = entries.length - published;
  return { published, unpublished };
}

export default async function AdminHomePage() {
  const [events, programs, retreats, editedPages] = await Promise.all([
    listEventEntries(),
    listProgramEntries(),
    listRetreatEntries(),
    Promise.all(
      EDITABLE_PAGES.map((page) => getDocument(page.type, page.slug)),
    ),
  ]);

  const counts: Record<
    string,
    { published: number; unpublished?: number; pages?: number }
  > = {
    "/admin/pages": {
      published: editedPages.filter(Boolean).length,
      pages: EDITABLE_PAGES.length,
    },
    "/admin/events": visibilityCounts(events),
    "/admin/programs": visibilityCounts(programs),
    "/admin/retreats": visibilityCounts(retreats),
  };

  return (
    <div>
      <h1 className="font-heading text-display-sm text-charcoal">
        What would you like to change?
      </h1>
      <p className="mt-3 max-w-prose text-brown">
        Pick a section below. Everything you save here appears on the website
        straight away.
      </p>

      {CMS_SECTIONS.map((section) => (
        <div key={section.heading} className="mt-10">
          <h2 className="mb-4 text-xs uppercase tracking-widest text-brown">
            {section.heading}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {section.items.map((item) => {
              const count = counts[item.href];

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block h-full rounded-lg border border-border bg-white p-5 transition-shadow hover:shadow-card"
                  >
                    <p className="font-heading text-xl text-charcoal">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-brown">
                      {item.description}
                    </p>
                    {count ? (
                      <p className="mt-4 text-xs text-brown">
                        {count.pages != null
                          ? `${count.pages} pages`
                          : `${count.published} published${
                              count.unpublished
                                ? ` · ${count.unpublished} unpublished`
                                : ""
                            }`}
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
