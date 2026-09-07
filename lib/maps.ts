/**
 * Google Maps search URLs for NAVA teaching places.
 *
 * These use Google's Maps URLs API so a tap opens Maps (or the Maps app).
 * The Tirana listing URL is the public Google entry point (no Place ID).
 */

export function googleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Google Search for reviews of a place when there is no Place ID. */
export function googleReviewsUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${query} reviews`)}`;
}

const TIRANA_MAPS_QUERY =
  "Albania Yoga Center, 8RGM+54V, Tiranë, Albania";

export const TIRANA_STUDIO = {
  city: "Tirana",
  name: "Albania Yoga Center",
  address: TIRANA_MAPS_QUERY,
  mapsQuery: TIRANA_MAPS_QUERY,
  latitude: 41.32544,
  longitude: 19.83281,
  listingUrl: googleMapsUrl(TIRANA_MAPS_QUERY),
  reviewsUrl: googleReviewsUrl(TIRANA_MAPS_QUERY),
} as const;

export const SARANDA_VENUE = {
  city: "Saranda",
  name: "Saranda",
  address: "Rruga Skenderbeu 31, 9701, Saranda",
  mapsQuery: "Rruga Skenderbeu 31, 9701, Saranda, Albania",
} as const;

export function mapsUrlForAddress(address?: string | null): string | undefined {
  const value = address?.trim();
  if (!value) return undefined;

  if (/8RGM\+54V|albania yoga center/i.test(value)) {
    return googleMapsUrl(TIRANA_STUDIO.mapsQuery);
  }
  if (/skenderbeu/i.test(value)) {
    return googleMapsUrl(SARANDA_VENUE.mapsQuery);
  }
  return googleMapsUrl(value);
}
