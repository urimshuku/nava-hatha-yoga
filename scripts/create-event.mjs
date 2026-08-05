import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { getCliClient } from "sanity/cli";

const [eventId] = process.argv.slice(2);

if (!eventId) {
  console.error("Usage: sanity exec scripts/create-event.mjs --with-user-token <eventId>");
  process.exit(1);
}

const seedPath = join(dirname(fileURLToPath(import.meta.url)), "..", "seed", "seed.ndjson");
const doc = readFileSync(seedPath, "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line))
  .find((entry) => entry._id === eventId);

if (!doc) {
  console.error(`Event not found in seed: ${eventId}`);
  process.exit(1);
}

const client = getCliClient({ apiVersion: "2024-10-01" });
await client.createOrReplace(doc);
console.log(`Created/updated ${eventId}`);
