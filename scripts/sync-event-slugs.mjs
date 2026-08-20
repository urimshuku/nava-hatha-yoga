import { getCliClient } from "sanity/cli";

/**
 * Set Page URL (slug) on events that do not have one yet.
 * Matches the website fallback: title + location + date.
 *
 * Usage:
 *   npx sanity exec scripts/sync-event-slugs.mjs --with-user-token
 */

const client = getCliClient({ apiVersion: "2024-10-01" });
const RESERVED = new Set(["archive"]);

function slugifySegment(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function eventLocationShort(location) {
  if (!location) return "";
  if (/saranda/i.test(location)) return "Saranda";
  if (/tiran/i.test(location)) return "Tirane";
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/^\d+$/.test(part) && !/^[A-Z0-9+]+$/i.test(part));
  if (parts.length >= 2) return parts[parts.length - 2];
  return parts[parts.length - 1] ?? location;
}

function deriveEventSlug(event) {
  const date = event.date ? String(event.date).slice(0, 10) : "";
  const location = eventLocationShort(event.location);
  const derived = slugifySegment(
    [event.title, location, date].filter(Boolean).join(" "),
  );
  if (derived && !RESERVED.has(derived)) return derived;
  return slugifySegment(event._id.replace(/^drafts\./, "")) || event._id;
}

const events = await client.fetch(
  `*[_type == "event"]{_id, title, date, location, "slug": slug.current}`,
);

const used = new Set(
  events.map((event) => event.slug).filter((slug) => Boolean(slug)),
);

const transaction = client.transaction();
const planned = [];

for (const event of events) {
  if (event.slug) continue;
  let slug = deriveEventSlug(event);
  if (used.has(slug) || RESERVED.has(slug)) {
    slug = `${slug}-${event._id.replace(/^drafts\./, "").slice(-6)}`;
  }
  used.add(slug);
  transaction.patch(event._id, (patch) =>
    patch.set({ slug: { _type: "slug", current: slug } }),
  );
  planned.push(`${event.title} → ${slug}`);
}

if (planned.length === 0) {
  console.log("All events already have a Page URL.");
} else {
  await transaction.commit();
  console.log(`Set Page URL on ${planned.length} event(s):`);
  console.log(planned.join("\n"));
}
