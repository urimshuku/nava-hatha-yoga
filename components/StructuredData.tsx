import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import type { SiteSettings } from "@/sanity/lib/types";

/**
 * Organization / LocalBusiness structured data for SEO and local discovery.
 * Rendered once site-wide.
 */
export function StructuredData({ settings }: { settings?: SiteSettings }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: settings?.brandName || SITE_NAME,
    description: settings?.description || SITE_DESCRIPTION,
    url: SITE_URL,
    ...(settings?.email ? { email: settings.email } : {}),
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Saranda",
      addressCountry: "AL",
    },
    areaServed: "Saranda, Albania",
    knowsAbout: "Classical Hatha Yoga",
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is static, controlled data; safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
