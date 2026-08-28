import Link from "next/link";

import { formatDateRange } from "@/lib/utils";
import type { RetreatListItem } from "@/lib/cms/content-types";

export function RetreatArchiveList({
  retreats,
}: {
  retreats: RetreatListItem[];
}) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {retreats.map((retreat) => (
        <li key={retreat._id}>
          <Link
            href={`/retreats/${retreat.slug}`}
            className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <h2 className="font-heading text-xl text-charcoal group-hover:text-saffron">
              {retreat.title}
            </h2>
            <time
              className="shrink-0 text-sm text-brown"
              dateTime={retreat.date}
            >
              {formatDateRange(retreat.date, retreat.endDate)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
