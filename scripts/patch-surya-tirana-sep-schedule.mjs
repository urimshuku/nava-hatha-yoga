import { getCliClient } from "sanity/cli";

/**
 * Fix Surya Kriya Tirana Sept 2026 schedule:
 * 13 September sessions should be 07:30 – 09:30 then 17:30 – 19:30
 * (not 17:30 – 19:30 / 19:30 – 21:30).
 *
 * Usage:
 *   npx sanity exec scripts/patch-surya-tirana-sep-schedule.mjs --with-user-token
 */
const EVENT_ID = "event-surya-kriya-tirana-sep-2026";

const time = [
  "12 September: 17:30 – 19:30",
  "13 September: 07:30 – 09:30",
  "13 September: 17:30 – 19:30",
  "",
  "All 3 sessions are mandatory",
].join("\n");

const client = getCliClient({ apiVersion: "2024-10-01" });

const before = await client.fetch(`*[_id == $id][0]{ _id, time }`, { id: EVENT_ID });
if (!before) {
  console.error(`Event not found: ${EVENT_ID}`);
  process.exit(1);
}

console.log("Before:\n", before.time);
await client.patch(EVENT_ID).set({ time }).commit();
const after = await client.fetch(`*[_id == $id][0]{ _id, time }`, { id: EVENT_ID });
console.log("After:\n", after.time);
console.log(`Updated ${EVENT_ID}`);
