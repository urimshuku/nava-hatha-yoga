import { SanityImage } from "@/components/ui/SanityImage";
import { LocalProgramImage } from "@/components/ui/LocalProgramImage";
import { urlForImage } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

type ProgramImageProps = {
  slug: string;
  image?: SanityImageType;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Program photo: uses the image uploaded in Sanity when present, otherwise
 * falls back to the built-in file in /public/images/programs/.
 */
export function ProgramImage({
  slug,
  image,
  alt,
  width = 640,
  height = 480,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className,
  priority,
}: ProgramImageProps) {
  if (urlForImage(image)) {
    return (
      <SanityImage
        image={image}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <LocalProgramImage
      slug={slug}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
