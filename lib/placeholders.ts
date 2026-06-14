import type { PortableTextBlock } from "@portabletext/types";

import type {
  AboutPage,
  HomePage,
  LegalPage,
  PastEvent,
  Program,
  ProgramListItem,
  Retreat,
  SiteSettings,
  YogaEvent,
} from "@/sanity/lib/types";
import { CONTACT, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

/** Build a minimal Portable Text block from plain paragraphs. */
export function blocks(...paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `b${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text, marks: [] }],
  }));
}

export const placeholderSiteSettings: SiteSettings = {
  brandName: SITE_NAME,
  tagline: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
  email: CONTACT.email,
  phone: CONTACT.phone,
  whatsapp: CONTACT.whatsapp,
  location: CONTACT.location,
  social: [],
};

interface ProgramSeed {
  title: string;
  slug: string;
  shortIntro: string;
  body: string[];
  benefits: string[];
  experiences: string[];
}

export const programSeeds: ProgramSeed[] = [
  {
    title: "Angamardana",
    slug: "angamardana",
    shortIntro:
      "A full-body practice rooted in the yogic system, designed to support strength, stamina, and vitality without external weights.",
    body: [
      "Angamardana is a practice that works with the body in a structured, rhythmic way. The name points to the idea of gaining mastery over the limbs and the whole physical system through dedicated effort.",
      "Practised in its traditional form, Angamardana is designed to support physical strength, flexibility, and endurance while also bringing a sense of steadiness to the mind. It is a complete practice that uses only the body itself.",
    ],
    benefits: [
      "May support overall strength and stamina",
      "Can help create greater flexibility and ease of movement",
      "Is designed to support a more energetic and stable system",
    ],
    experiences: [
      "A sense of physical lightness and vitality",
      "Steadiness and focus that can carry into daily life",
    ],
  },
  {
    title: "Bhastrika Kriya",
    slug: "bhastrika-kriya",
    shortIntro:
      "A breath-based practice that works with the rhythm of the breath to support energy and inner clarity.",
    body: [
      "Bhastrika Kriya is a practice that gives attention to the breath and its movement. Working consciously with the breath is a central thread in the yogic tradition.",
      "When practised carefully and under guidance, Bhastrika is designed to support a sense of vitality and inner spaciousness, helping the practitioner become more aware of their own energies.",
    ],
    benefits: [
      "May help bring a sense of energy and freshness",
      "Can help create greater awareness of the breath",
      "Is designed to support inner clarity",
    ],
    experiences: [
      "A feeling of openness in the chest and breath",
      "Calm alertness after practice",
    ],
  },
  {
    title: "Bhuta Shuddhi",
    slug: "bhuta-shuddhi",
    shortIntro:
      "A foundational process working with the five elements that form the body, offered in its classical form.",
    body: [
      "Bhuta Shuddhi refers to the purification of the five elements — earth, water, fire, air, and space — that the human system is composed of. It is considered a foundational process within the yogic sciences.",
      "Taught in its original form, this practice is designed to support a sense of balance and cleanliness within the system, creating a more receptive ground for other practices.",
    ],
    benefits: [
      "Is designed to support balance within the system",
      "May help bring a sense of inner cleanliness",
      "Can help create a stable foundation for further practice",
    ],
    experiences: [
      "A quiet sense of order and balance",
      "Greater sensitivity to one's own inner state",
    ],
  },
  {
    title: "Eye Care Practices",
    slug: "eye-care-practices",
    shortIntro:
      "Gentle, traditional practices for the eyes, offered to support comfort and care for the visual system.",
    body: [
      "The yogic tradition includes simple practices intended to care for the eyes. In a time of constant screens, these practices offer a grounded way to give attention to the eyes.",
      "These practices are gentle and accessible, and are designed to support relaxation and comfort around the eyes when done regularly.",
    ],
    benefits: [
      "May support comfort and relaxation for the eyes",
      "Can help create a habit of mindful care",
      "Is designed to support overall ease",
    ],
    experiences: [
      "A sense of relief around the eyes",
      "A calmer relationship with daily screen use",
    ],
  },
  {
    title: "Jala Neti",
    slug: "jala-neti",
    shortIntro:
      "A traditional cleansing practice for the nasal passages using water, offered in its classical form.",
    body: [
      "Jala Neti is a simple cleansing practice (kriya) that uses water to clear the nasal passages. It is one of the well-known hatha yoga cleansing techniques.",
      "Practised carefully, Jala Neti is designed to support clear breathing and a sense of freshness, and is taught here with attention to correct, hygienic technique.",
    ],
    benefits: [
      "May support clearer breathing",
      "Can help create a sense of freshness",
      "Is designed to support nasal comfort",
    ],
    experiences: [
      "Easier, clearer breathing",
      "A light, refreshed feeling",
    ],
  },
  {
    title: "Pavanamuktasana",
    slug: "pavanamuktasana",
    shortIntro:
      "A series of accessible movements designed to support ease and freedom in the joints and body.",
    body: [
      "Pavanamuktasana is a set of gentle practices that work with the joints and the movement of energy through the body. The practices are accessible and can be approached by most people.",
      "This series is designed to support a sense of looseness and ease, gently preparing the body and helping to release tension held in the joints.",
    ],
    benefits: [
      "May support ease and mobility in the joints",
      "Can help create a sense of lightness",
      "Is designed to support gentle release of tension",
    ],
    experiences: [
      "Freer, more comfortable movement",
      "A relaxed and grounded body",
    ],
  },
  {
    title: "Shanmukhi Mudra",
    slug: "shanmukhi-mudra",
    shortIntro:
      "A subtle practice that turns the attention inward, offered in its traditional form.",
    body: [
      "Shanmukhi Mudra is a practice in which the senses are gently drawn inward. It belongs to the more subtle dimension of yoga practice.",
      "When approached with patience, this practice is designed to support a quiet, inward focus and a settling of the mind.",
    ],
    benefits: [
      "May help bring a quiet, inward focus",
      "Can help create a settled state of mind",
      "Is designed to support inner stillness",
    ],
    experiences: [
      "A sense of quiet and inwardness",
      "Reduced mental restlessness",
    ],
  },
  {
    title: "Surya Kriya",
    slug: "surya-kriya",
    shortIntro:
      "A potent classical practice working with the sun's energy within the system, taught in its original form.",
    body: [
      "Surya Kriya is a classical yogic practice that works with the dimension of the sun within the human system. It is a complete process in itself, performed as a precise sequence.",
      "Taught in its original form, Surya Kriya is designed to support physical wellbeing, stability of the mind, and a balanced flow of energy. It asks for sincerity and consistency from the practitioner.",
    ],
    benefits: [
      "Is designed to support physical and mental balance",
      "May support steadiness and vitality",
      "Can help create a stable inner foundation",
    ],
    experiences: [
      "A grounded, balanced state",
      "Steady energy through the day",
    ],
  },
  {
    title: "Surya Shakti",
    slug: "surya-shakti",
    shortIntro:
      "A vigorous practice derived from the same tradition as Surya Kriya, designed to build strength and energy.",
    body: [
      "Surya Shakti is a more physically dynamic practice that shares its roots with Surya Kriya. It places emphasis on building physical strength and stamina.",
      "Practised in its traditional form, Surya Shakti is designed to support a strong, energetic body while keeping the breath and attention engaged throughout.",
    ],
    benefits: [
      "May support physical strength and stamina",
      "Can help create greater energy",
      "Is designed to support an active, stable system",
    ],
    experiences: [
      "A strong and energised body",
      "A sense of capability and vigour",
    ],
  },
  {
    title: "Thoppukarnam",
    slug: "thoppukarnam",
    shortIntro:
      "A simple, traditional practice of movement and breath coordination, offered in its classical form.",
    body: [
      "Thoppukaranam is a traditional practice that coordinates movement with the breath in a repeated, rhythmic way. It has long been valued as a simple yet effective practice.",
      "This practice is designed to support coordination, focus, and a sense of balance between body and breath.",
    ],
    benefits: [
      "May support coordination and focus",
      "Can help create balance between body and breath",
      "Is designed to support steadiness",
    ],
    experiences: [
      "Improved focus and rhythm",
      "A balanced, attentive state",
    ],
  },
  {
    title: "Yogasanas",
    slug: "yogasanas",
    shortIntro:
      "Classical yoga postures held with awareness, designed to support the body and the flow of energy.",
    body: [
      "Yogasanas are the classical postures of hatha yoga. Far more than physical exercise, they are precise positions that work with the body and its energies.",
      "Held with awareness and offered in their traditional form, Yogasanas are designed to support physical wellbeing and a deeper sense of stability and ease.",
    ],
    benefits: [
      "May support flexibility and physical wellbeing",
      "Can help create stability and ease",
      "Is designed to support a balanced flow of energy",
    ],
    experiences: [
      "A more open, comfortable body",
      "A settled, stable inner state",
    ],
  },
];

export const placeholderPrograms: ProgramListItem[] = programSeeds.map((p) => ({
  _id: `placeholder-${p.slug}`,
  title: p.title,
  slug: p.slug,
  shortIntro: p.shortIntro,
}));

export function placeholderProgramBySlug(slug: string): Program | undefined {
  const p = programSeeds.find((s) => s.slug === slug);
  if (!p) return undefined;
  return {
    _id: `placeholder-${p.slug}`,
    title: p.title,
    slug: p.slug,
    shortIntro: p.shortIntro,
    body: blocks(...p.body),
    benefits: p.benefits,
    experiences: p.experiences,
  };
}

export const placeholderHomePage: HomePage = {
  hero: {
    headline: "Classical Hatha Yoga, in its original form",
    supportingText:
      "A grounded space to learn time-honoured yogic practices with care and clarity, in Saranda, Albania.",
    primaryCta: { label: "View Upcoming Events", href: "/events" },
    secondaryCta: { label: "Explore Programs", href: "/programs" },
  },
  intro: {
    eyebrow: "The Practice",
    heading: "What is Classical Hatha Yoga?",
    body: blocks(
      "Classical Hatha Yoga is a methodical approach to working with the body, breath, and energy. It is not fitness or exercise — it is a complete inner science with thousands of years of refinement behind it.",
      "Here, practices are taught in their original form, with attention to correct technique and the right understanding. The aim is not performance, but to create a body and mind that are stable, balanced, and available for life.",
    ),
  },
  privateCorporate: {
    heading: "Private & Corporate Sessions",
    body: blocks(
      "Private and corporate sessions are available upon request. Depending on the needs of the individual, group, or organization, selected Classical Hatha Yoga practices can be offered in a focused setting.",
    ),
  },
  aboutIntro: {
    eyebrow: "About",
    heading: "A quiet, serious space for practice",
    body: blocks(
      "Ananta Hatha Yoga is dedicated to offering Classical Hatha Yoga with sincerity and respect for the tradition. Classes are held in person in Saranda, Albania, and are open to both beginners and committed practitioners.",
    ),
  },
  finalCta: {
    heading: "Begin your practice",
    body: "Reach out to learn more, register your interest, or ask any questions. Classes are in-person and registration is handled personally.",
    cta: { label: "Get in Touch", href: "/contact" },
  },
};

export const placeholderAboutPage: AboutPage = {
  title: "About Ananta Hatha Yoga",
  intro: blocks(
    "Ananta Hatha Yoga is dedicated to Classical Hatha Yoga — practices offered in their original form, with care for both the tradition and those who come to learn.",
  ),
  sections: [
    {
      title: "Isha Hatha Yoga Teacher Training",
      body: blocks(
        "Isha Hatha Yoga School delivers classical Hatha Yoga in its full depth and dimension. It is Sadhguru's vision to offer this ancient science in all its purity and make it available to every individual. As a step towards realizing this vision, he has devised the Hatha Yoga Teacher Training Program. In this program, Hatha Yoga will be taught as a living experience in the most beautiful ashram setting of the Isha Yoga Center, India under the grace of a living master. Upon completion of the program, trainees will have the privilege and fulfillment of bringing this knowledge to many more people.",
      ),
    },
    {
      title: "Isha Yoga Center",
      body: blocks(
        "Located at the foothills of the lush Velliangiri Mountains in Tamil Nadu, South India, the Isha Yoga Center is a sacred space for self-transformation dedicated to fostering inner transformation and creating an established state of wellbeing in individuals. The center offers all four major paths of yoga – kriya (energy), gnana (knowledge), karma (action), and bhakti (devotion), attracting people from all over the world. A large residential facility houses an active international community of monks, full-time volunteers, guests and visitors, making it a vibrant hub of spiritual growth and activity.",
      ),
    },
    {
      title: "Isha Foundation",
      body: blocks(
        "Sadhguru's vision to transform the world has been unfolding over the past 30 years through programs designed to create an inclusive culture and establish global harmony. He established the Isha Foundation, an international non-profit service organization, through which he has offered powerful yoga programs that extend a rare opportunity for self-discovery, inner transformation, and empowerment for individuals to reach their full potential. He has initiated many large scale human service projects for rural upliftment, quality education for the poor, environmental stewardship and holistic health, which have impacted the lives of millions of people around the world, earning a special consultative status with the United Nations.",
        "Isha Foundation is run entirely by volunteers inspired by their own personal transformation. Sadhguru has emphasized that humanity now has the necessary capability and resources to address every problem on the planet; the only missing element is willingness. Sadhguru has kindled this willingness within millions of people to extend their heads, hands, and hearts toward the betterment of humanity.",
      ),
    },
    {
      title: "Sadhguru",
      body: blocks(
        "Sadhguru is a yogi, mystic and visionary, and a prominent spiritual leader. An author, poet, and internationally-renowned speaker, Sadhguru's wit and piercing logic provoke and widen our perception of life. www.ishafoundation.org",
        "Yogi, mystic and visionary, Sadhguru is a spiritual master with a difference. An arresting blend of profundity and pragmatism, his life and work serve as a reminder that yoga is not an esoteric discipline from an outdated past, but a contemporary science, vitally relevant to our times. Probing, passionate and provocative, insightful, logical and unfailingly witty, Sadhguru's talks have earned him the reputation of a speaker and opinion-maker of international renown. With a celebratory engagement with life on all levels, Sadhguru's areas of active involvement encompass fields as diverse as architecture and visual design, poetry and painting, ecology and horticulture, music and sports. Sadhguru is also the founder of Isha Foundation, a non-profit organization which has been dedicated to the wellbeing of the individual and the world for the past three decades. Isha Foundation does not promote any particular ideology, religion, or race, but transmits inner sciences of universal appeal.",
      ),
    },
  ],
};

export const placeholderEvents: YogaEvent[] = [];
export const placeholderPastEvents: PastEvent[] = [];
export const placeholderRetreats: Retreat[] = [];

export const placeholderLegalPages: Record<string, LegalPage> = {
  "terms-of-service": {
    title: "Terms of Service",
    slug: "terms-of-service",
    body: blocks(
      "These Terms of Service govern your use of the Ananta Hatha Yoga website and participation in our in-person classes and programs. This is placeholder content to be reviewed and finalised before launch.",
      "By using this website or registering for a class, you agree to engage with the practices responsibly and to follow any guidance provided by the teacher. Classes are offered in person, and registration is confirmed personally.",
      "Please consult a qualified health professional before beginning any new practice if you have a medical condition.",
    ),
  },
  "privacy-policy": {
    title: "Privacy Policy",
    slug: "privacy-policy",
    body: blocks(
      "This Privacy Policy describes how Ananta Hatha Yoga handles the information you share with us. This is placeholder content to be reviewed and finalised before launch.",
      "When you contact us through the website, we collect only the details you provide — such as your name, email, phone number, and message — in order to respond to your enquiry. We do not sell your information.",
      "You may request access to or deletion of your information at any time by contacting us.",
    ),
  },
  "cookie-policy": {
    title: "Cookie Policy",
    slug: "cookie-policy",
    body: blocks(
      "This Cookie Policy explains how Ananta Hatha Yoga uses cookies and similar technologies. This is placeholder content to be reviewed and finalised before launch.",
      "This website aims to use only essential cookies needed for the site to function. Any analytics or additional cookies would be described here and used only with appropriate consent.",
    ),
  },
};
