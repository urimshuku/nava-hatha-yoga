import Link from "next/link";
import type { ElementType } from "react";

import { formatDateRange } from "@/lib/utils";
import type { RetreatListItem } from "@/lib/cms/content-types";

export function RetreatArchiveList({
  retreats,
  headingLevel = 2,
}: {
  retreats: RetreatListItem[];
  headingLevel?: 2 | 3;
}) {
  const TitleTag = `h${headingLevel}` as ElementType;

  return (
    <ul className="divide-y divide-border border-y border-border">
      {retreats.map((retreat) => (
        <li key={retreat._id}>
          <Link
            href={`/retreats/${retreat.slug}`}
            className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <TitleTag className="font-heading text-xl text-charcoal group-hover:text-saffron">
              {retreat.title}
            </TitleTag>
            <p className="shrink-0 text-sm text-brown">
              {[
                formatDateRange(retreat.date, retreat.endDate),
                retreat.cityCountry?.trim(),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
