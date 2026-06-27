import Image from "next/image";

import { BRAND_LOGO, BRAND_LOGO_FULL, BRAND_LOGO_HEADER, BRAND_LOGO_SYMBOL, BRAND_LOGO_WORDMARK } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  alt?: string;
  className?: string;
  priority?: boolean;
  variant?: "horizontal" | "full" | "header" | "symbol" | "wordmark";
  decorative?: boolean;
}

const LOGO_BY_VARIANT = {
  horizontal: BRAND_LOGO,
  full: BRAND_LOGO_FULL,
  header: BRAND_LOGO_HEADER,
  symbol: BRAND_LOGO_SYMBOL,
  wordmark: BRAND_LOGO_WORDMARK,
} as const;

const SIZES_BY_VARIANT = {
  horizontal: "(max-width: 640px) 200px, 260px",
  full: "(max-width: 640px) 140px, 160px",
  header: "(max-width: 640px) 140px, 180px",
  symbol: "(max-width: 640px) 56px, 72px",
  wordmark: "(max-width: 640px) 84px, 108px",
} as const;

export function BrandLogo({
  alt,
  className,
  priority = false,
  variant = "horizontal",
  decorative = false,
}: BrandLogoProps) {
  const logo = LOGO_BY_VARIANT[variant];

  return (
    <Image
      src={logo.src}
      alt={decorative ? "" : (alt ?? logo.alt)}
      width={logo.width}
      height={logo.height}
      priority={priority}
      sizes={SIZES_BY_VARIANT[variant]}
      aria-hidden={decorative || undefined}
      className={cn("h-auto w-auto object-contain object-left", className)}
    />
  );
}
