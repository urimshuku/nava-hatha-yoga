import { isCmsImage, type CmsImage, type SanityImage } from "./content-types";

export type ImageFitMode =
  | "clip"
  | "crop"
  | "fill"
  | "fillmax"
  | "max"
  | "min"
  | "scale";

/**
 * The chainable shape callers rely on. Dimensions and fit are accepted and
 * ignored on purpose: resizing happens later in `next/image` via the Cloudflare
 * loader, or not at all for metadata URLs.
 */
export interface ContentImageUrlBuilder {
  width(value: number): ContentImageUrlBuilder;
  height(value: number): ContentImageUrlBuilder;
  fit(value: ImageFitMode): ContentImageUrlBuilder;
  url(): string;
}

function cmsImageBuilder(image: CmsImage): ContentImageUrlBuilder {
  const self: ContentImageUrlBuilder = {
    width: () => self,
    height: () => self,
    fit: () => self,
    url: () => mediaPath(image.key),
  };
  return self;
}

/** Public path of an uploaded image. Same origin, so it can be resized at the edge. */
export function mediaPath(key: string): string {
  return `/media/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export function urlForImage(
  source: SanityImage | undefined | null,
): ContentImageUrlBuilder | undefined {
  if (!source) return undefined;
  if (!isCmsImage(source) || !source.key) return undefined;
  return cmsImageBuilder(source);
}

/** Alt text stored on the image itself. */
export function imageAlt(source: SanityImage | undefined | null): string | undefined {
  return source?.alt;
}
