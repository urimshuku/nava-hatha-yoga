/**
 * Static site constants and fallback contact details.
 * Most of these are also editable in Sanity (Site Settings); these act as
 * sensible placeholders before the CMS is connected.
 */

export const SITE_NAME = "Nava Hatha Yoga";
export const SITE_TAGLINE = "In balance, life unfolds.";

/** Horizontal brand logo (with wordmark). */
export const BRAND_LOGO = {
  src: "/images/nava-hatha-yoga-logo.webp",
  alt: "Nava Hatha Yoga",
  width: 520,
  height: 371,
} as const;

/** Combined header logo (symbol + wordmark). */
export const BRAND_LOGO_HEADER = {
  src: "/images/nava-hatha-yoga-header-logo.webp",
  alt: "Nava Hatha Yoga",
  width: 400,
  height: 168,
} as const;

/** Symbol-only brand mark. */
export const BRAND_LOGO_SYMBOL = {
  src: "/images/nava-logo-symbol-v2.webp",
  alt: "Nava Hatha Yoga",
  width: 256,
  height: 256,
} as const;

/** Text wordmark (used to build header logo). */
export const BRAND_LOGO_WORDMARK = {
  src: "/images/nava-hatha-yoga-wordmark.webp",
  alt: "Nava Hatha Yoga",
  width: 256,
  height: 81,
} as const;

/** Full vertical brand logo (footer). */
export const BRAND_LOGO_FULL = {
  src: "/images/nava-hatha-yoga-logo-full.webp",
  alt: "Nava Hatha Yoga",
  width: 320,
  height: 320,
} as const;
export const ABOUT_PAGE_HERO_TITLE =
  "Classical Hatha Yoga, taught with care.";

/** Footer certification badge (local file only). */
export const FOOTER_CERTIFICATION_LOGO = {
  src: "/images/Sadhguru_Gurukulam_Logo.webp",
  alt: "Isha Hatha Yoga Certified Teacher",
  width: 512,
  height: 135,
} as const;
export const SITE_DESCRIPTION =
  "Nava Hatha Yoga offers Classical Hatha Yoga in Saranda & Tirana, Albania — practices taught in their traditional form to support clarity, balance, and inner stability. Classes are in-person.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://navahathayoga.com";

export const CONTACT = {
  email: "info@navahathayoga.com",
  phone: "+355 69 939 1791",
  // Digits only (international format, no +, spaces, or symbols) for wa.me links
  whatsapp: "355699391791",
  instagram: "navahathayoga",
  location: "Saranda, Albania",
};

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function instagramLink(): string {
  return `https://www.instagram.com/${CONTACT.instagram}/`;
}

/** Prefer a matching CMS social URL; fall back to the built-in Instagram handle. */
export function socialLink(
  social: { label?: string; url?: string }[] | undefined,
  label: string,
  fallback?: string,
): string | undefined {
  const match = social?.find(
    (item) => item.label?.toLowerCase() === label.toLowerCase() && item.url?.trim(),
  );
  return match?.url?.trim() || fallback;
}

export function resolveInstagramHref(
  social?: { label?: string; url?: string }[],
): string {
  return socialLink(social, "Instagram", instagramLink()) ?? instagramLink();
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs & Offerings", href: "/programs" },
  { label: "Retreats & Partner Programs", href: "/retreats" },
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
  "eye-care-practices": [
    "Must have learned any of the following programs such as: Surya Kriya, Surya Shakti, Yogasanas, Angamardana or full Upa-Yoga (not taught online or in Inner Engineering).",
  ],
  "jala-neti": [
    "Must have learned any of the following programs such as: Surya Kriya, Surya Shakti, Yogasanas, Angamardana.",
  ],
};

const PROGRAM_BEFORE_PROGRAM_TITLES_BY_SLUG: Record<string, string> = {
  "eye-care-practices": "Pre-Requisite",
  "jala-neti": "Pre-Requisite",
};

export function getBeforeProgramTitle(slug: string): string {
  return PROGRAM_BEFORE_PROGRAM_TITLES_BY_SLUG[slug] ?? PROGRAM_BEFORE_PROGRAM_TITLE;
}

export function getBeforeProgramNotes(slug: string): readonly string[] {
  return PROGRAM_BEFORE_PROGRAM_NOTES_BY_SLUG[slug] ?? PROGRAM_BEFORE_PROGRAM_NOTES;
}

/** Shown below After the Program on every program detail page. */
export const PROGRAM_BONUS_TITLE = "Bonus";

export const PROGRAM_BONUS_ITEMS = ["One free review session."] as const;

export const PROGRAM_DISCOUNT_NOTE =
  "For those in need, discount is possible!";

