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
import { CONTACT, programAfterProgramText, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

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
  whatIs: string[];
  aboutThePractice: string[];
  benefits: string[];
  practiceIndependently: string[];
  privateAndGroupSessions: string[];
  videoUrl?: string;
  priceLabel?: string;
}

function defaultAfterProgramText(title: string): string[] {
  return [...programAfterProgramText(title)];
}

function defaultPrivateAndGroupSessions(title: string): string[] {
  return [
    `${title} is offered in group sessions and can also be arranged privately. Group sessions provide a supportive environment for learning alongside others, while private sessions allow focused, individual attention.`,
    "Get in touch to learn about upcoming sessions or to arrange a private or group setting.",
  ];
}

export const programSeeds: ProgramSeed[] = [
  {
    title: "Angamardana",
    slug: "angamardana",
    shortIntro:
      "The word “Angamardana” means to have mastery over your limbs or body parts. Whatever action you want to perform in this world, how much mastery you have over your limbs determines how well you are going to do it.",
    whatIs: [
      "Angamardana is a series of 31 processes to invigorate the body, and reach peak physical fitness and mental health.",
      "A series of 31 dynamic processes, rooted in yoga, to invigorate the body and reach peak physical fitness. Angamardana means gaining complete mastery over the limbs, organs and other parts of the body. It needs no fitness equipment.",
    ],
    aboutThePractice: [
      "Angamardana, a fitness system rooted in yoga, offers everyone the opportunity to invigorate the body and reach peak physical and mental health.",
      "“Angamardana” means gaining complete mastery over the limbs, organs, and other parts of the body. True to its name, this practice revitalizes the body on all levels including the muscles, circulatory system, skeletal structure, nervous system, and the basic energy system.",
    ],
    benefits: [
      "Strengthens the spine, skeletal and muscular system.",
      "Builds physical strength, fitness and tenacity.",
      "Invigorates the body, bringing a sense of lightness and freedom in the body.",
      "Prepares the body for Hatha Yoga.",
      "Revitalizes the body including the muscles, blood circulation, skeletal and nervous systems.",
      "Helps in weight-loss.",
    ],
    practiceIndependently: defaultAfterProgramText("Angamardana"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Angamardana"),
    videoUrl: "https://youtu.be/9aAzFTQOJJU",
    priceLabel: "300€",
  },
  {
    title: "Bhastrika Kriya",
    slug: "bhastrika-kriya",
    shortIntro:
      "The way you breathe is the way you think. The way you think is the way you breathe. ― Sadhguru",
    whatIs: [
      "Bhastrika Kriya is a powerful yogic process that focuses on enhancing respiratory function and overall well-being.",
    ],
    aboutThePractice: [
      "Bhastrika Kriya is a yogic process which has an immediate impact on the respiratory system. It reduces the need for the number of breaths.",
      "The need for breath will not come down only by increasing lung capacity but because the oxygen consumption is low. The system is in such a relaxed state, the metabolism has come down. So this works in two ways: the expansion of the lung capacity; and the relaxing of the whole system. With both of these together, the need for breaths come down.",
      "This also has an impact on overall health too as well as assisting to improve other yoga practices in both Hatha and Kriya Yoga.",
    ],
    benefits: [
      "Keeps the system in harmony and balance.",
      "Prepares the system to handle powerful states of energy.",
      "Enhances the capabilities of the physical body, mind and energy system.",
      "Creates the basis to gain complete mastery over the human system.",
    ],
    practiceIndependently: defaultAfterProgramText("Bhastrika Kriya"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Bhastrika Kriya"),
  },
  {
    title: "Bhuta Shuddhi",
    slug: "bhuta-shuddhi",
    shortIntro:
      "Bhuta Shuddhi is about removing everything that you have built up so that the Creator's creation will rise and shine within you.",
    whatIs: [
      "Bhuta Shuddhi refers to the purification of the five elements — earth, water, fire, air, and space — that the human system is composed of. It is considered a foundational process within the yogic sciences.",
    ],
    aboutThePractice: [
      "The basis for all creation, including the physical body, is the group of five elements: earth, water, wind, fire, and space. The wellbeing of the body and mind can be established by purifying these five elements within the human system. This process also shapes the body into a stepping stone towards one's ultimate wellbeing.",
    ],
    benefits: [
      "Keeps the system in harmony and balance.",
      "Prepares the system to handle powerful states of energy.",
      "Enhances the capabilities of the physical body, mind and energy system.",
      "Creates the basis to gain complete mastery over the human system.",
    ],
    practiceIndependently: defaultAfterProgramText("Bhuta Shuddhi"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Bhuta Shuddhi"),
    videoUrl: "https://youtu.be/hc9g8u77g24?si=pyriUm6aNl1XFLuq",
    priceLabel: "175€",
  },
  {
    title: "Eye Care Practices",
    slug: "eye-care-practices",
    shortIntro:
      "Gentle, traditional practices for the eyes, offered to support comfort and care for the visual system.",
    whatIs: [
      "The yogic tradition includes simple practices intended to care for the eyes. In a time of constant screens, these practices offer a grounded way to give attention to the eyes.",
    ],
    aboutThePractice: [
      "These practices are gentle and accessible, and are designed to support relaxation and comfort around the eyes when done regularly.",
    ],
    benefits: [
      "May support comfort and relaxation for the eyes.",
      "Can help create a habit of mindful care.",
      "Is designed to support overall ease.",
    ],
    practiceIndependently: defaultAfterProgramText("Eye Care Practices"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Eye Care Practices"),
  },
  {
    title: "Jala Neti",
    slug: "jala-neti",
    shortIntro:
      "A traditional cleansing practice for the nasal passages using water, offered in its classical form.",
    whatIs: [
      "Jala Neti is a simple cleansing practice (kriya) that uses water to clear the nasal passages. It is one of the well-known hatha yoga cleansing techniques.",
    ],
    aboutThePractice: [
      "Practised carefully, Jala Neti is designed to support clear breathing and a sense of freshness, and is taught here with attention to correct, hygienic technique.",
    ],
    benefits: [
      "May support clearer breathing.",
      "Can help create a sense of freshness.",
      "Is designed to support nasal comfort.",
    ],
    practiceIndependently: defaultAfterProgramText("Jala Neti"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Jala Neti"),
  },
  {
    title: "Pavanamuktasana",
    slug: "pavanamuktasana",
    shortIntro:
      "A series of accessible movements designed to support ease and freedom in the joints and body.",
    whatIs: [
      "Pavanamuktasana is a set of gentle practices that work with the joints and the movement of energy through the body. The practices are accessible and can be approached by most people.",
    ],
    aboutThePractice: [
      "This series is designed to support a sense of looseness and ease, gently preparing the body and helping to release tension held in the joints.",
    ],
    benefits: [
      "May support ease and mobility in the joints.",
      "Can help create a sense of lightness.",
      "Is designed to support gentle release of tension.",
    ],
    practiceIndependently: defaultAfterProgramText("Pavanamuktasana"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Pavanamuktasana"),
  },
  {
    title: "Shanmukhi Mudra",
    slug: "shanmukhi-mudra",
    shortIntro:
      "A subtle practice that turns the attention inward, offered in its traditional form.",
    whatIs: [
      "Shanmukhi Mudra is a practice in which the senses are gently drawn inward. It belongs to the more subtle dimension of yoga practice.",
    ],
    aboutThePractice: [
      "When approached with patience, this practice is designed to support a quiet, inward focus and a settling of the mind.",
    ],
    benefits: [
      "May help bring a quiet, inward focus.",
      "Can help create a settled state of mind.",
      "Is designed to support inner stillness.",
    ],
    practiceIndependently: defaultAfterProgramText("Shanmukhi Mudra"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Shanmukhi Mudra"),
  },
  {
    title: "Surya Kriya",
    slug: "surya-kriya",
    shortIntro:
      "A potent classical practice working with the sun's energy within the system, taught in its original form.",
    whatIs: [
      "Surya Kriya is a classical yogic practice that works with the dimension of the sun within the human system. It is a complete process in itself, performed as a precise sequence.",
    ],
    aboutThePractice: [
      "Taught in its original form, Surya Kriya is designed to support physical wellbeing, stability of the mind, and a balanced flow of energy. It asks for sincerity and consistency from the practitioner.",
    ],
    benefits: [
      "Is designed to support physical and mental balance.",
      "May support steadiness and vitality.",
      "Can help create a stable inner foundation.",
    ],
    practiceIndependently: defaultAfterProgramText("Surya Kriya"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Surya Kriya"),
  },
  {
    title: "Surya Shakti",
    slug: "surya-shakti",
    shortIntro:
      "A vigorous practice derived from the same tradition as Surya Kriya, designed to build strength and energy.",
    whatIs: [
      "Surya Shakti is a more physically dynamic practice that shares its roots with Surya Kriya. It places emphasis on building physical strength and stamina.",
    ],
    aboutThePractice: [
      "Practised in its traditional form, Surya Shakti is designed to support a strong, energetic body while keeping the breath and attention engaged throughout.",
    ],
    benefits: [
      "May support physical strength and stamina.",
      "Can help create greater energy.",
      "Is designed to support an active, stable system.",
    ],
    practiceIndependently: defaultAfterProgramText("Surya Shakti"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Surya Shakti"),
  },
  {
    title: "Thoppukarnam",
    slug: "thoppukarnam",
    shortIntro:
      "A simple, traditional practice of movement and breath coordination, offered in its classical form.",
    whatIs: [
      "Thoppukaranam is a traditional practice that coordinates movement with the breath in a repeated, rhythmic way. It has long been valued as a simple yet effective practice.",
    ],
    aboutThePractice: [
      "This practice is designed to support coordination, focus, and a sense of balance between body and breath.",
    ],
    benefits: [
      "May support coordination and focus.",
      "Can help create balance between body and breath.",
      "Is designed to support steadiness.",
    ],
    practiceIndependently: defaultAfterProgramText("Thoppukarnam"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Thoppukarnam"),
  },
  {
    title: "Yogasanas",
    slug: "yogasanas",
    shortIntro:
      "Classical yoga postures held with awareness, designed to support the body and the flow of energy.",
    whatIs: [
      "Yogasanas are the classical postures of hatha yoga. Far more than physical exercise, they are precise positions that work with the body and its energies.",
    ],
    aboutThePractice: [
      "Held with awareness and offered in their traditional form, Yogasanas are designed to support physical wellbeing and a deeper sense of stability and ease.",
    ],
    benefits: [
      "May support flexibility and physical wellbeing.",
      "Can help create stability and ease.",
      "Is designed to support a balanced flow of energy.",
    ],
    practiceIndependently: defaultAfterProgramText("Yogasanas"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Yogasanas"),
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
    whatIs: blocks(...p.whatIs),
    aboutThePractice: blocks(...p.aboutThePractice),
    benefits: p.benefits,
    practiceIndependently: blocks(...p.practiceIndependently),
    privateAndGroupSessions: blocks(...p.privateAndGroupSessions),
    videoUrl: p.videoUrl,
    priceLabel: p.priceLabel,
  };
}

export const placeholderHomePage: HomePage = {
  hero: {
    headline: "Classical Hatha Yoga",
    supportingText:
      "A grounded space to learn time-honoured yogic practices with care and clarity, in Saranda, Albania.",
    primaryCta: { label: "View Upcoming Events", href: "/events" },
    secondaryCta: { label: "Explore Programs", href: "/programs" },
  },
  intro: {
    eyebrow: "The Practice",
    heading: "What is Classical Hatha Yoga?",
    body: blocks(
      "Classical Hatha Yoga stems from a deep understanding of the mechanics of the body, and uses yogic postures, or yogasanas, to enable the system to sustain higher dimensions of energy. By practicing this profound science, one can change and enhance the way they think, feel, and experience life.",
      "Classical Hatha Yoga is about creating a body that is not a hurdle in your life. The body becomes a stepping stone in the progress towards blossoming into your ultimate possibility.",
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
