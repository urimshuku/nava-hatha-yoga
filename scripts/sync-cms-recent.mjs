import { getCliClient } from "sanity/cli";

/**
 * Sync Studio content with the latest copy (Saranda & Tirana, retreat template).
 *
 * Usage:
 *   npx sanity exec scripts/sync-cms-recent.mjs --with-user-token
 */

const client = getCliClient({ apiVersion: "2024-10-01" });

const ABOUT_HERO =
  "Know more about the teacher behind Nava Hatha Yoga in Albania — certified Classical Hatha Yoga training, practices taught as intended, based in Saranda & Tirana.";
const ABOUT_SEO =
  "Meet the Classical Hatha Yoga teacher behind Nava Hatha Yoga in Albania — certified training, traditional practices taught as intended, based in Saranda & Tirana.";
const SITE_DESCRIPTION =
  "Nava Hatha Yoga offers Classical Hatha Yoga in Saranda & Tirana, Albania — practices taught in their traditional form to support clarity, balance, and inner stability. Classes are in-person.";
const EVENTS_DESCRIPTION =
  "Classes are held in person in Saranda and Tirana, Albania.";
const HOME_SEO_DESCRIPTION =
  "Authentic Classical Hatha Yoga in Albania — traditional practices taught as intended in Saranda & Tirana, for clarity, balance, and inner transformation.";

await client
  .patch("aboutPage")
  .set({
    heroDescription: ABOUT_HERO,
    "seo.title": "Classical Hatha Yoga Teacher in Albania",
    "seo.description": ABOUT_SEO,
  })
  .commit();
console.log("✓ aboutPage");

await client
  .patch("homePage")
  .set({
    "seo.description": HOME_SEO_DESCRIPTION,
    "upcomingEventsSection.description": EVENTS_DESCRIPTION,
  })
  .commit();
console.log("✓ homePage");

await client
  .patch("siteSettings")
  .set({
    description: SITE_DESCRIPTION,
  })
  .commit();
console.log("✓ siteSettings");

const template = await client.fetch(
  `*[_id == "retreat-test-preview"][0]{ title, published, "slug": slug.current }`,
);
if (!template) {
  console.warn("⚠ Retreat template missing (retreat-test-preview)");
} else {
  if (template.published) {
    await client.patch("retreat-test-preview").set({ published: false }).commit();
    console.log("✓ retreat template unpublished");
  } else {
    console.log("✓ retreat template present and unpublished:", template);
  }
}

const publishedCount = await client.fetch(
  `count(*[_type == "retreat" && published == true && !(_id in ["retreat-test-preview", "drafts.retreat-test-preview"])])`,
);
console.log("Published public retreats:", publishedCount);
console.log("CMS sync complete.");
