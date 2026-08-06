import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import type { SeoFields } from "@/sanity/lib/types";

/** Default social share image (static PNG — reliable on OpenNext/Cloudflare Workers). */
export const DEFAULT_OG_IMAGE = {
  url: "/images/og-default.png",
  width: 1200,
  height: 630,
} as const;

interface BuildMetadataArgs {
  title?: string;
  description?: string;
  /** Per-page SEO overrides from the CMS take precedence. */
  seo?: SeoFields;
  path?: string;
  noIndex?: boolean;
  siteName?: string;
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
}: BuildMetadataArgs = {}): Metadata {
  const resolvedTitle = seo?.title || title;
  const resolvedDescription = seo?.description || description || SITE_DESCRIPTION;
  const canonical = new URL(path, SITE_URL).toString();
  // Keep og/twitter title aligned with the document title / root layout default.
  const ogTitle = resolvedTitle
    ? `${resolvedTitle} · ${siteName}`
    : `${siteName} · Classical Hatha Yoga`;
  const ogImage = {
    ...DEFAULT_OG_IMAGE,
    alt: ogTitle,
  };

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical },
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
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}
