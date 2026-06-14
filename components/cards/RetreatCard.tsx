import Link from "next/link";

import { SanityImage } from "@/components/ui/SanityImage";
import { formatDate } from "@/lib/utils";
import type { RetreatListItem } from "@/sanity/lib/types";

export function RetreatCard({ retreat }: { retreat: RetreatListItem }) {
  return (
    <Link
      href={`/retreats/${retreat.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-ivory shadow-soft transition-shadow duration-300 ease-calm hover:shadow-card"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <SanityImage
          image={retreat.image}
          alt={retreat.title}
          width={720}
          height={450}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-full w-full object-cover transition-transform duration-700 ease-calm group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        {retreat.date || retreat.location ? (
          <p className="mb-2 text-xs uppercase tracking-wide text-brown">
            {[formatDate(retreat.date, { day: "numeric", month: "long", year: "numeric" }), retreat.location]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
        <h3 className="font-heading text-2xl text-charcoal">{retreat.title}</h3>
        {retreat.description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brown">
            {retreat.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
