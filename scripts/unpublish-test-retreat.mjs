import { getCliClient } from "sanity/cli";

/**
 * Write the unpublished template onto the published document (not only a draft)
 * so /retreats cannot keep serving the sample retreat.
 *
 * Usage:
 *   npx sanity exec scripts/unpublish-test-retreat.mjs --with-user-token
 */

const client = getCliClient({ apiVersion: "2024-10-01" });
const ID = "retreat-test-preview";
const DRAFT_ID = `drafts.${ID}`;

const publishedClient = client.withConfig({
  useCdn: false,
  perspective: "published",
});

const rawClient = client.withConfig({ useCdn: false, perspective: "raw" });

const versions = await rawClient.fetch(
  `*[_id in $ids]{_id, title, published, "slug": slug.current}`,
  { ids: [ID, DRAFT_ID] },
);
console.log("Before:", versions);

const source =
  versions.find((doc) => doc._id === DRAFT_ID) ||
  versions.find((doc) => doc._id === ID);

if (!source) {
  throw new Error(`Missing ${ID}`);
}

const full = await rawClient.fetch(`*[_id == $id][0]`, {
  id: source._id,
});

const publishedDoc = {
  ...full,
  _id: ID,
  published: false,
  title: "Retreat template",
  slug: { _type: "slug", current: "retreat-template" },
};
delete publishedDoc._rev;

await client.createOrReplace(publishedDoc);

if (versions.some((doc) => doc._id === DRAFT_ID)) {
  await client.createOrReplace({
    ...publishedDoc,
    _id: DRAFT_ID,
  });
}

const afterPublished = await publishedClient.fetch(
  `*[_id == $id][0]{ _id, title, published, "slug": slug.current }`,
  { id: ID },
);
const afterListing = await publishedClient.fetch(
  `count(*[_type == "retreat" && published == true && !(_id in ["retreat-test-preview", "drafts.retreat-test-preview"])])`,
);
console.log("Published document:", afterPublished);
console.log("Public upcoming count (excluding template):", afterListing);
