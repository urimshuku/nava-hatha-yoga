/**
 * Google Maps search URLs for NAVA teaching places.
 *
 * These use Google's Maps URLs API so a tap opens Maps (or the Maps app).
 * They are search links, not a claimed Business Profile.
 */

export const TIRANA_STUDIO = {
  city: "Tirana",
  name: "Albania Yoga Center",
  address: "Albania Yoga Center, 8RGM+54V, Tiranë, Albania",
  mapsQuery: "Albania Yoga Center, 8RGM+54V, Tiranë, Albania",
  latitude: 41.32544,
  longitude: 19.83281,
} as const;

export const SARANDA_VENUE = {
  city: "Saranda",
  name: "Saranda",
  address: "Rruga Skenderbeu 31, 9701, Saranda",
  mapsQuery: "Rruga Skenderbeu 31, 9701, Saranda, Albania",
} as const;

export function googleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

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
