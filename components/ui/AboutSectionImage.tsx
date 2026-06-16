import Image from "next/image";

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SanityImage } from "@/components/ui/SanityImage";
import {
  aboutSectionImageObjectPositionClass,
  aboutSectionImageSrc,
} from "@/lib/local-images";
import { urlForImage } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";
import { cn } from "@/lib/utils";

type AboutSectionImageProps = {
  title: string;
  image?: SanityImageType;
  width?: number;
  height?: number;
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
 * About section photos live in /public/images/about/{key}.jpg (or .webp / .png).
 * Falls back to Sanity when a CMS image is set.
 */
export function AboutSectionImage({
  title,
  image,
  width = 760,
  height = 608,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  className,
  priority,
}: AboutSectionImageProps) {
  const alt = image?.alt || `Portrait of ${title}`;
  const imageKey = aboutSectionImageKey(title);

  if (urlForImage(image)) {
    return (
      <SanityImage
        image={image}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        priority={priority}
      />
    );
  }

  const src = aboutSectionImageSrc(imageKey);

  if (!src) {
    return <ImagePlaceholder className={cn("h-full w-full", className)} />;
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          aboutSectionImageObjectPositionClass(imageKey),
          "object-cover",
          className,
        )}
      />
    </div>
  );
}
