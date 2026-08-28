import Image from "next/image";

import { urlForImage } from "@/lib/cms/image-url";
import type { SanityImage as SanityImageType } from "@/lib/cms/content-types";
import { cn } from "@/lib/utils";

interface SanityImageProps {
  image?: SanityImageType;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Renders a CMS image when available, otherwise a calm decorative placeholder
 * so layouts stay intact before media is added in the editor.
 */
export function SanityImage({
  image,
  alt,
  width = 800,
  height = 600,
  className,
  sizes,
  priority,
}: SanityImageProps) {
  const builder = urlForImage(image);

  if (!builder) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-sand to-cream text-clay/70",
          className,
        )}
        aria-hidden="true"
      >
        <span className="font-heading text-4xl">अ</span>
      </div>
    );
  }

  return (
    <Image
      src={builder.width(width).height(height).url()}
      alt={image?.alt || alt || ""}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
