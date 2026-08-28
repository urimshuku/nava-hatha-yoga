import {
  BRAND_LOGO,
  CONTACT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  getProgramPriceLabel,
} from "@/lib/constants";
import { eventEndTimestamp, eventStartTimestamp, isPastEvent } from "@/lib/event-boundary";
import { programImageSrc } from "@/lib/local-images";
import { formatRegistrationEventLabel } from "@/lib/utils";
import { urlForImage } from "@/lib/cms/image-url";
import type {
  Program,
  Retreat,
  SiteSettings,
  YogaEvent,
} from "@/lib/cms/content-types";

type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;

/** Saranda, Albania — approximate city center for LocalBusiness geo. */
const SARANDA_GEO = {
  "@type": "GeoCoordinates",
  latitude: 39.8756,
  longitude: 20.0049,
} as const;

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

function parseEuroOffer(priceLabel?: string | null): JsonLd | undefined {
  if (!priceLabel?.trim()) return undefined;
  const free = /free/i.test(priceLabel);
  if (free) {
    return {
      "@type": "Offer",
      price: 0,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    };
  }
  const match = priceLabel.replace(/\s/g, "").match(/(\d+(?:[.,]\d+)?)\s*€?/);
  if (!match) return undefined;
  return {
    "@type": "Offer",
    price: Number(match[1].replace(",", ".")),
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  };
}

function toIsoDateTime(ms: number): string {
  return new Date(ms).toISOString();
}

function placeFromLocation(location?: string | null): JsonLd {
  const name = location?.trim() || CONTACT.location;
  return {
    "@type": "Place",
    name,
    address: {
      "@type": "PostalAddress",
      addressLocality: name.includes("Tirana") ? "Tirana" : "Saranda",
      addressCountry: "AL",
      ...(name ? { streetAddress: name } : {}),
    },
  };
}

function organizer(settings?: SiteSettings): JsonLd {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: settings?.brandName || SITE_NAME,
    url: SITE_URL,
  };
}

/**
 * Site-wide LocalBusiness / HealthAndBeautyBusiness node.
 */
export function buildOrganizationJsonLd(settings?: SiteSettings): JsonLd {
  const brandName = settings?.brandName || SITE_NAME;
  const logoUrl = absoluteUrl(BRAND_LOGO.src);
  const socialUrls = settings?.social
    ?.map((link) => link.url)
    .filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": ORG_ID,
    name: brandName,
    description: settings?.description || SITE_DESCRIPTION,
    url: SITE_URL,
    image: logoUrl,
    logo: logoUrl,
    priceRange: "€€",
    ...(settings?.email ? { email: settings.email } : {}),
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    ...(socialUrls?.length ? { sameAs: socialUrls } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Saranda",
      addressCountry: "AL",
    },
    geo: SARANDA_GEO,
    areaServed: [
      { "@type": "Country", name: "Albania" },
      { "@type": "City", name: "Saranda" },
      { "@type": "City", name: "Tirana" },
    ],
    knowsAbout: "Classical Hatha Yoga",
  };
}

/**
 * One schema.org/Event node per upcoming workshop / class / gathering.
 */
export function buildEventJsonLd(
  event: YogaEvent,
  settings?: SiteSettings,
): JsonLd | null {
  if (!event.date) return null;

  const startMs = eventStartTimestamp(event);
  if (!Number.isFinite(startMs) || startMs === Number.POSITIVE_INFINITY) return null;

  const endMs = eventEndTimestamp(event);
  const registrationEvent = formatRegistrationEventLabel(event);
  const offerUrl = absoluteUrl(
    `/register?event=${encodeURIComponent(registrationEvent)}`,
  );
  const offer = parseEuroOffer(event.priceLabel);
  const imageBuilder = urlForImage(event.image);
  const imageUrl = imageBuilder
    ? absoluteUrl(imageBuilder.width(1200).height(630).url())
    : event.relatedProgram?.slug
      ? absoluteUrl(programImageSrc(event.relatedProgram.slug) ?? BRAND_LOGO.src)
      : absoluteUrl(BRAND_LOGO.src);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    url: event.slug ? absoluteUrl(`/events/${event.slug}`) : absoluteUrl("/events"),
    ...(event.description ? { description: event.description } : {}),
    startDate: toIsoDateTime(startMs),
    ...(Number.isFinite(endMs) && endMs !== Number.POSITIVE_INFINITY
      ? { endDate: toIsoDateTime(endMs) }
      : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: placeFromLocation(event.location),
    image: [imageUrl],
    organizer: organizer(settings),
    ...(offer
      ? {
          offers: {
            ...offer,
            url: offerUrl,
          },
        }
      : {
          offers: {
            "@type": "Offer",
            url: offerUrl,
            availability: "https://schema.org/InStock",
            priceCurrency: "EUR",
          },
        }),
  };
}