export const PROGRAM_MEDICAL_NOTICE_TITLE = "Medical Notice!";

export const PROGRAM_MEDICAL_NOTICE =
  "These practices are offered as complementary tools for wellbeing and inner balance. Please consult your physician if you have any medical condition or concern.";

export const PROGRAM_AFTER_PROGRAM_TITLE = "After the Program";

export function programAfterProgramText(title: string): readonly [string, string] {
  return [
    `${title} can be practised independently at home. Regular, consistent practice helps deepen the benefits and integrate the practice into daily life.`,
    "Also, 40 days of practice support is available after the program - where applicable.",
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

/** Used when a program has no videoUrl in Sanity yet. */
export const PROGRAM_VIDEO_URL_FALLBACKS: Record<string, string> = {
  "surya-shakti": "https://www.youtube.com/watch?v=OBds5NZ4PRs",
  "upa-yoga": "https://youtu.be/tVZcK9pjI9I?si=gePcv9RJXXMO2TGA",
};

export function getProgramVideoUrl(slug: string, videoUrl?: string): string | undefined {
  return videoUrl ?? PROGRAM_VIDEO_URL_FALLBACKS[slug];
}

export function getProgramVideoLink(slug: string, programTitle: string) {
  return (
    PROGRAM_VIDEO_LINKS[slug] ?? {
      title: `${programTitle} on YouTube`,
    }
  );
}

export const PROGRAM_DEFAULT_PRICE_LABEL = "Contact for details";

/** Set to true to show price in the program detail sidebar. */
export const SHOW_PROGRAM_SIDEBAR_PRICE = false;

export type ProgramIntensity = "Low" | "Medium" | "High";

export const PROGRAM_INTENSITY_BY_SLUG: Partial<
  Record<string, ProgramIntensity>
> = {
  "surya-kriya": "Medium",
  yogasanas: "Medium",
  angamardana: "High",
  "surya-shakti": "Medium",
  "upa-yoga": "Low",
  "childrens-program": "Low",
};

export function getProgramIntensity(slug?: string | null): ProgramIntensity | null {
  if (!slug) return null;
  return PROGRAM_INTENSITY_BY_SLUG[slug] ?? null;
}

export const MAIN_PROGRAM_SLUGS = [
  "upa-yoga",
  "surya-kriya",
  "surya-shakti",
  "yogasanas",
  "angamardana",
  "bhuta-shuddhi",
  "childrens-program",
] as const;

export const SPECIAL_PROGRAM_SLUGS = [
  "bhastrika-kriya",
  "jala-neti",
  "thoppukarnam",
  "shanmukhi-mudra",
  "eye-care-practices",
  "pavanamuktasana",
] as const;

export const PROGRAM_ORDER: readonly string[] = [
  ...MAIN_PROGRAM_SLUGS,
  ...SPECIAL_PROGRAM_SLUGS,
];

export function partitionProgramsByCategory<
  T extends { slug: string; category?: string },
>(programs: T[]) {
  // Prefer the CMS category when any program has one (list order comes from
  // the CMS orderRank); otherwise fall back to the built-in slug lists.
  if (programs.some((program) => program.category)) {
    const isSpecial = (program: T) =>
      program.category === "special" ||
      (!program.category &&
        (SPECIAL_PROGRAM_SLUGS as readonly string[]).includes(program.slug));

    return {
      main: programs.filter((program) => !isSpecial(program)),
      special: programs.filter(isSpecial),
    };
  }

  const bySlug = new Map(programs.map((program) => [program.slug, program]));

  const main = MAIN_PROGRAM_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (program): program is T => program != null,
  );
  const special = SPECIAL_PROGRAM_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (program): program is T => program != null,
  );

  return { main, special };
}

const PROGRAM_PRICE_LABELS: Record<string, string> = {
  angamardana: "300€",
  "bhastrika-kriya": "55€",
  "bhuta-shuddhi": "175€",
  "childrens-program": "150€",
  "eye-care-practices": "55€",
  "jala-neti": "55€",
  pavanamuktasana: "55€",
  "shanmukhi-mudra": "55€",
  "surya-kriya": "150€",
  "surya-shakti": "95€",
  thoppukarnam: "55€",
  "upa-yoga": "150€",
  yogasanas: "220€",
};

export function getProgramPriceLabel(slug: string, priceLabel?: string | null): string {
  if (priceLabel?.trim()) return priceLabel.trim();
  return PROGRAM_PRICE_LABELS[slug] ?? PROGRAM_DEFAULT_PRICE_LABEL;
}

export function programWhatIsSectionTitle(title: string): string {
  if (title.endsWith("Practices")) {
    return `What are ${title}?`;
  }
  return `What is ${title}?`;
}
