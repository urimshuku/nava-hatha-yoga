/**
 * Renders one or more JSON-LD graph nodes for search engines.
 * Data is built from trusted CMS/code sources only.
 * Multiple nodes are emitted as a single `@graph` document.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const items = (Array.isArray(data) ? data : [data]).filter(
    (item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === "object" && Object.keys(item).length > 0,
  );

  if (items.length === 0) return null;

  const payload =
    items.length === 1
      ? items[0]
      : {
          "@context": "https://schema.org",
          "@graph": items.map((item) => {
            const rest = { ...item };
            delete rest["@context"];
            return rest;
          }),
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
