import Link from "next/link";
import type { ElementType } from "react";

import { Button } from "@/components/ui/Button";
import { SanityImage } from "@/components/ui/SanityImage";
import { formatDateRange, retreatRegisterHref } from "@/lib/utils";
import type { RetreatListItem } from "@/lib/cms/content-types";

export function RetreatCard({
  retreat,
  headingLevel = 3,
}: {
  retreat: RetreatListItem;
  /** Use 2 on the retreats listing (directly under page h1). */
  headingLevel?: 2 | 3;
}) {
  const TitleTag = `h${headingLevel}` as ElementType;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-ivory shadow-soft transition-shadow duration-300 ease-calm hover:shadow-card">
      <Link
        href={`/retreats/${retreat.slug}`}
        className="group flex flex-1 flex-col"
      >
        <div className="aspect-[5/3] overflow-hidden sm:aspect-[16/10]">
          <SanityImage
            image={retreat.image}
            alt={retreat.title}
            width={720}
            height={450}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-calm group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-1 flex-col p-3 pb-0 sm:p-6 sm:pb-0">
          {retreat.date || retreat.cityCountry ? (
            <p className="mb-1 text-[10px] uppercase tracking-wide text-brown sm:mb-2 sm:text-xs">
              {[
                formatDateRange(retreat.date, retreat.endDate),
                retreat.cityCountry?.trim(),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
          <TitleTag className="font-heading text-lg text-charcoal sm:text-2xl">
            {retreat.title}
          </TitleTag>
          {retreat.description ? (
            <p className="mt-1 line-clamp-3 text-xs leading-snug text-brown sm:mt-2 sm:text-sm sm:leading-relaxed">
              {retreat.description}
            </p>
          ) : null}
        </div>
      </Link>
      <div className="p-3 pt-3 sm:p-6 sm:pt-4">
        <Button href={retreatRegisterHref(retreat)} className="w-full" size="sm">
          Register
        </Button>
      </div>
    </article>
  );
}
