import { getCliClient } from "sanity/cli";

/**
 * Geographic + program keyword expansion.
 * Updates existing Sanity documents only — does not create location pages.
 *
 * Usage:
 *   npx sanity exec scripts/patch-seo-geo-expansion.mjs --with-user-token
 */

const client = getCliClient({ apiVersion: "2024-10-01" });

function key(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function span(text, marks = []) {
  return { _type: "span", _key: key("s"), text, marks };
}

function linkDef(href) {
  return { _type: "link", _key: key("l"), href };
}

function related(items) {
  return items.map((item, index) => ({
    _type: "ctaLink",
    _key: `rel-${index}-${item.href.replace(/[^a-z0-9]+/g, "-")}`,
    label: item.label,
    href: item.href,
  }));
}

function blockText(block) {
  return (block?.children ?? []).map((child) => child.text ?? "").join("");
}

function buildHomeGeoBlock() {
  const upa = linkDef("/programs/upa-yoga");
  const surya = linkDef("/programs/surya-kriya");
  const yogasanas = linkDef("/programs/yogasanas");
  const anga = linkDef("/programs/angamardana");
  const bhuta = linkDef("/programs/bhuta-shuddhi");
  const about = linkDef("/about");
  const contact = linkDef("/contact");

  return {
    _type: "block",
    _key: key("b"),
    style: "normal",
    markDefs: [upa, surya, yogasanas, anga, bhuta, about, contact],
    children: [
      span(
        "These practices are offered in Albania, based in Saranda and Tirana, and taught in their traditional form. Begin with ",
      ),
      span("Upa Yoga", [upa._key]),
      span(", explore "),
      span("Surya Kriya", [surya._key]),
      span(", "),
      span("Yogasanas", [yogasanas._key]),
      span(", "),
      span("Angamardana", [anga._key]),
      span(", or "),
      span("Bhuta Shuddhi", [bhuta._key]),
      span(" — or "),
      span("meet the teacher", [about._key]),
      span(". Other teaching locations may be arranged "),
      span("upon request", [contact._key]),
      span("."),
    ],
  };
}

function replaceOrAppendGeoParagraph(introBody) {
  const geo = buildHomeGeoBlock();
  const next = [...(introBody ?? [])];
  const idx = next.findIndex((block) =>
    /offered in Albania|based in Saranda/i.test(blockText(block)),
  );
  if (idx >= 0) next[idx] = geo;
  else next.push(geo);
  return next;
}

async function patchSingleton(id, type, data) {
  const existingId =
    (await client.fetch(`*[_id == $id][0]._id`, { id })) ||
    (await client.fetch(
      `*[_type == $type && !(_id in path("drafts.**"))][0]._id`,
      { type },
    ));
  if (!existingId) {
    console.warn(`⚠ ${type} not found; skipped`);
    return null;
  }
  await client.patch(existingId).set(data).commit();
  console.log(`✓ ${type}`);
  return existingId;
}

const PROGRAMS = [
  {
    slug: "surya-kriya",
    contextLine:
      "Surya Kriya is offered in Albania through Nava Hatha Yoga. Teaching is based in Saranda, with sessions also held in Tirana when scheduled.",
    relatedPrograms: related([
      { label: "Upa Yoga", href: "/programs/upa-yoga" },
      { label: "Yogasanas", href: "/programs/yogasanas" },
    ]),
    seo: {
      title: "Learn Surya Kriya in Albania",
      description:
        "Learn Surya Kriya in Albania — a traditional inner energy process for balance and inner stability, taught in Saranda, with sessions in Tirana when scheduled.",
    },
  },
  {
    slug: "angamardana",
    contextLine:
      "Angamardana is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana, and taught in its traditional form.",
    relatedPrograms: related([
      { label: "Yogasanas", href: "/programs/yogasanas" },
      { label: "Upa Yoga", href: "/programs/upa-yoga" },
    ]),
    seo: {
      title: "Learn Angamardana in Albania",
      description:
        "Learn Angamardana in Albania — a classical yogic system for mastery over the body, taught as intended, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "yogasanas",
    contextLine:
      "Yogasanas are offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana, and taught in their traditional form.",
    relatedPrograms: related([
      { label: "Upa Yoga", href: "/programs/upa-yoga" },
      { label: "Angamardana", href: "/programs/angamardana" },
    ]),
    seo: {
      title: "Classical Yogasanas in Albania",
      description:
        "Practice classical Yogasanas in Albania — traditional Hatha Yoga postures taught as intended, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "upa-yoga",
    contextLine:
      "Upa Yoga is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana, and taught in its traditional form — a natural starting point for many practitioners.",
    relatedPrograms: related([
      { label: "Surya Kriya", href: "/programs/surya-kriya" },
      { label: "Yogasanas", href: "/programs/yogasanas" },
    ]),
    seo: {
      title: "Learn Upa Yoga in Albania",
      description:
        "Learn Upa Yoga in Albania — a simple, powerful Classical Hatha practice taught as intended, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "bhuta-shuddhi",
    contextLine:
      "Bhuta Shuddhi is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana, and taught in its traditional form.",
    relatedPrograms: related([
      { label: "Yogasanas", href: "/programs/yogasanas" },
      { label: "About the teacher", href: "/about" },
    ]),
    seo: {
      title: "Bhuta Shuddhi in Albania",
      description:
        "Bhuta Shuddhi in Albania — a classical process of elemental purification, taught as intended, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "surya-shakti",
    contextLine:
      "Surya Shakti is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana, and taught in its traditional form.",
    relatedPrograms: related([
      { label: "Surya Kriya", href: "/programs/surya-kriya" },
      { label: "Upa Yoga", href: "/programs/upa-yoga" },
    ]),
    seo: {
      title: "Learn Surya Shakti in Albania",
      description:
        "Learn Surya Shakti in Albania — a classical dynamic sun practice taught in its traditional form, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "childrens-program",
    contextLine:
      "The Children's Program is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    relatedPrograms: related([
      { label: "Upa Yoga", href: "/programs/upa-yoga" },
      { label: "All programs", href: "/programs" },
    ]),
    seo: {
      title: "Children's Program in Albania",
      description:
        "A Classical Hatha Yoga program for children in Albania, taught as intended, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "bhastrika-kriya",
    contextLine:
      "Bhastrika Kriya is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    relatedPrograms: related([
      { label: "Jala Neti", href: "/programs/jala-neti" },
      { label: "Upa Yoga", href: "/programs/upa-yoga" },
    ]),
    seo: {
      title: "Bhastrika Kriya in Albania",
      description:
        "Learn Bhastrika Kriya in Albania — a classical yogic breathing process taught in its traditional form, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "jala-neti",
    contextLine:
      "Jala Neti is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    relatedPrograms: related([
      { label: "Bhastrika Kriya", href: "/programs/bhastrika-kriya" },
      { label: "Surya Kriya", href: "/programs/surya-kriya" },
    ]),
    seo: {
      title: "Jala Neti in Albania",
      description:
        "Learn Jala Neti in Albania — a classical nasal cleansing practice taught in its traditional form, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "thoppukarnam",
    contextLine:
      "Thoppukarnam is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    relatedPrograms: related([
      { label: "Upa Yoga", href: "/programs/upa-yoga" },
      { label: "Children's Program", href: "/programs/childrens-program" },
    ]),
    seo: {
      title: "Thoppukarnam in Albania",
      description:
        "Learn Thoppukarnam in Albania — a classical practice for neurological vitality, taught in its traditional form, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "shanmukhi-mudra",
    contextLine:
      "Shanmukhi Mudra is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    relatedPrograms: related([
      { label: "Eye Care Practices", href: "/programs/eye-care-practices" },
      { label: "Upa Yoga", href: "/programs/upa-yoga" },
    ]),
    seo: {
      title: "Shanmukhi Mudra in Albania",
      description:
        "Learn Shanmukhi Mudra in Albania — a classical practice of sense withdrawal, taught in its traditional form, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "eye-care-practices",
    contextLine:
      "Eye Care Practices are offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    relatedPrograms: related([
      { label: "Shanmukhi Mudra", href: "/programs/shanmukhi-mudra" },
      { label: "Yogasanas", href: "/programs/yogasanas" },
    ]),
    seo: {
      title: "Eye Care Practices in Albania",
      description:
        "Yogic eye care practices in Albania — simple Classical Hatha practices for the eyes, taught as intended, with teaching based in Saranda and Tirana.",
    },
  },
  {
    slug: "pavanamuktasana",
    contextLine:
      "Pavanamuktasana is offered in Albania through Nava Hatha Yoga, with teaching based in Saranda and Tirana.",
    relatedPrograms: related([
      { label: "Yogasanas", href: "/programs/yogasanas" },
      { label: "Upa Yoga", href: "/programs/upa-yoga" },
    ]),
    seo: {
      title: "Pavanamuktasana in Albania",
      description:
        "Learn Pavanamuktasana in Albania — a classical yogic posture taught in its traditional form, with teaching based in Saranda and Tirana.",
    },
  },
];

