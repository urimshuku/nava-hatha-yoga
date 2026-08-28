import { buildOrganizationJsonLd } from "@/lib/structured-data";
import type { SiteSettings } from "@/lib/cms/content-types";

/**
 * Organization / LocalBusiness structured data for SEO and local discovery.
 * Rendered once site-wide.
 */
export function StructuredData({ settings }: { settings?: SiteSettings }) {
  const data = buildOrganizationJsonLd(settings);

  return (
    <script
      type="application/ld+json"
      // JSON-LD is static, controlled data; safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
