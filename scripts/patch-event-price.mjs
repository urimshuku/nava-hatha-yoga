import { getCliClient } from "sanity/cli";

const [eventId, priceLabel] = process.argv.slice(2);

if (!eventId || !priceLabel) {
  console.error("Usage: sanity exec scripts/patch-event-price.mjs --with-user-token <eventId> <priceLabel>");
  process.exit(1);
}

const client = getCliClient({ apiVersion: "2024-10-01" });

await client.patch(eventId).set({ priceLabel }).commit();
console.log(`Updated ${eventId} priceLabel to ${priceLabel}`);