console.log("Patching geographic SEO expansion…");

const introBody = await client.fetch(`*[_id == "homePage"][0].intro.body`);
await patchSingleton("homePage", "homePage", {
  "seo.title": "Classical Hatha Yoga in Albania",
  "seo.description":
    "Authentic Classical Hatha Yoga in Albania — traditional practices taught as intended in Saranda & Tirana, for clarity, balance, and inner transformation.",
  "intro.body": replaceOrAppendGeoParagraph(introBody),
  "intro.videoTitle": "The Incredible Power of Classical Hatha Yoga",
  "upcomingEventsSection.description":
    "Classes are held in person in Saranda and Tirana, Albania.",
});

await patchSingleton("contactPage", "contactPage", {
  heroDescription:
    "For questions regarding upcoming programs, private instruction, or teaching locations in Albania, please leave a message below.",
  "teachingLocations.otherLocations":
    "Vlorë, Gjirokastër, Korçë, Corfu, Prishtina.",
  "seo.title": "Register for Classical Hatha Yoga in Albania",
  "seo.description":
    "Register or enquire about Classical Hatha Yoga in Albania. Teaching is based in Saranda and Tirana, with other locations available upon request. Classes are in-person.",
});

await patchSingleton("eventsPage", "eventsPage", {
  heroDescription:
    "Upcoming in-person Classical Hatha Yoga sessions in Saranda and Tirana, Albania. Explore the sessions below and discover a practice that can bring greater clarity, vitality, and steadiness into everyday life.",
  "seo.title": "Classical Hatha Yoga Events in Albania",
  "seo.description":
    "Upcoming Classical Hatha Yoga workshops, free sessions, and gatherings in Saranda and Tirana, Albania.",
});

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
      contextLine: program.contextLine,
      relatedPrograms: program.relatedPrograms,
      seo: program.seo,
    })
    .commit();
  console.log(`✓ program ${program.slug} (${doc.title})`);
}

console.log("Geographic SEO expansion patch complete.");
console.log("Did not create location pages or program × city pages.");
