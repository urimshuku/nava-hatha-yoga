import Image from "next/image";

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  programDesktopImageObjectPositionClass,
  programDesktopImageSrc,
  programImageObjectPositionClass,
  programImageSrc,
} from "@/lib/local-images";
import { cn } from "@/lib/utils";

type LocalProgramImageProps = {
  slug: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Program photos live in /public/images/programs/{slug}.jpg (or .png / .webp).
 * Not managed in Sanity — add files locally when ready.
 */
export function LocalProgramImage({
  slug,
  alt,
  width = 640,
  height = 480,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className,
  priority,
}: LocalProgramImageProps) {
  const src = programImageSrc(slug);
  const desktopSrc = programDesktopImageSrc(slug);

  if (!src) {
    return <ImagePlaceholder className={cn("h-full w-full", className)} />;
  }

  const imageClassName = cn("object-cover", className);

  if (desktopSrc) {
    return (
      <>
        <Image
          src={desktopSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "eager"}
          fetchPriority={priority ? "high" : "auto"}
          unoptimized
          className={cn(
            programDesktopImageObjectPositionClass(slug),
            imageClassName,
            "hidden lg:block",
          )}
        />
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "eager"}
          fetchPriority={priority ? "high" : "auto"}
          unoptimized
          className={cn(programImageObjectPositionClass(slug), imageClassName, "lg:hidden")}
        />
      </>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "eager"}
      fetchPriority={priority ? "high" : "auto"}
      unoptimized
      className={cn(programImageObjectPositionClass(slug), imageClassName)}
    />
  );
}
