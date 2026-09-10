/**
 * Google Maps URLs for NAVA teaching places.
 *
 * Tirana uses coordinates so a tap drops a pin on the studio, not a search for
 * similarly named yoga businesses. Other addresses still use a Maps search.
 */

export const MAPS_LINK_LABEL = "Main Location";

export function googleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Pin a specific point. `query=lat,lng` opens that marker, not a place search. */
export function googleMapsPinUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
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
  listingUrl: googleMapsPinUrl(41.32544, 19.83281),
  reviewsUrl: googleReviewsUrl(TIRANA_MAPS_QUERY),
} as const;

export const SARANDA_VENUE = {
  city: "Saranda",
  name: "Saranda",
  address: "Rruga Skenderbeu 31, 9701, Saranda",
  mapsQuery: "Rruga Skenderbeu 31, 9701, Saranda, Albania",
  listingUrl: googleMapsUrl("Rruga Skenderbeu 31, 9701, Saranda, Albania"),
} as const;

export function mapsUrlForAddress(address?: string | null): string | undefined {
  const value = address?.trim();
  if (!value) return undefined;

  if (/8RGM\+54V|albania yoga center/i.test(value)) {
    return TIRANA_STUDIO.listingUrl;
  }
  if (/skenderbeu/i.test(value)) {
    return SARANDA_VENUE.listingUrl;
  }
  return googleMapsUrl(value);
}
