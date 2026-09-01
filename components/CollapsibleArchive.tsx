import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function IconChevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5 shrink-0 text-clay transition-transform duration-300 group-open:rotate-180"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CollapsibleArchive({
  id,
  title,
  count,
  className,
  children,
}: {
  id?: string;
  title: string;
  count: number;
  className?: string;
  children: ReactNode;
}) {
  if (count === 0) return null;

  return (
    <details
      id={id}
      className={cn("group mt-10 sm:mt-14", className)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl border border-border bg-ivory px-4 py-4 shadow-soft transition-colors hover:border-saffron/40 sm:px-6 [&::-webkit-details-marker]:hidden">
        <h2 className="font-heading text-xl text-charcoal sm:text-2xl">
          {title}
        </h2>
        <span className="flex items-center gap-3 text-sm text-brown">
          <span className="tabular-nums">{count}</span>
          <IconChevron />
        </span>
      </summary>
      <div className="mt-2 sm:mt-3">{children}</div>
    </details>
  );
}
