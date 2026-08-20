import { getCliClient } from "sanity/cli";

/**
 * Report CMS vs expected website copy / order mismatches.
 *
 * Usage:
 *   npx sanity exec scripts/audit-cms-1to1.mjs --with-user-token
 */

const client = getCliClient({ apiVersion: "2024-10-01" });

const STUDIO_ORDER = [
  "surya-kriya",
  "angamardana",
  "yogasanas",
  "upa-yoga",
  "bhuta-shuddhi",
  "surya-shakti",
  "childrens-program",
  "bhastrika-kriya",
  "jala-neti",
  "thoppukarnam",
  "shanmukhi-mudra",
  "eye-care-practices",
  "pavanamuktasana",
];

const EXPECTED = {
  aboutPage: {
    heroDescription:
      "Know more about the teacher behind Nava Hatha Yoga in Albania — certified Classical Hatha Yoga training, practices taught as intended.",
  },
  contactPage: {
    heroDescription:
      "For questions regarding upcoming programs, private instruction, or teaching locations, please leave a message below.",
  },
  eventsPage: {
    heroDescription:
      "Upcoming in-person Classical Hatha Yoga sessions. Explore the sessions below and discover a practice that can bring greater clarity, vitality, and steadiness into everyday life.",
  },
  retreatsPage: {
    heroDescription:
      "Upcoming immersive Classical Hatha Yoga retreats in Albania — devoted to traditional practice, quiet settings, and inner transformation.",
  },
};

function empty(value) {
  if (value == null) return true;
  if (typeof value === "string") return !value.trim();
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

const programs = await client.fetch(
  `*[_type == "program" && !(_id in path("drafts.**"))]{
    _id, title, published, category, orderRank, "slug": slug.current,
    shortIntro, intensity, "hasSeoTitle": defined(seo.title), "hasSeoDesc": defined(seo.description)
  } | order(orderRank asc, title asc)`,
);

const pages = await client.fetch(`{
  "home": *[_id == "homePage"][0]{
    hero{headline, subtitle, supportingText, primaryCta, secondaryCta},
    highlights,
    intro{eyebrow, heading, videoTitle},
    featuredProgramsSection,
    "featuredSlugs": featuredPrograms[]->slug.current,
    upcomingEventsSection,
    privateCorporate{heading, lead, "offeringTitles": offerings[]{title}},
    finalCta{heading, body, cta},
    seo
  },
  "about": *[_id == "aboutPage"][0]{title, heroEyebrow, heroDescription, teacherSectionTitle, "highlights": highlightCards[]{title}, seo},
  "contact": *[_id == "contactPage"][0]{heroEyebrow, heroTitle, heroDescription, formHeading, teachingLocations, seo},
  "events": *[_id == "eventsPage"][0]{heroEyebrow, heroTitle, heroDescription, emptyTitle, emptyDescription, contactHeading, contactDescription, archiveEyebrow, archiveTitle, seo},
  "retreats": *[_id == "retreatsPage"][0]{heroEyebrow, heroTitle, heroDescription, comingSoonHeading, comingSoonBody, expectationsHeading, partnerPrograms{heading}, seo},
  "programsPage": *[_id == "programsPage"][0]{heroEyebrow, heroTitle, heroDescription, mainProgramsHeading, specialProgramsHeading, specialProgramsLead, freeOfferings, seo},
  "register": *[_id == "registerPage"][0]{heroEyebrow, heroTitle, heroDescription},
  "settings": *[_id == "siteSettings"][0]{brandName, tagline, description, email, whatsapp, location, bonusTitle, medicalNoticeTitle, eventExperienceNote, seo}
}`);

const events = await client.fetch(
  `*[_type == "event" && !(_id in path("drafts.**"))]{
    _id, title, published, date, location, "slug": slug.current, "sessionCount": count(sessions)
  } | order(date asc)`,
);

const drafts = await client.fetch(
  `*[_id in path("drafts.**") && _type in ["homePage","aboutPage","contactPage","eventsPage","retreatsPage","programsPage","registerPage","event","program"]]{
    _id, _type, title
  }`,
);

console.log("=== PROGRAM ORDER ===");
const liveOrder = programs.map((p) => p.slug);
console.log("CMS orderRank:", liveOrder.join(" → "));
console.log("Studio sidebar:", STUDIO_ORDER.join(" → "));
const orderMismatch = liveOrder.filter(Boolean).join(",") !== STUDIO_ORDER.join(",");
if (orderMismatch) {
  console.log("MISMATCH: Studio sidebar order != CMS orderRank /programs order");
  for (let i = 0; i < Math.max(liveOrder.length, STUDIO_ORDER.length); i++) {
    if (liveOrder[i] !== STUDIO_ORDER[i]) {
      console.log(`  ${i + 1}. CMS=${liveOrder[i] ?? "—"} studio=${STUDIO_ORDER[i] ?? "—"}`);
    }
  }
} else {
  console.log("OK: program order matches");
}

console.log("\n=== PROGRAMS (empty / unpublished) ===");
for (const p of programs) {
  const issues = [];
  if (!p.published) issues.push("unpublished");
  if (empty(p.shortIntro)) issues.push("empty shortIntro");
  if (empty(p.category)) issues.push("empty category");
  if (p.orderRank == null) issues.push("no orderRank");
  if (!p.hasSeoTitle) issues.push("no seo.title");
  if (!p.hasSeoDesc) issues.push("no seo.description");
  if (issues.length) console.log(`${p.title} (${p.slug}): ${issues.join(", ")}`);
}
if (!programs.some((p) => !p.published || empty(p.shortIntro) || empty(p.category) || p.orderRank == null)) {
  console.log("OK: published programs have category, orderRank, shortIntro");
}

console.log("\n=== PAGE INTROS ===");
for (const [type, fields] of Object.entries(EXPECTED)) {
  const key = type.replace("Page", "");
  const doc =
    pages[key] ||
    pages[type] ||
    (type === "programsPage" ? pages.programsPage : null);
  for (const [field, expected] of Object.entries(fields)) {
    const actual = doc?.[field];
    if (actual !== expected) {
      console.log(`MISMATCH ${type}.${field}`);
      console.log(`  CMS: ${JSON.stringify(actual)}`);
      console.log(`  expected: ${JSON.stringify(expected)}`);
    } else {
      console.log(`OK ${type}.${field}`);
    }
  }
}

console.log("\n=== EMPTY PAGE FIELDS (would use code fallbacks) ===");
function reportEmpty(label, obj, paths) {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, part) => acc?.[part], obj);
    if (empty(value)) console.log(`EMPTY ${label}.${path}`);
  }
}
reportEmpty("home", pages.home, [
  "hero.headline",
  "hero.supportingText",
  "hero.primaryCta.label",
  "hero.secondaryCta.label",
  "intro.heading",
  "featuredProgramsSection.title",
  "upcomingEventsSection.title",
  "upcomingEventsSection.description",
  "privateCorporate.heading",
  "privateCorporate.lead",
  "finalCta.heading",
  "seo.title",
  "seo.description",
]);
reportEmpty("about", pages.about, ["title", "heroDescription", "teacherSectionTitle", "seo.title", "seo.description"]);
reportEmpty("contact", pages.contact, ["heroTitle", "heroDescription", "formHeading", "teachingLocations.mainLocations", "seo.title"]);
reportEmpty("events", pages.events, ["heroTitle", "heroDescription", "seo.title"]);
reportEmpty("retreats", pages.retreats, ["heroTitle", "heroDescription", "comingSoonHeading", "seo.title"]);
reportEmpty("programsPage", pages.programsPage, ["heroTitle", "heroDescription", "mainProgramsHeading", "specialProgramsHeading", "seo.title"]);
reportEmpty("register", pages.register, ["heroTitle", "heroDescription"]);
reportEmpty("settings", pages.settings, ["brandName", "description", "email"]);