export function buildEventsJsonLd(
  events: YogaEvent[],
  settings?: SiteSettings,
): JsonLd[] {
  return events
    .map((event) => buildEventJsonLd(event, settings))
    .filter((node): node is JsonLd => node != null);
}

/**
 * schema.org/Course for a Classical Hatha Yoga program offering.
 */
export function buildCourseJsonLd(
  program: Program,
  settings?: SiteSettings,
): JsonLd {
  const url = absoluteUrl(`/programs/${program.slug}`);
  const priceLabel = getProgramPriceLabel(program.slug, program.priceLabel);
  const offer = parseEuroOffer(priceLabel);
  const programImage = urlForImage(program.image);
  const imageUrl = programImage
    ? absoluteUrl(programImage.width(1200).height(800).url())
    : absoluteUrl(programImageSrc(program.slug) ?? BRAND_LOGO.src);

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description:
      program.seo?.description ||
      program.shortIntro ||
      `${program.title} — Classical Hatha Yoga program at ${settings?.brandName || SITE_NAME}.`,
    url,
    image: imageUrl,
    provider: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: settings?.brandName || SITE_NAME,
      sameAs: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      name: program.title,
      courseMode: "https://schema.org/Onsite",
      location: {
        "@type": "Place",
        name: settings?.location || CONTACT.location,
        address: {
          "@type": "PostalAddress",
          addressCountry: "AL",
          addressLocality: "Saranda",
        },
      },
    },
    ...(offer
      ? {
          offers: {
            ...offer,
            category: "Paid",
            url,
          },
        }
      : {}),
  };
}

/**
 * Event markup for a dated retreat (immersive multi-day offering).
 */
export function buildRetreatEventJsonLd(
  retreat: Retreat,
  settings?: SiteSettings,
): JsonLd | null {
  if (!retreat.date) return null;

  const startMs = Date.parse(retreat.date);
  if (!Number.isFinite(startMs)) return null;

  const endMs = eventEndTimestamp({
    date: retreat.date,
    endDate: retreat.endDate,
  });
  const past = isPastEvent({ date: retreat.date, endDate: retreat.endDate });
  const imageBuilder = urlForImage(retreat.image);
  const imageUrl = imageBuilder
    ? absoluteUrl(imageBuilder.width(1200).height(630).url())
    : absoluteUrl(BRAND_LOGO.src);
  const url = absoluteUrl(`/retreats/${retreat.slug}`);
  const offer = parseEuroOffer(retreat.priceLabel);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: retreat.title,
    ...(retreat.description ? { description: retreat.description } : {}),
    startDate: new Date(startMs).toISOString(),
    ...(Number.isFinite(endMs) && endMs !== Number.POSITIVE_INFINITY
      ? { endDate: toIsoDateTime(endMs) }
      : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: past
      ? "https://schema.org/EventCompleted"
      : "https://schema.org/EventScheduled",
    location: placeFromLocation(retreat.location),
    image: [imageUrl],
    url,
    organizer: organizer(settings),
    ...(offer
      ? {
          offers: {
            ...offer,
            url: retreat.registrationLink || absoluteUrl("/contact"),
          },
        }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
