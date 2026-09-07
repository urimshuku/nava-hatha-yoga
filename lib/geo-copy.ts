import type { PortableTextBlock } from "@portabletext/types";

function normalizeSeoText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

/**
 * Previous Phase 1 / site descriptions that should yield to the current
 * local-keyword copy without a CMS save.
 */
const PREVIOUS_GEO_DESCRIPTIONS = new Set(
  [
    "Authentic Classical Hatha Yoga in Albania — traditional practices taught as intended in Tirana and Saranda, for clarity, balance, and inner transformation.",
    "Authentic Classical Hatha Yoga in Albania — traditional practices taught as intended in Saranda & Tirana, for clarity, balance, and inner transformation.",
    "Meet the Classical Hatha Yoga teacher behind Nava Hatha Yoga in Albania — certified training, traditional practices taught as intended, based in Tirana and Saranda.",
    "Meet the Classical Hatha Yoga teacher behind Nava Hatha Yoga in Albania — certified training, traditional practices taught as intended, based in Saranda & Tirana.",
    "Meet the Classical Hatha Yoga teacher behind Nava Hatha Yoga in Albania — certified training, traditional practices taught as intended, based in Saranda.",
    "Register or enquire about Classical Hatha Yoga in Albania. Teaching is based in Tirana and Saranda, with other locations available upon request. Classes are in-person.",
    "Register or enquire about Classical Hatha Yoga in Albania. Teaching is based in Saranda and Tirana, with other locations available upon request. Classes are in-person.",
    "Upcoming Classical Hatha Yoga workshops, free sessions, and gatherings in Tirana and Saranda, Albania.",
    "Upcoming Classical Hatha Yoga workshops, free sessions, and gatherings in Saranda and Tirana, Albania.",
    "Nava Hatha Yoga offers Classical Hatha Yoga in Tirana and Saranda, Albania — practices taught in their traditional form to support clarity, balance, and inner stability. Classes are in-person.",
    "Nava Hatha Yoga offers Classical Hatha Yoga in Saranda & Tirana, Albania — practices taught in their traditional form to support clarity, balance, and inner stability. Classes are in-person.",
    "Learn Upa Yoga in Albania — a simple, powerful Classical Hatha practice taught as intended, with teaching based in Tirana and Saranda.",
    "Learn Upa Yoga in Albania — a simple, powerful Classical Hatha practice taught as intended, with teaching based in Saranda and Tirana.",
    "Classes are held in person in Tirana and Saranda, Albania.",
    "Classes are held in person in Saranda and Tirana, Albania.",
    "Yoga classes are held in person in Tirana and Saranda, Albania.",
    "Discover upcoming Classical Hatha Yoga retreats in Albania, created for immersive traditional practice and inner transformation. Register your interest for future retreats.",
    "Upcoming immersive Classical Hatha Yoga retreats in Albania — devoted to traditional practice, quiet settings, and inner transformation.",
    "Upcoming Hatha yoga retreats in Tirana and Saranda, Albania — yoga and nature retreats devoted to traditional practice, quiet settings, and inner transformation.",
    "Check Upcoming Events to see if a retreat is scheduled, or register your interest for a potential retreat in a location of your choice.",
    "Check Upcoming Events to see if a yoga retreat is scheduled in Tirana or Saranda, or register your interest for a weekend yoga retreat in Albania — including wellness, meditation, and yoga and nature retreats. Other locations upon request: Vlorë, Gjirokastër, Korçë, and Corfu.",
  ].map(normalizeSeoText),
);

/**
 * CMS or leftover copy that still lists Saranda before Tirana, or treats
 * Tirana as an occasional Surya Kriya venue.
 */
export function isStaleSarandaFirstCopy(text: string): boolean {
  return (
    /taught in Saranda,?\s*with sessions in Tirana when scheduled/i.test(text) ||
    /based in Saranda,?\s*with sessions also held in Tirana/i.test(text) ||
    /Saranda\s*&\s*Tirana/i.test(text) ||
    /Saranda and Tirana/i.test(text)
  );
}

export function isStaleGeoSeoCopy(text: string): boolean {
  return (
    PREVIOUS_GEO_DESCRIPTIONS.has(normalizeSeoText(text)) ||
    isStaleSarandaFirstCopy(text)
  );
}

/** Prefer current Tirana-first copy when CMS still has the old geo phrasing. */
export function preferCurrentGeoCopy(
  cmsValue: string | undefined | null,
  current: string,
): string {
  const text = cmsValue?.trim();
  if (!text || isStaleGeoSeoCopy(text)) return current;
  return text;
}

export function rewriteSarandaFirstCities(text: string): string {
  return text
    .replace(
      /These practices are offered in Albania, based in (?:Saranda and Tirana|Tirana and Saranda), and taught in their traditional form/gi,
      "These practices are offered in Albania as yoga classes, based in Tirana and Saranda, and taught in their traditional form",
    )
    .replace(
      /taught in Saranda, with sessions in Tirana when scheduled/gi,
      "with teaching based in Tirana and Saranda",
    )
    .replace(
      /Teaching is based in Saranda, with sessions also held in Tirana when scheduled/gi,
      "Teaching is based in Tirana and Saranda",
    )
    .replace(/Saranda\s*&\s*Tirana/gi, "Tirana & Saranda")
    .replace(/Saranda and Tirana/gi, "Tirana and Saranda");
}

export function rewriteSarandaFirstPortableText(
  value?: PortableTextBlock[] | null,
): PortableTextBlock[] | undefined {
  if (!value?.length) return value ?? undefined;

  return value.map((block) => {
    if (
      !block ||
      typeof block !== "object" ||
      !("children" in block) ||
      !Array.isArray(block.children)
    ) {
      return block;
    }

    return {
      ...block,
      children: block.children.map((child) => {
        if (
          !child ||
          typeof child !== "object" ||
          !("text" in child) ||
          typeof child.text !== "string"
        ) {
          return child;
        }
        const next = rewriteSarandaFirstCities(child.text);
        return next === child.text ? child : { ...child, text: next };
      }),
    };
  });
}
