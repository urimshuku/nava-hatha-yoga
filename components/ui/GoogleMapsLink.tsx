import type { ReactNode } from "react";

import { googleMapsUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";

export function GoogleMapsLink({
  query,
  children = "Open in Google Maps",
  className,
}: {
  query: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={googleMapsUrl(query)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-medium text-saffron underline underline-offset-2 hover:text-saffron-hover",
        className,
      )}
    >
      {children}
    </a>
  );
}
