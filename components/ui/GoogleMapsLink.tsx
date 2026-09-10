import type { ReactNode } from "react";

import { googleMapsUrl, MAPS_LINK_LABEL } from "@/lib/maps";
import { cn } from "@/lib/utils";

const googleLinkClass =
  "font-medium text-saffron underline underline-offset-2 hover:text-saffron-hover";

export function GoogleMapsLink({
  query,
  href,
  children = MAPS_LINK_LABEL,
  className,
}: {
  query?: string;
  href?: string;
  children?: ReactNode;
  className?: string;
}) {
  const url = href ?? (query ? googleMapsUrl(query) : undefined);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(googleLinkClass, className)}
    >
      {children}
    </a>
  );
}
