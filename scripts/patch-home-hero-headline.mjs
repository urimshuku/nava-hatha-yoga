import { getCliClient } from "sanity/cli";

/**
 * Set homepage hero headline to "Nava Classical Hatha Yoga" only
 * (remove "Now in Albania, and Beyond." from the headline).
 *
 * Usage:
 *   npx sanity exec scripts/patch-home-hero-headline.mjs --with-user-token
 */
const client = getCliClient({ apiVersion: "2024-10-01" });
const ID = "homePage";

const before = await client.fetch(`*[_id == $id][0]{ hero }`, { id: ID });
console.log("Before:", before?.hero?.headline);

await client
  .patch(ID)
  .set({ "hero.headline": "Nava Classical Hatha Yoga" })
  .unset(["hero.subtitle"])
  .commit();

const after = await client.fetch(`*[_id == $id][0]{ hero }`, { id: ID });
console.log("After:", after?.hero?.headline, "subtitle:", after?.hero?.subtitle ?? null);