console.log("\n=== HOME FEATURED PROGRAMS ===");
console.log("CMS featured slugs:", (pages.home?.featuredSlugs ?? []).join(" → ") || "(none — site uses first main programs by orderRank)");

console.log("\n=== EVENTS ===");
for (const event of events) {
  const issues = [];
  if (!event.slug) issues.push("NO SLUG");
  if (!event.published) issues.push("unpublished");
  if (issues.length) console.log(`${event.title} ${event.date}: ${issues.join(", ")}`);
}
const missingSlug = events.filter((e) => !e.slug);
if (!missingSlug.length) console.log(`OK: ${events.length} events have Page URL slugs`);

console.log("\n=== DRAFTS ===");
if (!drafts.length) console.log("OK: no unpublished drafts for page/event/program types");
else drafts.forEach((d) => console.log(`${d._type} ${d._id} ${d.title ?? ""}`));

console.log("\n=== HOME EVENTS DESCRIPTION ===");
console.log(JSON.stringify(pages.home?.upcomingEventsSection?.description));
console.log("\n=== SEO DESCRIPTIONS ===");
for (const [name, doc] of Object.entries({
  home: pages.home,
  about: pages.about,
  contact: pages.contact,
  events: pages.events,
  retreats: pages.retreats,
  programs: pages.programsPage,
})) {
  console.log(`${name}: title=${JSON.stringify(doc?.seo?.title)}`);
  console.log(`       desc=${JSON.stringify(doc?.seo?.description)}`);
}
