import type { AdminListEntry } from "@/lib/cms/admin-list";
import { cn } from "@/lib/utils";

/**
 * Tells the editor, at a glance, where an entry's content comes from and whether
 * the website is currently showing it.
 */
export function SourceBadge({ entry }: { entry: AdminListEntry }) {
  const { label, tone } = describe(entry);

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

function describe(entry: AdminListEntry): { label: string; tone: string } {
  if (entry.hidden) {
    return { label: "Hidden from website", tone: "bg-sand/70 text-brown" };
  }
  if (entry.draft) {
    return { label: "Not published yet", tone: "bg-clay/20 text-brown" };
  }
  return { label: "Edited here", tone: "bg-saffron/10 text-saffron-hover" };
}
