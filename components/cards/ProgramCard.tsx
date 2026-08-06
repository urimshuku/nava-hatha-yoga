import Link from "next/link";
import type { ElementType } from "react";

import { ProgramImage } from "@/components/ui/ProgramImage";
import type { ProgramListItem } from "@/sanity/lib/types";

export function ProgramCard({
  program,
  headingLevel = 3,
}: {
  program: ProgramListItem;
  /** Use 2 on listing pages without a section h2; keep 3 under an existing h2. */
  headingLevel?: 2 | 3;
}) {
  const TitleTag = `h${headingLevel}` as ElementType;

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-ivory shadow-soft transition-shadow duration-300 ease-calm hover:shadow-card"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <ProgramImage
          slug={program.slug}
          image={program.image}
          alt={program.title}
          width={640}
          height={480}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-700 ease-calm group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <TitleTag className="font-heading text-xl text-charcoal sm:text-2xl">
          {program.title}
        </TitleTag>
        {program.shortIntro ? (
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-brown sm:mt-2">
            {program.shortIntro}
          </p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-saffron sm:mt-4">
          Learn more
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-calm group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}
