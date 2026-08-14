import { getCliClient } from "sanity/cli";

/**
 * Phase 1 SEO: set titles, meta descriptions, and light hero copy
 * on the nine priority pages. Does not rewrite practice body content.
 *
 * Usage:
 *   npx sanity exec scripts/patch-seo-phase1.mjs --with-user-token
 */

const client = getCliClient({ apiVersion: "2024-10-01" });

const HOME = {
  title: "Classical Hatha Yoga in Albania",
  description:
    "Authentic Classical Hatha Yoga in Albania — traditional practices taught as intended in Saranda & Tirana, for clarity, balance, and inner transformation.",
};

const PROGRAMS_PAGE = {
  seoTitle: "Classical Hatha Yoga Programs in Albania",
  seoDescription:
    "Explore Classical Hatha Yoga programs in Albania — traditional practices taught as intended, from Upa Yoga and Surya Kriya to Yogasanas, Angamardana, and Bhuta Shuddhi.",
  heroTitle: "Classical Hatha Yoga programs",
  heroDescription:
    "Core programs form the foundation of Classical Hatha Yoga in Albania, taught in their traditional form. Special programs address specific needs, and free offerings offer a gentle way to begin.",
};

const RETREATS = {
  seoTitle: "Classical Hatha Yoga Retreats in Albania",
  seoDescription:
    "Discover upcoming Classical Hatha Yoga retreats in Albania, created for immersive traditional practice and inner transformation. Register your interest for future retreats.",
  heroTitle: "Classical Hatha Yoga retreats",
  heroDescription:
    "Upcoming immersive Classical Hatha Yoga retreats in Albania — devoted to traditional practice, quiet settings, and inner transformation. Dates will be announced; register your interest to be notified.",
  comingSoonHeading: "Retreats are on their way",
  comingSoonBody:
    "We are carefully preparing upcoming Classical Hatha Yoga retreats in Albania. No retreat is open for booking yet — if you would like to hear when dates are announced, please register your interest.",
};

const ABOUT = {
  seoTitle: "Classical Hatha Yoga Teacher in Albania",
  seoDescription:
    "Meet the Classical Hatha Yoga teacher behind Nava Hatha Yoga in Albania — certified training, traditional practices taught as intended, based in Saranda & Tirana.",
  heroDescription:
    "Know more about the teacher behind Nava Hatha Yoga in Albania — certified Classical Hatha Yoga training, practices taught as intended, based in Saranda & Tirana.",
};

const PROGRAMS = [
  {
    slug: "surya-kriya",
    title: "Learn Surya Kriya in Albania",
    description:
      "Learn Surya Kriya in Albania — a classical inner energy process taught in its traditional form, for balance, clarity, and inner stability.",
  },
  {
    slug: "angamardana",
    title: "Learn Angamardana in Albania",
    description:
      "Learn Angamardana in Albania — a classical yogic system for mastery over the body, taught in its traditional form to build strength, vitality, and readiness for Hatha Yoga.",
  },
  {
    slug: "yogasanas",
    title: "Classical Yogasanas in Albania",
    description:
      "Practice classical Yogasanas in Albania — traditional Hatha Yoga postures taught as intended, to transform body and mind toward lasting wellbeing.",
  },
  {
    slug: "upa-yoga",
    title: "Learn Upa Yoga in Albania",
    description:
      "Learn Upa Yoga in Albania — a simple, powerful Classical Hatha practice that activates the joints, muscles, and energy system, taught in its traditional form.",
  },
  {
    slug: "bhuta-shuddhi",
    title: "Bhuta Shuddhi in Albania",
    description:
      "Bhuta Shuddhi in Albania — a classical process of elemental purification, taught in its traditional form to support deep inner cleansing and transformation.",
  },
];

console.log("Patching Phase 1 SEO…");

await client
  .patch("homePage")
  .set({
    "seo.title": HOME.title,
    "seo.description": HOME.description,
    "featuredProgramsSection.description":
      "Each program is a complete practice within the Classical Hatha Yoga system, taught as intended. Explore a practice and register your interest for upcoming sessions.",
  })
  .commit();
console.log("✓ homePage");

const programsPageExists = await client.fetch(
  `count(*[_id == "programsPage"])`,
);
if (programsPageExists) {
  await client
    .patch("programsPage")
    .set({
      "seo.title": PROGRAMS_PAGE.seoTitle,
      "seo.description": PROGRAMS_PAGE.seoDescription,
      heroTitle: PROGRAMS_PAGE.heroTitle,
      heroDescription: PROGRAMS_PAGE.heroDescription,
    })
    .commit();
} else {
  await client.createOrReplace({
    _id: "programsPage",
    _type: "programsPage",
    heroEyebrow: "Programs & Offerings",
    heroTitle: PROGRAMS_PAGE.heroTitle,
    heroDescription: PROGRAMS_PAGE.heroDescription,
    seo: {
      title: PROGRAMS_PAGE.seoTitle,
      description: PROGRAMS_PAGE.seoDescription,
    },
  });
  console.log("  (created programsPage document)");
}
console.log("✓ programsPage");

await client
  .patch("retreatsPage")
  .set({
    "seo.title": RETREATS.seoTitle,
    "seo.description": RETREATS.seoDescription,
    heroTitle: RETREATS.heroTitle,
    heroDescription: RETREATS.heroDescription,
    comingSoonHeading: RETREATS.comingSoonHeading,
    comingSoonBody: RETREATS.comingSoonBody,
  })
  .commit();
console.log("✓ retreatsPage");

await client
  .patch("aboutPage")
  .set({
    "seo.title": ABOUT.seoTitle,
    "seo.description": ABOUT.seoDescription,
    heroDescription: ABOUT.heroDescription,
  })
  .commit();
console.log("✓ aboutPage");

for (const program of PROGRAMS) {
  const doc = await client.fetch(
    `*[_type == "program" && slug.current == $slug][0]{ _id, title }`,
    { slug: program.slug },
  );
  if (!doc?._id) {
    console.warn(`⚠ program not found: ${program.slug}`);
    continue;
  }
  await client
    .patch(doc._id)
    .set({
      "seo.title": program.title,
      "seo.description": program.description,
    })
    .commit();
  console.log(`✓ program ${program.slug} (${doc.title})`);
}

console.log("Phase 1 SEO patch complete.");
