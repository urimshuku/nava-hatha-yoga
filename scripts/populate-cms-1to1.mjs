import { getCliClient } from "sanity/cli";

/**
 * Fill empty CMS fields with the wording already shown on the live website.
 * Uses setIfMissing only — existing production values are never overwritten.
 *
 * Usage:
 *   npx sanity exec scripts/populate-cms-1to1.mjs --with-user-token
 */

const client = getCliClient({ apiVersion: "2024-10-01" });

function key(id) {
  return id;
}

const HOME_HIGHLIGHTS = {
  items: [
    {
      _key: key("highlight-ancient"),
      _type: "object",
      text: "Ancient yogic tools for modern life.",
    },
    {
      _key: key("highlight-balance"),
      _type: "object",
      text: "Practices for balance, clarity and well-being.",
    },
    {
      _key: key("highlight-lifetime"),
      _type: "object",
      text: "Learn once. Practise for a lifetime.",
      lines: ["Learn once.", "Practise for a lifetime."],
    },
  ],
  closingQuote: "“In balance. Life unfolds.”",
};

const PRIVATE_OFFERINGS = [
  {
    _key: key("offering-one-to-one"),
    _type: "object",
    title: "One-to-One Session",
    body: "Highly personalized instruction tailored to your specific physical capabilities and wellbeing goals. Ideal for those seeking deeper refinement or specific health support.",
  },
  {
    _key: key("offering-small-group"),
    _type: "object",
    title: "Small-Group/Family Session",
    body: "Gather friends, family, or colleagues for a private session. A focused environment that balances personalized attention with shared experience.",
  },
  {
    _key: key("offering-corporate"),
    _type: "object",
    title: "Corporate Session",
    body: "Bring ancient tools for clarity and balance into the workplace. Designed to combat stress and foster a vibrant, focused professional environment.",
  },
];

const FREE_OFFERINGS = {
  eyebrow: "Free offerings",
  lead: "Open resources to begin exploring Classical Hatha Yoga.",
  items: [
    {
      _key: key("free-learn"),
      _type: "object",
      title: "Learn About Classical Hatha Yoga",
      description:
        "Discover what Classical Hatha Yoga is, how it works with the body and energy system, and why it is offered in its traditional form.",
    },
    {
      _key: key("free-online"),
      _type: "object",
      title: "Online Resources",
      description:
        "Explore free resources to deepen your understanding of the practices and the wider Classical Hatha Yoga tradition.",
    },
  ],
};

const PARTNER_PROGRAMS = {
  heading: "Partner Programs",
  intro: [
    "NAVA collaborates with hotels, guesthouses, retreat venues and other welcoming spaces to enrich the experience of their guests through Classical Hatha Yoga.",
    "These programs offer people an opportunity to pause, reconnect and experience greater balance during their stay. They may include an introductory session, a workshop or a series of practices shaped around the place, its atmosphere and the needs of the guests.",
    "Each collaboration is created with care, supporting rest, renewal and a deeper connection with oneself and the surrounding environment.",
  ],
  collaborateHeading: "Two Ways to Collaborate",
  collaborateItems: [
    "Partners can introduce their guests to existing NAVA programs.",
    "Partners can host a specially arranged yoga experience at their own venue.",
  ],
  closing: [
    "Each collaboration is thoughtfully planned to suit the setting and enrich the guests' stay.",
    "Contact NAVA to explore which option would best suit your guests and your space.",
  ],
  whatsappPrefill:
    "Hello, I'd like to explore a Partner Program collaboration with NAVA.",
};

const LISTING_CTA = {
  heading: "Questions about a retreat?",
  body: "Reach out and we'll be glad to share more details and help you decide if it's right for you.",
  cta: { _type: "ctaLink", label: "Contact us", href: "/contact" },
};

const HIGHLIGHT_CARDS = [
  {
    _key: key("ribbon-training"),
    _type: "object",
    title: "1750+ hours of teacher training (Sadhguru Gurukulam India)",
  },
  {
    _key: key("ribbon-ashram"),
    _type: "object",
    title: "10 years of living/volunteering/teaching in the ashram",
  },
  {
    _key: key("ribbon-participants"),
    _type: "object",
    title: "6000+ participants supported",
  },
];

const PROGRAM_INTENSITY = {
  "surya-kriya": "Medium",
  yogasanas: "Medium",
  angamardana: "High",
  "surya-shakti": "Medium",
  "upa-yoga": "Low",
  "childrens-program": "Low",
};

const VIDEO_TITLES = {
  "surya-kriya": "Surya Kriya on YouTube",
  "surya-shakti": "Surya Shakti on YouTube",
  yogasanas: "Yogasanas on YouTube",
};

async function patchIfMissing(id, fields) {
  await client.patch(id).setIfMissing(fields).commit({ autoGenerateArrayKeys: false });
  console.log("patched", id, Object.keys(fields).join(", "));
}

