import { cn } from "@/lib/utils";

/**
 * Nava celestial divider — sun, tapering rules, and inward crescents.
 * Uses the brand SVG asset. Decorative only.
 */
export function Ornament({
  className,
  width = "w-40 sm:w-80",
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
        width={1507}
        height={245}
        className={cn("h-auto max-w-full", width)}
        decoding="async"
      />
    </div>
  );
}
