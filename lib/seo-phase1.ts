/**
 * Phase 1 SEO semantic targets and natural-language fallbacks.
 * CMS `seo` fields should match these; code uses them when CMS is empty.
 */
export const PHASE1_HOME_SEO = {
  title: "Classical Hatha Yoga in Albania",
  description:
    "Authentic Classical Hatha Yoga in Albania — traditional practices taught as intended in Saranda & Tirana, for clarity, balance, and inner transformation.",
} as const;

export const PHASE1_PROGRAMS_PAGE_SEO = {
  title: "Classical Hatha Yoga Programs in Albania",
  description:
    "Explore Classical Hatha Yoga programs in Albania — traditional practices taught as intended, from Upa Yoga and Surya Kriya to Yogasanas, Angamardana, and Bhuta Shuddhi.",
  heroTitle: "Classical Hatha Yoga programs",
  heroDescription:
    "Core programs form the foundation of Classical Hatha Yoga in Albania, taught in their traditional form. Special programs address specific needs, and free offerings offer a gentle way to begin.",
} as const;

export const PHASE1_RETREATS_SEO = {
  title: "Classical Hatha Yoga Retreats in Albania",
  description:
    "Discover upcoming Classical Hatha Yoga retreats in Albania, created for immersive traditional practice and inner transformation. Register your interest for future retreats.",
  heroTitle: "Classical Hatha Yoga retreats",
  heroDescription:
    "Upcoming immersive Classical Hatha Yoga retreats in Albania — devoted to traditional practice, quiet settings, and inner transformation. Dates will be announced; register your interest to be notified.",
  comingSoonHeading: "Retreats are on their way",
  comingSoonBody:
    "We are carefully preparing upcoming Classical Hatha Yoga retreats in Albania. No retreat is open for booking yet — if you would like to hear when dates are announced, please register your interest.",
} as const;

export const PHASE1_ABOUT_SEO = {
  title: "Classical Hatha Yoga Teacher in Albania",
  description:
    "Meet the Classical Hatha Yoga teacher behind Nava Hatha Yoga in Albania — certified training, traditional practices taught as intended, based in Saranda & Tirana.",
  heroDescription:
    "Know more about the teacher behind Nava Hatha Yoga in Albania — certified Classical Hatha Yoga training, practices taught as intended, based in Saranda & Tirana.",
} as const;

export type Phase1ProgramSeo = {
  title: string;
  description: string;
  /** One natural geo/context line under the existing shortIntro — does not replace practice copy. */
  contextLine: string;
  related: ReadonlyArray<{ href: string; label: string }>;
};

/** Core program Phase 1 SEO only (special programs untouched). */
export const PHASE1_PROGRAM_SEO: Record<string, Phase1ProgramSeo> = {
  "surya-kriya": {
    title: "Learn Surya Kriya in Albania",
    description:
      "Learn Surya Kriya in Albania — a classical inner energy process taught in its traditional form, for balance, clarity, and inner stability.",
    contextLine:
      "Surya Kriya is offered in Albania through Nava Hatha Yoga, based in Saranda & Tirana, and taught in its traditional form.",
    related: [
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
      { href: "/programs/yogasanas", label: "Yogasanas" },
    ],
  },
  angamardana: {
    title: "Learn Angamardana in Albania",
    description:
      "Learn Angamardana in Albania — a classical yogic system for mastery over the body, taught in its traditional form to build strength, vitality, and readiness for Hatha Yoga.",
    contextLine:
      "Angamardana is offered in Albania through Nava Hatha Yoga, based in Saranda & Tirana, and taught in its traditional form.",
    related: [
      { href: "/programs/yogasanas", label: "Yogasanas" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
  yogasanas: {
    title: "Classical Yogasanas in Albania",
    description:
      "Practice classical Yogasanas in Albania — traditional Hatha Yoga postures taught as intended, to transform body and mind toward lasting wellbeing.",
    contextLine:
      "Yogasanas are offered in Albania through Nava Hatha Yoga, based in Saranda & Tirana, and taught in their traditional form.",
    related: [
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
      { href: "/programs/angamardana", label: "Angamardana" },
    ],
  },
  "upa-yoga": {
    title: "Learn Upa Yoga in Albania",
    description:
      "Learn Upa Yoga in Albania — a simple, powerful Classical Hatha practice that activates the joints, muscles, and energy system, taught in its traditional form.",
    contextLine:
      "Upa Yoga is offered in Albania through Nava Hatha Yoga, based in Saranda & Tirana, and taught in its traditional form — a natural starting point for many practitioners.",
    related: [
      { href: "/programs/surya-kriya", label: "Surya Kriya" },
      { href: "/programs/yogasanas", label: "Yogasanas" },
    ],
  },
  "bhuta-shuddhi": {
    title: "Bhuta Shuddhi in Albania",
    description:
      "Bhuta Shuddhi in Albania — a classical process of elemental purification, taught in its traditional form to support deep inner cleansing and transformation.",
    contextLine:
      "Bhuta Shuddhi is offered in Albania through Nava Hatha Yoga, based in Saranda & Tirana, and taught in its traditional form.",
    related: [
      { href: "/programs/yogasanas", label: "Yogasanas" },
      { href: "/about", label: "About the teacher" },
    ],
  },
};
