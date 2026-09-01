import type { ReactNode } from "react";

function IconChevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 shrink-0 text-clay transition-transform duration-300 group-open:rotate-180"
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

/** Past items on CMS list pages, collapsed like the public archive. */
export function CollapsibleAdminSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  if (count === 0) return null;

  return (
    <details className="group mt-10">
      <summary className="mb-3 flex cursor-pointer list-none items-center justify-between gap-3 text-brown transition-colors hover:text-saffron [&::-webkit-details-marker]:hidden">
        <h2 className="text-xs uppercase tracking-widest">{title}</h2>
        <span className="flex items-center gap-2 text-xs">
          <span className="tabular-nums">{count}</span>
          <IconChevron />
        </span>
      </summary>
      {children}
    </details>
  );
}
