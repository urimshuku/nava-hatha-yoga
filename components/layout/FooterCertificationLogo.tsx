import Image from "next/image";

import { FOOTER_CERTIFICATION_LOGO } from "@/lib/constants";
import { footerCertificationLogoSrc } from "@/lib/local-images";
import { cn } from "@/lib/utils";

/**
 * Isha Hatha Yoga certified teacher badge — local file only.
 * Place at: public/images/Sadhguru_Gurukulam_Logo.avif (or .png / .webp)
 */
export function FooterCertificationLogo({ className }: { className?: string }) {
  const src = footerCertificationLogoSrc();

  if (!src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={FOOTER_CERTIFICATION_LOGO.alt}
      width={FOOTER_CERTIFICATION_LOGO.width}
      height={FOOTER_CERTIFICATION_LOGO.height}
      sizes="180px"
      className={cn("h-auto w-auto max-w-[8.75rem] object-contain sm:max-w-[11.25rem]", className)}
    />
  );
}
