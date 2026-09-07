/**
 * Phase 1 SEO semantic targets and natural-language fallbacks,
 * plus the geographic / program-keyword expansion.
 *
 * CMS `seo` fields should match these; code uses them only when CMS is empty.
 * These are resilience fallbacks, not the normal production source.
 * Albania remains the primary geographic target. City names are supporting
 * context only — they do not replace page ownership or create new URLs.
 */
export const PHASE1_HOME_SEO = {
  title: "Classical Hatha Yoga in Albania",
  description:
    "Authentic Classical Hatha Yoga in Albania — traditional Hatha yoga and yoga classes in Tirana and Saranda. Yoga studio in Albania.",
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
    "Yoga retreat Albania — Hatha yoga retreat and yoga retreat Tirana, based in Tirana and Saranda. Upcoming weekend yoga retreat Albania, wellness retreat Albania, meditation retreat Albania, yoga and nature retreat, and yoga retreat Balkans. Upon request in Vlora, Gjirokaster, Korca, and Corfu.",
  heroTitle: "Retreat details",
  heroDescription:
    "Upcoming Hatha yoga retreats in Albania — yoga and nature retreats devoted to traditional practice, quiet settings, and inner transformation.",
  comingSoonHeading: "Retreats in preparation",
  comingSoonBody:
    "Check Upcoming Events to see if a retreat is scheduled, or register your interest for a potential retreat in a location of your choice.",
} as const;

export const PHASE1_ABOUT_SEO = {
  title: "Classical Hatha Yoga Teacher in Albania",
  description:
    "Meet the Classical Hatha Yoga teacher behind Nava Hatha Yoga in Albania — certified training, traditional Hatha yoga taught as intended, based in Tirana and Saranda.",
  heroDescription:
    "Know more about the teacher behind Nava Hatha Yoga in Albania — certified Classical Hatha Yoga training, practices taught as intended.",
} as const;

export const PHASE1_CONTACT_SEO = {
  title: "Register for Classical Hatha Yoga in Albania",
  description:
    "Yoga classes and lessons in Tirana and Saranda, Albania — Classical Hatha Yoga, beginner yoga, yoga studio Tirana. Upon request in Vlora, Gjirokaster, Korca, and Corfu.",
  heroDescription:
    "For questions regarding upcoming programs, private instruction, or teaching locations, please leave a message below.",
} as const;

export const PHASE1_EVENTS_SEO = {
  title: "Classical Hatha Yoga Events in Albania",
  description:
    "Upcoming yoga classes, workshops, and gatherings in Tirana and Saranda, Albania.",
  heroDescription:
    "Upcoming in-person Classical Hatha Yoga sessions. Explore the sessions below and discover a practice that can bring greater clarity, vitality, and steadiness into everyday life.",
} as const;

export type Phase1ProgramSeo = {
  title: string;
  description: string;
  /** One natural geo/context line under the existing shortIntro — does not replace practice copy. */
  contextLine: string;
  related: ReadonlyArray<{ href: string; label: string }>;
};

/**
 * Program SEO fallbacks. Albania is the primary geographic target on every
 * program URL. Tirana and Saranda appear as supporting teaching context.
 */
