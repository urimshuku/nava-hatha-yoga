import Image, { getImageProps } from "next/image";

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  programDesktopImageSrc,
  programImageSrc,
  programPictureObjectPositionClass,
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
 *
 * Uses next/image for responsive srcset + Cloudflare resizing. Art-directed
 * desktop/mobile variants use <picture> so only one asset downloads.
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

  const imageClassName = cn(
    "object-cover",
    programPictureObjectPositionClass(slug),
    className,
  );

  if (desktopSrc) {
    const common = {
      alt,
      width,
      height,
      sizes,
      ...(priority ? { priority: true as const } : {}),
    };
    const {
      props: { srcSet: desktopSrcSet, sizes: desktopSizes },
    } = getImageProps({ ...common, src: desktopSrc });
    const { props: mobileProps } = getImageProps({ ...common, src });

    return (
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet={desktopSrcSet}
          sizes={desktopSizes}
        />
        {/* alt is provided via getImageProps (mobileProps.alt) */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img {...mobileProps} className={imageClassName} />
      </picture>
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
      className={imageClassName}
    />
  );
}
