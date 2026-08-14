import { createReadStream } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getCliClient } from "sanity/cli";

/**
 * Keep a sample retreat in Studio as an unpublished template.
 *
 * Usage:
 *   npx sanity exec scripts/create-test-retreat.mjs --with-user-token
 *
 * The document id is `retreat-test-preview`. Keep Published off so /retreats
 * stays on Coming Soon until a real retreat is duplicated from this template.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const client = getCliClient({ apiVersion: "2024-10-01" });
const ID = "retreat-test-preview";

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: Math.random().toString(36).slice(2, 10),
        text,
        marks: [],
      },
    ],
  };
}

async function uploadImage(publicPath, alt) {
  const filePath = resolve(__dirname, "../public", publicPath);
  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename: basename(filePath),
  });
  return {
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: asset._id },
    alt,
  };
}

const [cover, galleryA, galleryB] = await Promise.all([
  uploadImage(
    "images/about/isha-yoga-center.jpg",
    "Quiet practice grounds at a Classical Hatha Yoga retreat",
  ),
  uploadImage(
    "images/programs/yogasanas-desktop.webp",
    "Practitioners in yogasanas during a retreat session",
  ),
  uploadImage(
    "images/about/isha-hatha-yoga-teacher-training.jpg",
    "Guided Classical Hatha Yoga instruction in a retreat setting",
  ),
]);

const doc = {
  _id: ID,
  _type: "retreat",
  title: "Retreat template",
  slug: { _type: "slug", current: "retreat-template" },
  published: false,
  date: "2026-09-18T09:00:00.000+02:00",
  endDate: "2026-09-21T17:00:00.000+02:00",
  location: "Saranda, Albania",
  priceLabel: "Contact for details",
  description:
    "Four days of immersive Classical Hatha Yoga by the Ionian coast — unhurried practice, quiet surroundings, and careful guidance in the traditional form.",
  body: [
    block("The days", "h2"),
    block(
      "Each day is shaped around the practices themselves: morning sessions while the system is still quiet, time to rest, and evening practice as the light softens. The pace is unhurried, so the body and mind can settle rather than be pushed.",
    ),
    block("Who it is for", "h2"),
    block(
      "This retreat is for those who wish to go deeper into Classical Hatha Yoga — whether you already practise with Nava or are meeting the tradition for the first time. No prior experience is required.",
    ),
    block("The setting", "h2"),
    block(
      "Held in Saranda, the days are spent close to the sea, with space to walk, rest, and eat simply between sessions. The emphasis is on atmosphere and attention, not a packed schedule.",
    ),
  ],
  image: cover,
  gallery: [
    { ...galleryA, _key: "gallery-a" },
    { ...galleryB, _key: "gallery-b" },
  ],
  registrationLink: "https://navahathayoga.com/contact",
  cancellationPolicy: [
    block(
      "Places are confirmed personally. If you need to cancel, please write as early as you can so the place can be offered to someone else. Any refund is arranged case by case.",
    ),
  ],
  seo: {
    title: "Classical Hatha Yoga Retreat in Saranda",
    description:
      "A four-day Classical Hatha Yoga retreat in Saranda, Albania — immersive traditional practice by the Ionian coast.",
  },
};

await client.createOrReplace(doc);
console.log(`Created/updated unpublished template ${ID}`);
console.log("Studio: Retreat template (left pane)");
console.log("Website stays on Coming Soon until a duplicated retreat is published.");
