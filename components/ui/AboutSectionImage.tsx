import Image from "next/image";

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  aboutSectionImageObjectPositionClass,
  aboutSectionImageSrc,
} from "@/lib/local-images";
import { urlForImage } from "@/lib/cms/image-url";
import type { SanityImage as SanityImageType } from "@/lib/cms/content-types";
import { cn } from "@/lib/utils";

type AboutSectionImageProps = {
  title: string;
  image?: SanityImageType;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

function aboutSectionImageKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * About section photos: the CMS image when one is set, otherwise
 * /public/images/about/{key}.jpg (or .webp / .png).
 */
export function AboutSectionImage({
  title,
  image,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  className,
  priority,
}: AboutSectionImageProps) {
  const alt = image?.alt || `Portrait of ${title}`;
  const imageKey = aboutSectionImageKey(title);
  const src = urlForImage(image)?.url() ?? aboutSectionImageSrc(imageKey);

  if (!src) {
    return <ImagePlaceholder className={cn("h-full w-full", className)} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn(
        "object-cover",
        aboutSectionImageObjectPositionClass(imageKey),
        className,
      )}
    />
  );
}
