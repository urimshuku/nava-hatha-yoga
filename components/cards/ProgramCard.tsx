import Link from "next/link";

import { SanityImage } from "@/components/ui/SanityImage";
import type { ProgramListItem } from "@/sanity/lib/types";

export function ProgramCard({ program }: { program: ProgramListItem }) {
  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-ivory shadow-soft transition-shadow duration-300 ease-calm hover:shadow-card"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <SanityImage
          image={program.image}
          alt={program.title}
          width={640}
          height={480}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-700 ease-calm group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-2xl text-charcoal">{program.title}</h3>
        {program.shortIntro ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brown">
            {program.shortIntro}
          </p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-saffron">
          Learn more
          <span aria-hidden="true" className="transition-transform duration-300 ease-calm group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}
