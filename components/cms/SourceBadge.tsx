import type { AdminListEntry } from "@/lib/cms/admin-list";
import { cn, eventTypeTag } from "@/lib/utils";

/** The same type pill shown on public event cards. */
export function EventTypeBadge({ category }: { category?: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sand px-3 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-brown">
      {eventTypeTag(category)}
    </span>
  );
}

/** Published = on the website; unpublished = saved but not shown. */
export function SourceBadge({ entry }: { entry: AdminListEntry }) {
  const unpublished = entry.hidden || entry.draft;
  const label = unpublished
    ? "Unpublished"
    : entry.unpublishedChanges
      ? "Unpublished changes"
      : "Published";
  const tone = unpublished || entry.unpublishedChanges
    ? "bg-saffron/10 text-saffron-hover"
    : "bg-emerald-100 text-emerald-800";

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
