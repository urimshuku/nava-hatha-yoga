/**
 * Static site constants and fallback contact details.
 * Most of these are also editable in Sanity (Site Settings); these act as
 * sensible placeholders before the CMS is connected.
 */

export const SITE_NAME = "Ananta Hatha Yoga";
export const SITE_TAGLINE = "Above all, balance.";

/** Footer certification badge (local file only). */
export const FOOTER_CERTIFICATION_LOGO = {
  src: "/images/Sadhguru_Gurukulam_Logo.avif",
  alt: "Isha Hatha Yoga Certified Teacher",
  width: 512,
  height: 135,
} as const;
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

export const PROGRAM_BEFORE_PROGRAM_TITLE = "Before the Program";

export const PROGRAM_BEFORE_PROGRAM_NOTES = [
  "This practice does not require prior yoga experience.",
] as const;

const PROGRAM_BEFORE_PROGRAM_NOTES_BY_SLUG: Record<string, readonly string[]> = {
  angamardana: [
    "This practice does not require prior yoga experience.",
    "Those who are pregnant, recovering from surgery, or managing chronic injuries should speak with the teacher before registering.",
  ],
};

export function getBeforeProgramNotes(slug: string): readonly string[] {
  return PROGRAM_BEFORE_PROGRAM_NOTES_BY_SLUG[slug] ?? PROGRAM_BEFORE_PROGRAM_NOTES;
}

/** Shown below After the Program on every program detail page. */
export const PROGRAM_MEDICAL_NOTICE_TITLE = "Medical Notice!";

export const PROGRAM_MEDICAL_NOTICE =
  "These practices are offered as complementary tools for wellbeing and inner balance. Please consult your physician if you have any medical condition or concern.";

export const PROGRAM_AFTER_PROGRAM_TITLE = "After the Program";

export function programAfterProgramText(title: string): readonly [string, string] {
  return [
    `${title} can be practised independently at home. Regular, consistent practice helps deepen the benefits and integrate the practice into daily life.`,
    "Also, 40 days of practice support is available after the program.",
  ];
}

export function programSidebarCtaText(title: string): readonly [string, string] {
  return [
    `${title} is offered in group sessions and can also be arranged privately.`,
    "Get in touch to learn about upcoming sessions or to arrange a private or group setting.",
  ];
}

const PROGRAM_VIDEO_LINKS: Record<string, { title: string }> = {
  angamardana: {
    title: "Sadhguru speaks on Angamardana",
  },
  "bhuta-shuddhi": {
    title: "Bhuta Shuddhi — The Ultimate Cleansing",
  },
};

export function getProgramVideoLink(slug: string, programTitle: string) {
  return (
    PROGRAM_VIDEO_LINKS[slug] ?? {
      title: `${programTitle} on YouTube`,
    }
  );
}
