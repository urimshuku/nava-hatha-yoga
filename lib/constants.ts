/**
 * Static site constants and fallback contact details.
 * Most of these are also editable in Sanity (Site Settings); these act as
 * sensible placeholders before the CMS is connected.
 */

export const SITE_NAME = "Ananta Hatha Yoga";
export const SITE_TAGLINE = "Classical Hatha Yoga, taught in its original form.";
export const SITE_DESCRIPTION =
  "Ananta Hatha Yoga offers Classical Hatha Yoga in Saranda, Albania — practices taught in their traditional form to support clarity, balance, and inner stability. Classes are in-person.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.anantahathayoga.com";

export const CONTACT = {
  email: "hello@anantahathayoga.com",
  phone: "+355 69 000 0000",
  // Digits only (international format, no +, spaces, or symbols) for wa.me links
  whatsapp: "355690000000",
  location: "Saranda, Albania",
};

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Retreats", href: "/retreats" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
] as const;

export const EVENT_CATEGORIES = ["Workshop", "Retreat", "Free Session"] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];
