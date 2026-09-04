#!/usr/bin/env node
/**
 * Publishes the 30 September Eye Care Practices session as a Module System
 * workshop, copied from the 29 September Tirana session.
 *
 *   node scripts/upsert-eye-care-module-event.mjs --remote
 *   node scripts/upsert-eye-care-module-event.mjs
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DB_NAME = "nava-hatha-yoga-forms";
const SLUG = "eye-care-practices-tirane-2026-09-30";
const isRemote = process.argv.includes("--remote");

const event = {
  _id: `cms.event.${SLUG}`,
  title: "Eye Care Practices",
  slug: SLUG,
  date: "2026-09-29T22:00:00.000Z",
  endDate: "2026-09-30T16:45:00.000Z",
  description:
    "Eye care practices offer a natural way to improve vision related issues which many a times stem from routine patterns of sitting in front of computers, televisions, phones etc.\n\nThese unique practises, devised by Sadhguru, are designed to have a phenomenal impact on the overall health and capabilities of the eyes.\n\nThe practices can help correct eye problems, such as myopia (nearsightedness) and hyperopia (farsightedness) and strengthen the eye's overall vision and focus; that can be maintained even into old age.",
  sessions: [
    { day: "30 September", hours: "07:30 – 08:45" },
    { day: "30 September", hours: "17:30 – 18:45" },
  ],
  sessionNote: "All 2 sessions are mandatory",
  cityCountry: "Tiranë, Albania",
  location: "Albania Yoga Center, 8RGM+54V, Tiranë, Albania",
  yogaExperience:
    "Pre-requisite:    Surya Kriya / Isha Upa-yoga / Angamardana / Surya Shakti / Yogasanas",
  priceLabel: "50€",
  paymentNote: "Payment details will be shared after registration.",
  ageRequirement: "8+",
  category: "Modular Workshop",
  relatedProgram: {
    title: "Eye Care Practices",
    slug: "eye-care-practices",
  },
};

const json = JSON.stringify(event).replace(/'/g, "''");
const now = new Date().toISOString();
const sql = `INSERT INTO cms_documents
  (type, slug, data, live_data, published, hidden, sort_order, updated_at)
VALUES
  ('event', '${SLUG}', '${json}', '${json}', 1, 0, NULL, '${now}')
ON CONFLICT (type, slug) DO UPDATE SET
  data = excluded.data,
  live_data = excluded.live_data,
  published = 1,
  hidden = 0,
  updated_at = excluded.updated_at;
`;

const dir = mkdtempSync(path.join(tmpdir(), "nava-cms-"));
const file = path.join(dir, "upsert.sql");
writeFileSync(file, sql);

const args = [
  "wrangler",
  "d1",
  "execute",
  DB_NAME,
  ...(isRemote ? ["--remote"] : ["--local"]),
  "--file",
  file,
];

try {
  const out = execFileSync("npx", args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  console.log(out.trim() || `Upserted ${SLUG} (${isRemote ? "remote" : "local"}).`);
} finally {
  unlinkSync(file);
}
