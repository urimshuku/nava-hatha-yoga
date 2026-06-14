import { cn } from "@/lib/utils";

/**
 * A restrained, sacred divider: a thin rule with a small centered diamond.
 * Decorative only.
 */
export function Ornament({
  className,
  width = "w-24",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3", className)}
      aria-hidden="true"
    >
      <span className={cn("h-px bg-border-strong", width)} />
      <span className="h-1.5 w-1.5 rotate-45 bg-clay/70" />
      <span className={cn("h-px bg-border-strong", width)} />
    </div>
  );
}
