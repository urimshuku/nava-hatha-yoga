/**
 * Phase 1 SEO semantic targets and natural-language fallbacks,
 * plus the geographic / program-keyword expansion.
 *
 * CMS `seo` fields should match these; code uses them when CMS is empty.
 * Albania remains the primary geographic target. City names are supporting
 * context only — they do not replace page ownership or create new URLs.
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

export const PHASE1_CONTACT_SEO = {
  title: "Register for Classical Hatha Yoga in Albania",
  description:
    "Register or enquire about Classical Hatha Yoga in Albania. Teaching is based in Saranda and Tirana, with other locations available upon request. Classes are in-person.",
  heroDescription:
    "For questions regarding upcoming programs, private instruction, or teaching locations in Albania, please leave a message below.",
} as const;

export const PHASE1_EVENTS_SEO = {
  title: "Classical Hatha Yoga Events in Albania",
  description:
    "Upcoming Classical Hatha Yoga workshops, free sessions, and gatherings in Saranda and Tirana, Albania.",
  heroDescription:
    "Upcoming in-person Classical Hatha Yoga sessions in Saranda and Tirana, Albania. Explore the sessions below and discover a practice that can bring greater clarity, vitality, and steadiness into everyday life.",
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
 * program URL. Saranda and Tirana appear as supporting teaching context.
 */
export const PHASE1_PROGRAM_SEO: Record<string, Phase1ProgramSeo> = {
  "surya-kriya": {
    title: "Learn Surya Kriya in Albania",
    description:
      "Learn Surya Kriya in Albania — a traditional inner energy process for balance and inner stability, taught in Saranda, with sessions in Tirana when scheduled.",
    contextLine:
      "Surya Kriya is offered in Albania through Nava Hatha Yoga. Teaching is based in Saranda, with sessions also held in Tirana when scheduled.",
    related: [
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
      { href: "/programs/yogasanas", label: "Yogasanas" },
    ],
  },
  angamardana: {
    title: "Learn Angamardana in Albania",
    description:
      "Learn Angamardana in Albania — a classical yogic system for mastery over the body, taught as intended, with teaching based in Saranda and Tirana.",
    contextLine:
      "Angamardana is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana, and taught in its traditional form.",
    related: [
      { href: "/programs/yogasanas", label: "Yogasanas" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
  yogasanas: {
    title: "Classical Yogasanas in Albania",
    description:
      "Practice classical Yogasanas in Albania — traditional Hatha Yoga postures taught as intended, with teaching based in Saranda and Tirana.",
    contextLine:
      "Yogasanas are offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana, and taught in their traditional form.",
    related: [
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
      { href: "/programs/angamardana", label: "Angamardana" },
    ],
  },
  "upa-yoga": {
    title: "Learn Upa Yoga in Albania",
    description:
      "Learn Upa Yoga in Albania — a simple, powerful Classical Hatha practice taught as intended, with teaching based in Saranda and Tirana.",
    contextLine:
      "Upa Yoga is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana, and taught in its traditional form — a natural starting point for many practitioners.",
    related: [
      { href: "/programs/surya-kriya", label: "Surya Kriya" },
      { href: "/programs/yogasanas", label: "Yogasanas" },
    ],
  },
  "bhuta-shuddhi": {
    title: "Bhuta Shuddhi in Albania",
    description:
      "Bhuta Shuddhi in Albania — a classical process of elemental purification, taught as intended, with teaching based in Saranda and Tirana.",
    contextLine:
      "Bhuta Shuddhi is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana, and taught in its traditional form.",
    related: [
      { href: "/programs/yogasanas", label: "Yogasanas" },
      { href: "/about", label: "About the teacher" },
    ],
  },
  "surya-shakti": {
    title: "Learn Surya Shakti in Albania",
    description:
      "Learn Surya Shakti in Albania — a classical dynamic sun practice taught in its traditional form, with teaching based in Saranda and Tirana.",
    contextLine:
      "Surya Shakti is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana, and taught in its traditional form.",
    related: [
      { href: "/programs/surya-kriya", label: "Surya Kriya" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
  "childrens-program": {
    title: "Children's Program in Albania",
    description:
      "A Classical Hatha Yoga program for children in Albania, taught as intended, with teaching based in Saranda and Tirana.",
    contextLine:
      "The Children's Program is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    related: [
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
      { href: "/programs", label: "All programs" },
    ],
  },
  "bhastrika-kriya": {
    title: "Bhastrika Kriya in Albania",
    description:
      "Learn Bhastrika Kriya in Albania — a classical yogic breathing process taught in its traditional form, with teaching based in Saranda and Tirana.",
    contextLine:
      "Bhastrika Kriya is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    related: [
      { href: "/programs/jala-neti", label: "Jala Neti" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
  "jala-neti": {
    title: "Jala Neti in Albania",
    description:
      "Learn Jala Neti in Albania — a classical nasal cleansing practice taught in its traditional form, with teaching based in Saranda and Tirana.",
    contextLine:
      "Jala Neti is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    related: [
      { href: "/programs/bhastrika-kriya", label: "Bhastrika Kriya" },
      { href: "/programs/surya-kriya", label: "Surya Kriya" },
    ],
  },
  thoppukarnam: {
    title: "Thoppukarnam in Albania",
    description:
      "Learn Thoppukarnam in Albania — a classical practice for neurological vitality, taught in its traditional form, with teaching based in Saranda and Tirana.",
    contextLine:
      "Thoppukarnam is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    related: [
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
      { href: "/programs/childrens-program", label: "Children's Program" },
    ],
  },
  "shanmukhi-mudra": {
    title: "Shanmukhi Mudra in Albania",
    description:
      "Learn Shanmukhi Mudra in Albania — a classical practice of sense withdrawal, taught in its traditional form, with teaching based in Saranda and Tirana.",
    contextLine:
      "Shanmukhi Mudra is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    related: [
      { href: "/programs/eye-care-practices", label: "Eye Care Practices" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
  "eye-care-practices": {
    title: "Eye Care Practices in Albania",
    description:
      "Yogic eye care practices in Albania — simple Classical Hatha practices for the eyes, taught as intended, with teaching based in Saranda and Tirana.",
    contextLine:
      "Eye Care Practices are offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    related: [
      { href: "/programs/shanmukhi-mudra", label: "Shanmukhi Mudra" },
      { href: "/programs/yogasanas", label: "Yogasanas" },
    ],
  },
  pavanamuktasana: {
    title: "Pavanamuktasana in Albania",
    description:
      "Learn Pavanamuktasana in Albania — a classical yogic posture taught in its traditional form, with teaching based in Saranda and Tirana.",
    contextLine:
      "Pavanamuktasana is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    related: [
      { href: "/programs/yogasanas", label: "Yogasanas" },
      { href: "/programs/upa-yoga", label: "Upa Yoga" },
    ],
  },
};
