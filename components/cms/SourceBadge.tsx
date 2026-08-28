import type { AdminListEntry } from "@/lib/cms/admin-list";
import { cn } from "@/lib/utils";

/** Published = on the website; unpublished = saved but not shown. */
export function SourceBadge({ entry }: { entry: AdminListEntry }) {
  const published = !entry.hidden && !entry.draft;
  const label = published ? "Published" : "Unpublished";
  const tone = published
    ? "bg-emerald-100 text-emerald-800"
    : "bg-saffron/10 text-saffron-hover";

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
