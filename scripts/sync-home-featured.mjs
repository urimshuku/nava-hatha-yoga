import { getCliClient } from "sanity/cli";

/**
 * Reorder homepage featured programs to match /programs and the Studio sidebar.
 *
 * Usage:
 *   npx sanity exec scripts/sync-home-featured.mjs --with-user-token
 */

const client = getCliClient({ apiVersion: "2024-10-01" });

const FEATURED_SLUGS = [
  "surya-kriya",
  "angamardana",
  "yogasanas",
  "upa-yoga",
  "bhuta-shuddhi",
];

const programs = await client.fetch(
  `*[_type == "program" && slug.current in $slugs]{_id, "slug": slug.current}`,
  { slugs: FEATURED_SLUGS },
);

const bySlug = new Map(programs.map((program) => [program.slug, program._id]));
const missing = FEATURED_SLUGS.filter((slug) => !bySlug.has(slug));
if (missing.length) {
  throw new Error(`Missing programs: ${missing.join(", ")}`);
}

const featuredPrograms = FEATURED_SLUGS.map((slug) => ({
  _type: "reference",
  _ref: bySlug.get(slug),
  _key: `feat-${slug}`,
}));

const ids = await client.fetch(`*[_type == "homePage"]._id`);
for (const id of ids) {
  await client.patch(id).set({ featuredPrograms }).commit();
  console.log(`✓ ${id}`);
}

console.log(`Featured order: ${FEATURED_SLUGS.join(" → ")}`);
