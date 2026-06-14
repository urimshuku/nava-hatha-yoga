import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import type { SeoFields } from "@/sanity/lib/types";

interface BuildMetadataArgs {
  title?: string;
  description?: string;
  /** Per-page SEO overrides from the CMS take precedence. */
  seo?: SeoFields;
  path?: string;
  noIndex?: boolean;
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
}: BuildMetadataArgs = {}): Metadata {
  const resolvedTitle = seo?.title || title;
  const resolvedDescription = seo?.description || description || SITE_DESCRIPTION;
  const canonical = new URL(path, SITE_URL).toString();

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: resolvedTitle ? `${resolvedTitle} · ${SITE_NAME}` : SITE_NAME,
      description: resolvedDescription,
      url: canonical,
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle ? `${resolvedTitle} · ${SITE_NAME}` : SITE_NAME,
      description: resolvedDescription,
    },
  };
}
