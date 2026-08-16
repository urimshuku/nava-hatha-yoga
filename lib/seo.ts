import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { urlForImage } from "@/sanity/lib/image";
import type { SeoFields } from "@/sanity/lib/types";

/** Default social share image (static PNG — reliable on OpenNext/Cloudflare Workers). */
export const DEFAULT_OG_IMAGE = {
  url: "/images/og-default.png",
  width: 1200,
  height: 630,
} as const;

export type OgImageInput = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

interface BuildMetadataArgs {
  title?: string;
  description?: string;
  /** Per-page SEO overrides from the CMS take precedence. */
  seo?: SeoFields;
  path?: string;
  noIndex?: boolean;
  siteName?: string;
  /** Optional page-specific Open Graph / Twitter image (absolute or site-relative URL). */
  image?: OgImageInput | string;
}

function resolveOgImage(
  image: OgImageInput | string | undefined,
  ogTitle: string,
): {
  url: string;
  width: number;
  height: number;
  alt: string;
} {
  if (!image) {
    return { ...DEFAULT_OG_IMAGE, alt: ogTitle };
  }

  if (typeof image === "string") {
    const url = image.startsWith("http") ? image : new URL(image, SITE_URL).toString();
    return {
      url,
      width: DEFAULT_OG_IMAGE.width,
      height: DEFAULT_OG_IMAGE.height,
      alt: ogTitle,
    };
  }

  const url = image.url.startsWith("http")
    ? image.url
    : new URL(image.url, SITE_URL).toString();

  return {
    url,
    width: image.width ?? DEFAULT_OG_IMAGE.width,
    height: image.height ?? DEFAULT_OG_IMAGE.height,
    alt: image.alt ?? ogTitle,
  };
}

/**
 * Merge defaults + page values + CMS SEO overrides into a Next.js Metadata object.
 */
export function buildMetadata({
  title,
  description,
  seo,
  path = "/",
  noIndex = false,
  siteName = SITE_NAME,
  image,
}: BuildMetadataArgs = {}): Metadata {
  const resolvedTitle = seo?.title || title;
  const resolvedDescription = seo?.description || description || SITE_DESCRIPTION;
  const canonical = new URL(path, SITE_URL).toString();
  // Keep og/twitter title aligned with the document title / root layout default.
  const ogTitle = resolvedTitle
    ? `${resolvedTitle} · ${siteName}`
    : `${siteName} · Classical Hatha Yoga`;
  const seoImageUrl = urlForImage(seo?.image)?.width(1200).height(630).fit("crop").url();
  const seoImage: OgImageInput | undefined = seoImageUrl
    ? {
        url: seoImageUrl,
        width: 1200,
        height: 630,
        alt: seo?.image?.alt || ogTitle,
      }
    : undefined;
  const ogImage = resolveOgImage(seoImage ?? image, ogTitle);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    // Avoid mixed signals: noindex pages should not self-canonicalize.
    alternates: noIndex ? undefined : { canonical },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName,
      title: ogTitle,
      description: resolvedDescription,
      url: canonical,
      locale: "en_GB",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: resolvedDescription,
      images: [ogImage.url],
    },
  };
}
