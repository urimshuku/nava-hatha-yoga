import { cn } from "@/lib/utils";

/**
 * Nava decorative divider — gentle wave rule.
 * Uses the brand SVG asset. Decorative only.
 */
export function Ornament({
  className,
  width = "w-52 sm:w-72",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/nava-divider.svg"
        alt=""
        width={360}
        height={28}
        className={cn("h-auto max-w-full", width)}
        decoding="async"
      />
    </div>
  );
}
