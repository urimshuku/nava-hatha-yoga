import type { ImageLoaderProps } from "next/image";

/**
 * Cloudflare Image Resizing loader for next/image (OpenNext / Workers).
 * Local assets go through `/cdn-cgi/image/`; remote URLs (e.g. Sanity CDN)
 * are returned as-is. In development the original src is served directly.
 *
 * Requires Image Transformations enabled on the Cloudflare zone.
 * @see https://opennext.js.org/cloudflare/howtos/image
 */
const normalizeSrc = (src: string) => (src.startsWith("/") ? src.slice(1) : src);

const isRemoteSource = (src: string) => /^https?:\/\//i.test(src);

export default function cloudflareLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (
    src.startsWith("data:") ||
    src.includes("/cdn-cgi/image/") ||
    isRemoteSource(src)
  ) {
    return src;
  }

  if (process.env.NODE_ENV === "development") {
    return src;
  }

  const params = [`width=${width}`, `quality=${quality || 75}`, "format=auto"];
  return `/cdn-cgi/image/${params.join(",")}/${normalizeSrc(src)}`;
}
