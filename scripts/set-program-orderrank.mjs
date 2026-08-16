import { getCliClient } from "sanity/cli";

/**
 * Set live /programs orderRank to match Studio prominence order.
 * Two-phase write so intermediate patches never share a rank.
 *
 * Usage:
 *   npx sanity exec scripts/set-program-orderrank.mjs --with-user-token
 */

const client = getCliClient({ apiVersion: "2024-10-01" });

const FINAL_ORDER = [
  { slug: "surya-kriya", orderRank: 10 },
  { slug: "angamardana", orderRank: 20 },
  { slug: "yogasanas", orderRank: 30 },
  { slug: "upa-yoga", orderRank: 40 },
  { slug: "bhuta-shuddhi", orderRank: 50 },
  { slug: "surya-shakti", orderRank: 55 },
  { slug: "childrens-program", orderRank: 58 },
  { slug: "bhastrika-kriya", orderRank: 60 },
  { slug: "jala-neti", orderRank: 70 },
  { slug: "thoppukarnam", orderRank: 80 },
  { slug: "shanmukhi-mudra", orderRank: 90 },
  { slug: "eye-care-practices", orderRank: 100 },
  { slug: "pavanamuktasana", orderRank: 110 },
];

const before = await client.fetch(
  `*[_type=="program"]{_id, title, "slug": slug.current, orderRank, category} | order(orderRank asc, title asc)`,
);

console.log("BEFORE");
console.log(
  before
    .map((p) => `${p.orderRank}\t${p.slug}\t${p.title}\t${p.category}`)
    .join("\n"),
);

const bySlug = new Map(before.map((p) => [p.slug, p]));

for (const item of FINAL_ORDER) {
  if (!bySlug.has(item.slug)) {
    throw new Error(`Missing program slug: ${item.slug}`);
  }
}

const transaction = client.transaction();

FINAL_ORDER.forEach((item, index) => {
  const doc = bySlug.get(item.slug);
  transaction.patch(doc._id, (patch) => patch.set({ orderRank: 9000 + index }));
});

await transaction.commit();

const transactionFinal = client.transaction();

FINAL_ORDER.forEach((item) => {
  const doc = bySlug.get(item.slug);
  transactionFinal.patch(doc._id, (patch) =>
    patch.set({ orderRank: item.orderRank }),
  );
});

await transactionFinal.commit();

const after = await client.fetch(
  `*[_type=="program"]{_id, title, "slug": slug.current, orderRank, category} | order(orderRank asc, title asc)`,
);

console.log("\nAFTER");
console.log(
  after
    .map((p) => `${p.orderRank}\t${p.slug}\t${p.title}\t${p.category}`)
    .join("\n"),
);

const expected = FINAL_ORDER.map((item) => item.slug);
const actual = after.map((p) => p.slug);
if (JSON.stringify(expected) !== JSON.stringify(actual)) {
  throw new Error(
    `Order mismatch.\nExpected: ${expected.join(", ")}\nActual: ${actual.join(", ")}`,
  );
}

console.log("\nVerified: live orderRank order matches the requested Studio order.");
