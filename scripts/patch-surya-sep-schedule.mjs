import { getCliClient } from "sanity/cli";

/**
 * Fix Surya Kriya Saranda Sept 2026 schedule:
 * 6 September morning slot was incorrectly stored as 19:30 – 21:30
 * (should be 07:30 – 09:30, matching other multi-session SK weekends).
 *
 * Usage:
 *   npx sanity exec scripts/patch-surya-sep-schedule.mjs --with-user-token
 */
const EVENT_ID = "event-surya-kriya-sep-2026";

const time = [
  "5 September: 17:30 – 19:30",
  "6 September: 07:30 – 09:30",
  "6 September: 17:30 – 19:30",
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