export const PHASE1_PROGRAM_SEO: Record<string, Phase1ProgramSeo> = {
  "surya-kriya": {
    title: "Learn Surya Kriya in Albania",
    description:
      "Learn Surya Kriya in Albania — a traditional inner energy process for balance and inner stability, taught as intended, with teaching based in Tirana and Saranda.",
    contextLine:
      "Surya Kriya is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda, and taught in its traditional form.",
    related: [
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
      { href: "/programs/yogasanas", label: "Yogasanas" },
    ],
  },
  angamardana: {
    title: "Learn Angamardana in Albania",
    description:
      "Learn Angamardana in Albania — a classical yogic system for mastery over the body, taught as intended, with teaching based in Tirana and Saranda.",
    contextLine:
      "Angamardana is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda, and taught in its traditional form.",
    related: [
      { href: "/programs/yogasanas", label: "Yogasanas" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
  yogasanas: {
    title: "Classical Yogasanas in Albania",
    description:
      "Practice classical Yogasanas in Albania — traditional Hatha Yoga postures taught as intended, with teaching based in Tirana and Saranda.",
    contextLine:
      "Yogasanas are offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda, and taught in their traditional form.",
    related: [
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
      { href: "/programs/angamardana", label: "Angamardana" },
    ],
  },
  "upa-yoga": {
    title: "Learn Upa Yoga in Albania",
    description:
      "Learn Upa Yoga in Albania — a simple, powerful Classical Hatha practice taught as intended, with beginner yoga in Tirana and Saranda.",
    contextLine:
      "Upa Yoga is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda, and taught in its traditional form — a natural starting point for many practitioners.",
    related: [
      { href: "/programs/surya-kriya", label: "Surya Kriya" },
      { href: "/programs/yogasanas", label: "Yogasanas" },
    ],
  },
  "bhuta-shuddhi": {
    title: "Bhuta Shuddhi in Albania",
    description:
      "Bhuta Shuddhi in Albania — a classical process of elemental purification, taught as intended, with teaching based in Tirana and Saranda.",
    contextLine:
      "Bhuta Shuddhi is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda, and taught in its traditional form.",
    related: [
      { href: "/programs/yogasanas", label: "Yogasanas" },
      { href: "/about", label: "About the teacher" },
    ],
  },
  "surya-shakti": {
    title: "Learn Surya Shakti in Albania",
    description:
      "Learn Surya Shakti in Albania — a classical dynamic sun practice taught in its traditional form, with teaching based in Tirana and Saranda.",
    contextLine:
      "Surya Shakti is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda, and taught in its traditional form.",
    related: [
      { href: "/programs/surya-kriya", label: "Surya Kriya" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
  "childrens-program": {
    title: "Children's Program in Albania",
    description:
      "A Classical Hatha Yoga program for children in Albania, taught as intended, with teaching based in Tirana and Saranda.",
    contextLine:
      "The Children's Program is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda.",
    related: [
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
      { href: "/programs", label: "All programs" },
    ],
  },
  "bhastrika-kriya": {
    title: "Bhastrika Kriya in Albania",
    description:
      "Learn Bhastrika Kriya in Albania — a classical yogic breathing process taught in its traditional form, with teaching based in Tirana and Saranda.",
    contextLine:
      "Bhastrika Kriya is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda.",
    related: [
      { href: "/programs/jala-neti", label: "Jala Neti" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
  "jala-neti": {
    title: "Jala Neti in Albania",
    description:
      "Learn Jala Neti in Albania — a classical nasal cleansing practice taught in its traditional form, with teaching based in Tirana and Saranda.",
    contextLine:
      "Jala Neti is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda.",
    related: [
      { href: "/programs/bhastrika-kriya", label: "Bhastrika Kriya" },
      { href: "/programs/surya-kriya", label: "Surya Kriya" },
    ],
  },
  thoppukarnam: {
    title: "Thoppukarnam in Albania",
    description:
      "Learn Thoppukarnam in Albania — a classical practice for neurological vitality, taught in its traditional form, with teaching based in Tirana and Saranda.",
    contextLine:
      "Thoppukarnam is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda.",
    related: [
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
      { href: "/programs/childrens-program", label: "Children's Program" },
    ],
  },
  "shanmukhi-mudra": {
    title: "Shanmukhi Mudra in Albania",
    description:
      "Learn Shanmukhi Mudra in Albania — a classical practice of sense withdrawal, taught in its traditional form, with teaching based in Tirana and Saranda.",
    contextLine:
      "Shanmukhi Mudra is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda.",
    related: [
      { href: "/programs/eye-care-practices", label: "Eye Care Practices" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
  "eye-care-practices": {
    title: "Eye Care Practices in Albania",
    description:
      "Yogic eye care practices in Albania — simple Classical Hatha practices for the eyes, taught as intended, with teaching based in Tirana and Saranda.",
    contextLine:
      "Eye Care Practices are offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda.",
    related: [
      { href: "/programs/shanmukhi-mudra", label: "Shanmukhi Mudra" },
      { href: "/programs/yogasanas", label: "Yogasanas" },
    ],
  },
  pavanamuktasana: {
    title: "Pavanamuktasana in Albania",
    description:
      "Learn Pavanamuktasana in Albania — a classical yogic posture taught in its traditional form, with teaching based in Tirana and Saranda.",
    contextLine:
      "Pavanamuktasana is offered in Albania through Nava Hatha Yoga, with teaching based in Tirana and Saranda.",
    related: [
      { href: "/programs/yogasanas", label: "Yogasanas" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
};
