import { getCliClient } from "sanity/cli";

/**
 * Set the four page introductions to the current live-site copy.
 *
 * Usage:
 *   npx sanity exec scripts/sync-page-intros.mjs --with-user-token
 */

const client = getCliClient({ apiVersion: "2024-10-01" });

const INTROS = [
  {
    type: "retreatsPage",
    heroDescription:
      "Upcoming immersive Classical Hatha Yoga retreats in Albania — devoted to traditional practice, quiet settings, and inner transformation.",
  },
  {
    type: "aboutPage",
    heroDescription:
      "Know more about the teacher behind Nava Hatha Yoga in Albania — certified Classical Hatha Yoga training, practices taught as intended.",
  },
  {
    type: "contactPage",
    heroDescription:
      "For questions regarding upcoming programs, private instruction, or teaching locations, please leave a message below.",
  },
  {
    type: "eventsPage",
    heroDescription:
      "Upcoming in-person Classical Hatha Yoga sessions. Explore the sessions below and discover a practice that can bring greater clarity, vitality, and steadiness into everyday life.",
  },
];

for (const { type, heroDescription } of INTROS) {
  const ids = await client.fetch(`*[_type == $type]._id`, { type });
  if (!ids.length) {
    console.warn(`⚠ ${type} not found`);
    continue;
  }
  for (const id of ids) {
    await client.patch(id).set({ heroDescription }).commit();
  }
  console.log(`✓ ${type} (${ids.length})`);
}