const home = await client.fetch(`*[_id=="homePage"][0]{_id}`);
if (!home) throw new Error("homePage missing");

await patchIfMissing("homePage", {
  highlights: HOME_HIGHLIGHTS,
  "featuredProgramsSection.eyebrow": "Programs",
  "featuredProgramsSection.title":
    "Practices offered in their traditional form",
  "featuredProgramsSection.ctaLabel": "View all programs",
  "upcomingEventsSection.eyebrow": "Events",
  "upcomingEventsSection.title": "Upcoming events",
  "upcomingEventsSection.emptyTitle": "New events are being scheduled",
  "upcomingEventsSection.emptyDescription":
    "There are no events listed right now. Please check back soon or get in touch to register your interest.",
  "upcomingEventsSection.ctaLabel": "See all upcoming events",
  "privateCorporate.lead":
    "Private sessions are available upon request. Depending on the needs of the individual, group, or organization, selected Classical Hatha Yoga practices can be offered in a focused setting.",
  "privateCorporate.offerings": PRIVATE_OFFERINGS,
  "privateCorporate.cta": {
    _type: "ctaLink",
    label: "Request a private session",
    href: "/contact",
  },
});

await patchIfMissing("programsPage", {
  mainProgramsHeading: "Main programs",
  specialProgramsHeading: "Special programs",
  specialProgramsLead:
    "Practices that support specific aspects of health and wellbeing.",
  freeOfferings: FREE_OFFERINGS,
});

await patchIfMissing("contactPage", {
  heroEyebrow: "Contact",
  "teachingLocations.mainHeading": "Main teaching locations",
  "teachingLocations.mainLocations": "Tirana, Saranda.",
  "teachingLocations.otherHeading": "Other teaching locations upon request",
});

await patchIfMissing("aboutPage", {
  teacherSectionTitle: "About the Teacher",
  highlightCards: HIGHLIGHT_CARDS,
});

await patchIfMissing("registerPage", {
  heroEyebrow: "Registration",
  heroTitle: "Program registration",
  heroDescription:
    "Please complete the form below. Your information is confidential and is used only to prepare for your participation.",
});

await patchIfMissing("eventsPage", {
  archiveEyebrow: "Archive",
  archiveTitle: "Past events",
  archiveDescription: "A record of gatherings and sessions that have taken place.",
  archiveEmptyTitle: "No past events yet",
  archiveEmptyDescription: "Once events have taken place, they will appear here.",
});

await patchIfMissing("retreatsPage", {
  heroEyebrow: "Retreats & Partner Programs",
  comingSoonEyebrow: "Coming Soon",
  expectationsEyebrow: "What to expect",
  listingCta: LISTING_CTA,
  partnerPrograms: PARTNER_PROGRAMS,
  archiveEyebrow: "Archive",
  archiveTitle: "Past retreats",
  archiveDescription: "A record of immersive retreats that have taken place.",
  archiveEmptyTitle: "No past retreats yet",
  archiveEmptyDescription: "Once retreats have taken place, they will appear here.",
});

await patchIfMissing("siteSettings", {
  bonusTitle: "Bonus",
  bonusItems: ["One free review session."],
  discountNote: "For those in need, discount is possible!",
  medicalNoticeTitle: "Medical Notice!",
  eventExperienceNote: "No prior yoga experience required!",
  social: [
    {
      _key: key("social-instagram"),
      _type: "object",
      label: "Instagram",
      url: "https://www.instagram.com/navahathayoga/",
    },
  ],
  "seo.title": "Nava Hatha Yoga · Classical Hatha Yoga",
  "seo.description":
    "Nava Hatha Yoga offers Classical Hatha Yoga in Saranda & Tirana, Albania — practices taught in their traditional form to support clarity, balance, and inner stability. Classes are in-person.",
});

const programs = await client.fetch(
  `*[_type=="program"]{_id, "slug": slug.current, videoUrl, videoTitle, intensity, beforeProgramTitle}`,
);

for (const program of programs) {
  const fields = {};
  if (PROGRAM_INTENSITY[program.slug]) {
    fields.intensity = PROGRAM_INTENSITY[program.slug];
  }
  if (program.videoUrl && VIDEO_TITLES[program.slug]) {
    fields.videoTitle = VIDEO_TITLES[program.slug];
  }
  fields.beforeProgramTitle = "Before the Program";
  if (Object.keys(fields).length) {
    await patchIfMissing(program._id, fields);
  }
}

const legalPages = await client.fetch(
  `*[_type=="legalPage"]{_id, title}`,
);
const legalDescription =
  "Nava Hatha Yoga offers Classical Hatha Yoga in Saranda & Tirana, Albania — practices taught in their traditional form to support clarity, balance, and inner stability. Classes are in-person.";

for (const page of legalPages) {
  await patchIfMissing(page._id, {
    "seo.title": page.title,
    "seo.description": legalDescription,
  });
}

console.log("Done. Empty CMS fields filled with current website wording (setIfMissing only).");
