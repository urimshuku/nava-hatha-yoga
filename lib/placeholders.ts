import type { PortableTextBlock } from "@portabletext/types";

import type {
  AboutPage,
  ContactPage,
  EventsPage,
  HomePage,
  LegalPage,
  PastEvent,
  Program,
  ProgramListItem,
  ProgramsPage,
  Retreat,
  RetreatsPage,
  SiteSettings,
  YogaEvent,
} from "@/sanity/lib/types";
import {
  CONTACT,
  getBeforeProgramNotes,
  getBeforeProgramTitle,
  getProgramIntensity,
  getProgramPriceLabel,
  MAIN_PROGRAM_SLUGS,
  PROGRAM_BEFORE_PROGRAM_NOTES,
  PROGRAM_BONUS_ITEMS,
  PROGRAM_BONUS_TITLE,
  PROGRAM_DISCOUNT_NOTE,
  PROGRAM_MEDICAL_NOTICE,
  PROGRAM_MEDICAL_NOTICE_TITLE,
  PROGRAM_ORDER,
  programAfterProgramText,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIAL_PROGRAM_SLUGS,
} from "@/lib/constants";
import { sessionBoundaryFromSchedule } from "@/lib/event-boundary";
import { getPlaceholderLegalPages } from "@/lib/legal-content";
import {
  TEACHER_NAME_LINE,
  TEACHER_STORY_PARAGRAPHS,
  TEACHER_STORY_TEASER_PARAGRAPHS,
  TEACHER_STORY_TITLE,
} from "@/lib/teacher-story";

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
  social: [
    {
      label: "Instagram",
      url: `https://www.instagram.com/${CONTACT.instagram}/`,
    },
  ],
  beforeProgramNotes: [...PROGRAM_BEFORE_PROGRAM_NOTES],
  bonusTitle: PROGRAM_BONUS_TITLE,
  bonusItems: [...PROGRAM_BONUS_ITEMS],
  discountNote: PROGRAM_DISCOUNT_NOTE,
  medicalNoticeTitle: PROGRAM_MEDICAL_NOTICE_TITLE,
  medicalNotice: PROGRAM_MEDICAL_NOTICE,
  eventExperienceNote: "No prior yoga experience required!",
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
    priceLabel: "55€",
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
    title: "Children's Program",
    slug: "childrens-program",
    priceLabel: "150€",
    shortIntro:
      "A unique possibility for every child to experience a joyful blossoming of their natural potential. The program introduces yoga to children, led through an exploration of fun, love and joy.",
    whatIs: [
      "Children's Program introduces yoga through simple, life enhancing asanas and offers a unique possibility for every child to experience a joyful blossoming of their natural potential.",
    ],
    aboutThePractice: [
      "Children's Program offers a unique possibility for every child to experience a joyful blossoming of their natural potential.",
      "The program introduces simple yoga for children, led through an exploration of fun, love and joy, allowing each child to develop and live in optimal health and inner peace.",
    ],
    benefits: [
      "Enhances concentration and memory, focus, and mind/body coordination.",
      "Helps in preventing obesity, asthma, sinusitis and other chronic ailments.",
      "Leads to wellbeing and the proper development of body and mind.",
    ],
    practiceIndependently: defaultAfterProgramText("Children's Program"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Children's Program"),
  },
  {
    title: "Eye Care Practices",
    slug: "eye-care-practices",
    shortIntro:
      "Simple yogic practices that improve or maintain one's eye sight.",
    whatIs: [
      "Eye care practices offer a natural way to improve vision related issues which many a times stem from routine patterns of sitting in front of computers, televisions, phones etc.",
    ],
    aboutThePractice: [
      "These unique practises, devised by Sadhguru, are designed to have a phenomenal impact on the overall health and capabilities of the eyes. The practices can help correct eye problems, such as myopia (nearsightedness) and hyperopia (farsightedness) and strengthen the eye's overall vision and focus; that can be maintained even into old age.",
      "They are a very simple set of practices including body movements and practices directly for the eyes. It is a natural way to correct one's vision without surgery or laser treatments.",
      "The eyes have a muscular structure just like any other part of the body and, depending on the situation surrounding the eyes, can be corrected naturally provided there are no other complications.",
    ],
    benefits: [
      "Strengthens the eye muscles.",
      "Improves eyesight.",
      "Helps relieve eye strain from prolonged exposure to computers, bringing relaxation to eyes.",
      "Recommended for those with Myopia and Hypermetropia.",
    ],
    practiceIndependently: defaultAfterProgramText("Eye Care Practices"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Eye Care Practices"),
    priceLabel: "55€",
  },
  {
    title: "Jala Neti",
    slug: "jala-neti",
    shortIntro:
      "Keeping your sinuses well-balanced and maintaining free movement within them is very important. Jala Neti is towards this – it reduces the mucus in the system. But this practice has to be properly imparted. ― Sadhguru",
    whatIs: [
      "Jala Neti is a simple but effective process of cleansing the nasal passages with salt water using a copper Jala Neti pot designed by Sadhguru. The process makes breathing easier by helping air enter the lungs unimpeded by mucus and dirt which easily builds up during the day.",
    ],
    aboutThePractice: [
      "In this program you will learn two powerful practices in the form of Jala Neti and Bhastrika Kriya as a powerful combination in taking care of all aspects of making sure your breath and respiratory system function at its optimum.",
    ],
    benefits: [
      "Helps with the disease of eyes, nose throat.",
      "Removes excess mucus and pollutants from nasal passages and sinuses.",
      "Helps relieve insomnia, tiredness, improves quality of sleep.",
      "Prevents and helps with respiratory tract disease like asthma, pneumonia, bronchitis.",
      "Relieves cold, allergies, sinusitis.",
      "Helps with tonsillitis, allergic rhinitis, hay fever.",
      "Relieve migraine and headaches, anxiety, stress release and brings tranquility.",
      "Helps with epilepsy.",
    ],
    practiceIndependently: defaultAfterProgramText("Jala Neti"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Jala Neti"),
    priceLabel: "55€",
  },
  {
    title: "Pavanamuktasana",
    slug: "pavanamuktasana",
    shortIntro:
      "A posture designed to release trapped gas, stimulate digestion, and relieve lower back tension.",
    whatIs: [
      "Pavanamuktasana is a classic yoga posture which involves lying on your back, drawing your knees to your chest, and using your arms to compress the abdomen.",
    ],
    aboutThePractice: [
      "This posture is designed to release trapped gas, stimulate digestion, and relieve lower back tension.",
    ],
    benefits: [
      "Loosens the spinal vertebrae and creates flexibility and strength in the spine.",
      "Massages abdomen and internal organs and keeps the colon healthy.",
      "Effective in removing gas and constipation.",
      "Can help with impotence, sterility and menstrual disorders.",
      "Beneficial for heart and lungs.",
      "Improves digestion.",
      "Can support in neuromuscular disorders.",
    ],
    practiceIndependently: defaultAfterProgramText("Pavanamuktasana"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Pavanamuktasana"),
    priceLabel: "55€",
  },
  {
    title: "Shanmukhi Mudra",
    slug: "shanmukhi-mudra",
    priceLabel: "55€",
    shortIntro:
      "If you turn inward, you will find a space where there is a solution for everything. ― Sadhguru",
    whatIs: [
      "Shanmukhi mudra is a simple but subtle practice that brightens and rejuvenates the face and eyes and brings about a state of balance leading toward increased awareness and meditativeness.",
    ],
    aboutThePractice: [
      "Shanmukhi Mudra is a yogic practice focused on turning inward by using hand gestures and breath to withdraw the senses. It's a subtle but powerful technique that prepares one for Pratyahara, the mastery of senses and offers benefits like improved vision, mental balance, and enhanced awareness.",
      "Known as beautifying yoga as it also brightens up the aura of the face.",
    ],
    benefits: [
      "Improves vision.",
      "Brightens the eyes and face.",
      "Improves the aura in the face for people concerned about their beauty.",
      "Helps turn a person inward, prepares one for pratyahara.",
      "Rejuvenates different parts of the face, including helping with ailments related to nose, ears and eyes.",
      "Helps relieve vertigo and tinnitus.",
      "Enhances awareness.",
      "Brings about mental balance.",
    ],
    practiceIndependently: defaultAfterProgramText("Shanmukhi Mudra"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Shanmukhi Mudra"),
  },
  {
    title: "Upa Yoga",
    slug: "upa-yoga",
    priceLabel: "150€",
    videoUrl: "https://youtu.be/tVZcK9pjI9I?si=gePcv9RJXXMO2TGA",
    shortIntro:
      "A simple yet powerful system of practice that activates the joints, muscle and energy system.",
    whatIs: [
      "Upa-yoga is a simple yet powerful system of practices that activate the joints, muscles and energy system.",
    ],
    aboutThePractice: [
      "Based on a sophisticated understanding of the body’s mechanics, Upa-yoga brings great ease to the whole system. It relieves physical stress and tiredness.",
      "Upa-yoga activates this energy and also lubricates the joints, creating an instant sense of alertness and liveliness. It rejuvenates the body after a period of inactivity and negates the effects of jetlag and long travel.",
    ],
    benefits: [
      "Relieves physical stress and tiredness.",
      "Strengthens the joints and muscles.",
      "Rejuvenates the body after periods of inactivity.",
      "Negates the effects of jetlag and long travel.",
    ],
    practiceIndependently: defaultAfterProgramText("Upa Yoga"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Upa Yoga"),
  },
  {
    title: "Surya Kriya",
    slug: "surya-kriya",
    priceLabel: "150€",
    videoUrl: "https://youtu.be/NUI3zYJKKL0?si=YPYQkmbBBo0KkYvg",
    shortIntro:
      "\"Surya\" means \"sun,\" and \"kriya\" means \"inner energy process.\" Surya Kriya activates the solar plexus to raise the samat prana, or solar heat, in the system.",
    whatIs: [
      "Surya Kriya is a potent 21-step yogic practice of tremendous antiquity, designed as a holistic process for health and inner wellbeing.",
    ],
    aboutThePractice: [
      "Surya Kriya is a potent yogic practice of tremendous antiquity, designed as a holistic process for health, wellness, and complete inner well-being.",
      "\"Surya\" means \"sun,\" and \"kriya\" means \"inner energy process.\" Surya Kriya activates the solar plexus to raise the samat prana, or solar heat, in the system. It also balances a person's left and right energy channels, leading to stability of the body and stillness of the mind.",
      "This strong foundation becomes the basis to explore higher dimensions of life.",
    ],
    benefits: [
      "Develops mental clarity and focus.",
      "Remedies weak constitution.",
      "Boosts vigor and vitality.",
      "Balances the body, mind and energies.",
      "Rejuvenates all the major organ systems including balancing hormonal levels.",
      "Supports one to become meditative and experience peacefulness and joy.",
      "Capacity of the lungs increases over a period of time.",
      "Helps to maintain homeostasis of the body.",
    ],
    practiceIndependently: defaultAfterProgramText("Surya Kriya"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Surya Kriya"),
  },
  {
    title: "Surya Shakti",
    slug: "surya-shakti",
    priceLabel: "95€",
    videoUrl: "https://www.youtube.com/watch?v=OBds5NZ4PRs",
    shortIntro:
      "\"Surya\" means \"Sun,\" and \"Shakti\" means \"energy\". Surya Shakti is a dynamic form of the Sun Salutation which is an ancient yogic practice with a powerful sequence of 18 postures.",
    whatIs: [
      "Surya Shakti is to energize the system to a different dimension. This 18-step process helps to strengthen the ligaments that hold the skeletal and muscular structure together.",
    ],
    aboutThePractice: [
      "Surya means \"Sun,\" and Shakti means \"Energy\". Surya Shakti is a complete process, which is largely physical in nature. If you do 108 cycles of Surya Shakti, it will make you fit and you will not need any other form of exercise.",
      "Surya Shakti builds the physical body – it makes the sinews and ligaments of your body strong. In Yoga, we give importance to the sinews that hold the skeletal system and the whole body together. When we do any yogic practice, which is physical in nature, the focus is mainly to strengthen those, not to pump up your muscles. Strengthening the sinews of the body is what will endure for a long time and keep you well. Surya Shakti does this in a tremendous way.",
    ],
    benefits: [
      "Brings about physical fitness and overall wellbeing.",
      "Makes the sinews and ligaments of the body strong.",
      "Increases mental alertness and focus.",
      "Creates a basis for one to move into higher states of energy.",
      "Increases physical strength and stamina.",
      "Realigns the musculoskeletal system.",
      "Increases energy levels.",
    ],
    practiceIndependently: defaultAfterProgramText("Surya Shakti"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Surya Shakti"),
  },
  {
    title: "Thoppukarnam",
    slug: "thoppukarnam",
    priceLabel: "55€",
    shortIntro:
      "Thoppukarnam is a practice which helps with neurological vitality and different neurological issues. It is also known as \"brain yoga\".",
    whatIs: [
      "The word Thoppukarnam comes from the Sanskrit words 'thorpi' meaning 'holding by hands' and 'karnam' means 'ears'. With usage it has become 'Thoppukarnam'.",
    ],
    aboutThePractice: [
      "Thoppukarnam is a practice which helps with neurological vitality and different neurological issues. It is also known as \"brain yoga\".",
    ],
    benefits: [
      "Exercise the body.",
      "Activates the brain.",
      "Brings balance between right and left brain.",
      "Leads to neurological alertness.",
      "Enhances thinking capacity, concentration and memory.",
      "Releases tension and brings ease.",
      "Helps with mild depression and anxiety.",
      "Beneficial for those with diabetes.",
      "Beneficial for adults with Alzheimer's Disease.",
      "Beneficial for children especially those with diabetes, autism, dyslexia, ADD.",
    ],
    practiceIndependently: defaultAfterProgramText("Thoppukarnam"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Thoppukarnam"),
  },
  {
    title: "Yogasanas",
    slug: "yogasanas",
    priceLabel: "220€",
    videoUrl: "https://youtu.be/4ZdcGKUQufU?si=5a5AXn98IYG1UsO0",
    shortIntro:
      "The word \"asana\" literally means a posture. Out of the innumerable asanas a body can assume, 84 have been identified as Yogasanas, through which one can transform the body and mind into a possibility for ultimate wellbeing.",
    whatIs: [
      "Yogasanas are a set of powerful postures through which one can elevate one's consciousness and manipulate energies.",
      "The word asana literally means a posture. Out of the innumerable asanas a body can assume, 84 have been identified as Yogasanas, through which one can transform the body and mind into a possibility for ultimate well-being. Yogasanas are not exercises, but rather very subtle processes to manipulate one's energy in a particular direction.",
      "In an untrained state, the human body is a constant manifestation of various levels of compulsiveness. By consciously forming the body into a certain posture, one creates a conducive passage for energy flow that can elevate one's consciousness. Yogasanas are a way of aligning the inner system and adjusting it to the celestial geometry, thereby becoming in sync with the existence and naturally achieving a chemistry of healthfulness, joyfulness, blissfulness, and above all, balance.",
    ],
    aboutThePractice: [
      "Hatha Yoga is offered as a set of 21 powerful postures, or yogasanas, to enable the system to sustain higher dimensions of energy. This profound science enhances how one thinks, feels, and experiences life. Isha's program requires no special physical agility or previous experience of yoga. It is not merely physical exercise, but enables a person to flower into his ultimate potential; to naturally achieve a state of health, joy, and bliss.",
    ],
    benefits: [
      "Relief of chronic health conditions.",
      "Evolution of body and mind towards a higher possibility.",
      "Stabilization of the body, mind and energy system.",
      "Deceleration of the aging process.",
    ],
    practiceIndependently: defaultAfterProgramText("Yogasanas"),
    privateAndGroupSessions: defaultPrivateAndGroupSessions("Yogasanas"),
  },
];

programSeeds.sort(
  (a, b) => PROGRAM_ORDER.indexOf(a.slug) - PROGRAM_ORDER.indexOf(b.slug),
);

export const placeholderPrograms: ProgramListItem[] = programSeeds.map((p) => ({
  _id: `placeholder-${p.slug}`,
  title: p.title,
  slug: p.slug,
  shortIntro: p.shortIntro,
  category: (SPECIAL_PROGRAM_SLUGS as readonly string[]).includes(p.slug)
    ? "special"
    : "main",
  intensity: getProgramIntensity(p.slug) ?? undefined,
}));

export function placeholderProgramBySlug(slug: string): Program | undefined {
  const p = programSeeds.find((s) => s.slug === slug);
  if (!p) return undefined;
  return {
    _id: `placeholder-${p.slug}`,
    title: p.title,
    slug: p.slug,
    shortIntro: p.shortIntro,
    category: (SPECIAL_PROGRAM_SLUGS as readonly string[]).includes(p.slug)
      ? "special"
      : "main",
    intensity: getProgramIntensity(p.slug) ?? undefined,
    beforeProgramTitle: getBeforeProgramTitle(p.slug),
    beforeProgramNotes: [...getBeforeProgramNotes(p.slug)],
    whatIs: blocks(...p.whatIs),
    aboutThePractice: blocks(...p.aboutThePractice),
    benefits: p.benefits,
    practiceIndependently: blocks(...p.practiceIndependently),
    privateAndGroupSessions: blocks(...p.privateAndGroupSessions),
    videoUrl: p.videoUrl,
    priceLabel: getProgramPriceLabel(p.slug, p.priceLabel),
  };
}

export const placeholderHomePage: HomePage = {
  hero: {
    headline: "Nava Classical Hatha Yoga",
    supportingText:
      "“Hatha Yoga is not body-bending business. It is about taking charge of the way you think, feel, and perceive life.” ― Sadhguru",
    primaryCta: { label: "View Upcoming Events", href: "/events" },
    secondaryCta: { label: "Explore Programs", href: "/programs" },
  },
  highlights: {
    items: [
      { text: "Ancient yogic tools for modern life." },
      { text: "Practices for balance, clarity and well-being." },
      {
        text: "Learn once. Practise for a lifetime.",
        lines: ["Learn once.", "Practise for a lifetime."],
      },
    ],
    closingQuote: "“In balance. Life unfolds.”",
  },
  intro: {
    eyebrow: "The Practice",
    heading: "What is Classical Hatha Yoga?",
    body: blocks(
      "Classical Hatha Yoga stems from a deep understanding of the mechanics of the body, and uses yogic postures, or yogasanas, to enable the system to sustain higher dimensions of energy. By practicing this profound science, one can change and enhance the way they think, feel, and experience life.",
      "Classical Hatha Yoga is about creating a body that is not a hurdle in your life. The body becomes a stepping stone in the progress towards blossoming into your ultimate possibility.",
    ),
    videoUrl: "https://youtu.be/UIK3hR-NjYU",
  },
  featuredProgramsSection: {
    eyebrow: "Programs",
    title: "Practices offered in their traditional form",
    description:
      "Each program is a complete practice within the Classical Hatha Yoga system, taught as intended. Explore a practice and register your interest for upcoming sessions.",
    ctaLabel: "View all programs",
  },
  featuredPrograms: MAIN_PROGRAM_SLUGS.flatMap((slug) => {
    const program = placeholderPrograms.find((p) => p.slug === slug);
    return program ? [program] : [];
  }),
  upcomingEventsSection: {
    eyebrow: "Events",
    title: "Upcoming events",
    description: "All classes are currently held in person in Saranda, Albania.",
    emptyTitle: "New events are being scheduled",
    emptyDescription:
      "There are no events listed right now. Please check back soon or get in touch to register your interest.",
    ctaLabel: "See all upcoming events",
  },
  privateCorporate: {
    heading: "Private Sessions",
    lead:
      "Private sessions are available upon request. Depending on the needs of the individual, group, or organization, selected Classical Hatha Yoga practices can be offered in a focused setting.",
    offerings: [
      {
        title: "One-to-One Session",
        body: "Highly personalized instruction tailored to your specific physical capabilities and wellbeing goals. Ideal for those seeking deeper refinement or specific health support.",
      },
      {
        title: "Small-Group/Family Session",
        body: "Gather friends, family, or colleagues for a private session. A focused environment that balances personalized attention with shared experience.",
      },
      {
        title: "Corporate Session",
        body: "Bring ancient tools for clarity and balance into the workplace. Designed to combat stress and foster a vibrant, focused professional environment.",
      },
    ],
    cta: { label: "Request a private session", href: "/contact" },
  },
  finalCta: {
    heading: "Connect with Us",
    body: "For questions regarding upcoming programs, private instruction, or general inquiries, please leave a message below.",
    cta: { label: "Get in Touch", href: "/contact" },
  },
};

export const placeholderAboutPage: AboutPage = {
  title: "Classical Hatha Yoga, taught with care.",
  heroDescription:
    "Know more about the teacher behind Nava Hatha Yoga in Albania — certified Classical Hatha Yoga training, practices taught as intended, based in Saranda & Tirana.",
  teacherStory: {
    nameLine: TEACHER_NAME_LINE,
    teaser: [...TEACHER_STORY_TEASER_PARAGRAPHS],
    storyTitle: TEACHER_STORY_TITLE,
    story: [...TEACHER_STORY_PARAGRAPHS],
  },
  highlightCards: [
    {
      title: "1750+ hours of teacher training (Sadhguru Gurukulam India)",
    },
    {
      title: "10 years of living/volunteering/teaching in the ashram",
    },
    {
      title: "6000+ participants supported",
    },
  ],
  sections: [
    {
      title: "Isha Hatha Yoga Teacher Training",
      body: blocks(
        "Isha Hatha Yoga School delivers classical Hatha Yoga in its full depth and dimension. It is Sadhguru's vision to offer this ancient science in all its purity and make it available to every individual. As a step towards realizing this vision, he has devised the Hatha Yoga Teacher Training Program. In this program, Hatha Yoga will be taught as a living experience in the most beautiful ashram setting of the Isha Yoga Center, India under the grace of a living master. Upon completion of the program, trainees will have the privilege and fulfillment of bringing this knowledge to many more people.",
      ),
      cta: {
        label: "Learn more about the training",
        href: "https://isha.sadhguru.org/us/en/yoga-meditation/yoga-teacher-training/hatha-yoga-teacher-training",
      },
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
      cta: {
        label: "Visit Isha Foundation",
        href: "https://isha.sadhguru.org/global/en",
      },
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

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toEventDate(year: number, month: number, day: number, endOfSession = false): string {
  const hour = endOfSession ? 16 : 14;
  return new Date(Date.UTC(year, month - 1, day, hour, 30, 0, 0)).toISOString();
}

function buildSessionSchedule(startDay: number, endDay: number, month: number) {
  const monthName = MONTH_NAMES[month - 1];
  const sessionLines: string[] = [];
  for (let day = startDay; day <= endDay; day++) {
    sessionLines.push(`${day} ${monthName}: 16:30 – 18:30`);
  }
  const sessionCount = endDay - startDay + 1;
  const time = [...sessionLines, "", `All ${sessionCount} sessions are mandatory`].join("\n");
  return { sessionLines, sessionCount, time };
}

function buildProgramEventDescription(
  program: ProgramSeed,
  sessionLines: string[],
  sessionCount: number,
  durationLabel?: string,
): string {
  return [
    ...program.aboutThePractice,
    "",
    "Benefits:",
    ...program.benefits.map((benefit) => `\u2022 ${benefit}`),
    "",
    `Duration: ${durationLabel ?? `${sessionCount} sessions / 2 hours.`}`,
    ...sessionLines,
  ].join("\n");
}

function resolveEventSchedule(event: ScheduledEvent) {
  if (event.schedule) {
    const { durationLabel, sessionLines, sessionCount } = event.schedule;
    const time = [...sessionLines, "", `All ${sessionCount} sessions are mandatory`].join("\n");
    return { sessionLines, sessionCount, time, durationLabel };
  }

  const built = buildSessionSchedule(event.startDay, event.endDay, event.month);
  return { ...built, durationLabel: undefined };
}

const eventPaymentNote = "Payment details will be shared after registration.";
const eventLocation = "Rruga Skenderbeu 31, 9701, Saranda";
const tiranaEventLocation = "Albania Yoga Center, 8RGM+54V, Tiranë, Albania";

type EventSchedule = {
  durationLabel: string;
  sessionLines: string[];
  sessionCount: number;
};

type ScheduledEvent = {
  id: string;
  programSlug: string;
  title: string;
  year: number;
  month: number;
  startDay: number;
  endDay: number;
  ageRequirement?: string;
  priceLabel?: string;
  schedule?: EventSchedule;
  date?: string;
  endDate?: string;
  location?: string;
};

const scheduledEvents: ScheduledEvent[] = [
  {
    id: "surya-kriya-saranda-jun-2026",
    programSlug: "surya-kriya",
    title: "Surya Kriya",
    year: 2026,
    month: 6,
    startDay: 29,
    endDay: 30,
    ageRequirement: "14+",
    priceLabel: "170€",
    schedule: {
      durationLabel: "3 sessions / 2 hours",
      sessionCount: 3,
      sessionLines: [
        "29 June: 07:30 – 09:30",
        "29 June: 17:30 – 19:30",
        "30 June: 17:30 – 19:30",
      ],
    },
  },
  {
    id: "surya-kriya-jul-2026-1",
    programSlug: "surya-kriya",
    title: "Surya Kriya",
    year: 2026,
    month: 7,
    startDay: 11,
    endDay: 12,
    ageRequirement: "14+",
    priceLabel: "170€",
    schedule: {
      durationLabel: "3 sessions / 2 hours",
      sessionCount: 3,
      sessionLines: [
        "11 July: 17:30 – 19:30",
        "12 July: 07:30 – 09:30",
        "12 July: 17:30 – 19:30",
      ],
    },
  },
  {
    id: "surya-kriya-jul-2026-2",
    programSlug: "surya-kriya",
    title: "Surya Kriya",
    year: 2026,
    month: 7,
    startDay: 25,
    endDay: 26,
    ageRequirement: "14+",
    priceLabel: "150€",
    location: tiranaEventLocation,
    schedule: {
      durationLabel: "3 sessions / 2 hours",
      sessionCount: 3,
      sessionLines: [
        "25 July: 17:30 – 19:30",
        "26 July: 07:30 – 09:30",
        "26 July: 17:30 – 19:30",
      ],
    },
  },
  {
    id: "surya-kriya-aug-2026",
    programSlug: "surya-kriya",
    title: "Surya Kriya",
    year: 2026,
    month: 8,
    startDay: 14,
    endDay: 16,
    ageRequirement: "14+",
    priceLabel: "170€",
  },
  {
    id: "surya-shakti-aug-2026",
    programSlug: "surya-shakti",
    title: "Surya Shakti",
    year: 2026,
    month: 8,
    startDay: 22,
    endDay: 23,
    location: tiranaEventLocation,
    date: "2026-08-22T14:30:00.000Z",
    endDate: "2026-08-23T16:15:00.000Z",
    schedule: {
      durationLabel: "2 sessions / 1 hour 45 min",
      sessionLines: [
        "22 August: 16:30 – 18:15",
        "23 August: 16:30 – 18:15",
      ],
      sessionCount: 2,
    },
  },
  {
    id: "surya-kriya-sep-2026",
    programSlug: "surya-kriya",
    title: "Surya Kriya",
    year: 2026,
    month: 9,
    startDay: 5,
    endDay: 6,
    ageRequirement: "14+",
    priceLabel: "150€",
    schedule: {
      durationLabel: "3 sessions / 2 hours",
      sessionCount: 3,
      sessionLines: [
        "5 September: 17:30 – 19:30",
        "6 September: 07:30 – 09:30",
        "6 September: 17:30 – 19:30",
      ],
    },
  },
  {
    id: "surya-kriya-tirana-sep-2026",
    programSlug: "surya-kriya",
    title: "Surya Kriya",
    year: 2026,
    month: 9,
    startDay: 12,
    endDay: 13,
    ageRequirement: "14+",
    priceLabel: "150€",
    location: tiranaEventLocation,
    schedule: {
      durationLabel: "3 sessions / 2 hours",
      sessionCount: 3,
      sessionLines: [
        "12 September: 17:30 – 19:30",
        "13 September: 07:30 – 09:30",
        "13 September: 17:30 – 19:30",
      ],
    },
  },
  {
    id: "yogasanas-sep-2026",
    programSlug: "yogasanas",
    title: "Yogasanas",
    year: 2026,
    month: 9,
    startDay: 25,
    endDay: 27,
    location: tiranaEventLocation,
    date: "2026-09-25T14:30:00.000Z",
    endDate: "2026-09-27T16:45:00.000Z",
    schedule: {
      durationLabel: "5 sessions / 2 hours 15 min",
      sessionLines: [
        "25 September: 16:30 – 18:45",
        "26 September: 08:00 – 10:15",
        "26 September: 16:30 – 18:45",
        "27 September: 08:00 – 10:15",
        "27 September: 16:30 – 18:45",
      ],
      sessionCount: 5,
    },
  },
];

function resolveEventDates(
  event: ScheduledEvent,
  time: string,
): { date: string; endDate: string } {
  if (event.date && event.endDate) {
    return { date: event.date, endDate: event.endDate };
  }

  const fromSchedule = sessionBoundaryFromSchedule(time, event.year);
  if (fromSchedule) return fromSchedule;

  return {
    date: toEventDate(event.year, event.month, event.startDay),
    endDate: toEventDate(event.year, event.month, event.endDay, true),
  };
}

export const placeholderEvents: YogaEvent[] = scheduledEvents.flatMap((event) => {
  const program = programSeeds.find((p) => p.slug === event.programSlug);
  if (!program) return [];

  const { sessionLines, sessionCount, time, durationLabel } = resolveEventSchedule(event);
  const { date, endDate } = resolveEventDates(event, time);

  return [
    {
      _id: `placeholder-event-${event.id}`,
      title: event.title,
      date,
      endDate,
      time,
      location: event.location ?? eventLocation,
      priceLabel: event.priceLabel ?? program.priceLabel ?? getProgramPriceLabel(event.programSlug),
      paymentNote: eventPaymentNote,
      teacher: "Erlinda Mustafaraj",
      ageRequirement: event.ageRequirement,
      category: "Workshop",
      relatedProgram: { title: program.title, slug: program.slug },
      description: buildProgramEventDescription(
        program,
        sessionLines,
        sessionCount,
        durationLabel,
      ),
      registrationLink: "/contact",
      whatsappEnabled: false,
    },
  ];
});
export const placeholderPastEvents: PastEvent[] = [];
export const placeholderRetreats: Retreat[] = [];

export const placeholderContactPage: ContactPage = {
  heroTitle: "Get in touch",
  heroDescription:
    "For questions regarding upcoming programs, private instruction, or general inquiries, please leave a message below.",
  formHeading: "Send a message",
  quickMessageBody:
    "Prefer WhatsApp? Reach out directly and we'll reply as soon as we can.",
  whatsappPrefill: "Hello, I'd like to know more about your classes.",
  teachingLocations: {
    mainHeading: "Main teaching locations",
    mainLocations: "Tirana, Saranda.",
    otherHeading: "Other teaching locations upon request",
    otherLocations: "Vlora, Gjirokaster, Korca, Corfu, Prishtina.",
  },
};

export const placeholderProgramsPage: ProgramsPage = {
  heroEyebrow: "Programs & Offerings",
  heroTitle: "Classical Hatha Yoga programs",
  heroDescription:
    "Core programs form the foundation of Classical Hatha Yoga in Albania, taught in their traditional form. Special programs address specific needs, and free offerings offer a gentle way to begin.",
  freeOfferings: {
    eyebrow: "Free offerings",
    lead: "Open resources to begin exploring Classical Hatha Yoga.",
    items: [
      {
        title: "Learn About Classical Hatha Yoga",
        description:
          "Discover what Classical Hatha Yoga is, how it works with the body and energy system, and why it is offered in its traditional form.",
      },
      {
        title: "Online Resources",
        description:
          "Explore free resources to deepen your understanding of the practices and the wider Classical Hatha Yoga tradition.",
      },
    ],
  },
};

export const placeholderEventsPage: EventsPage = {
  heroEyebrow: "Events",
  heroTitle: "Upcoming events",
  heroDescription:
    "Explore the sessions below and discover a practice that can bring greater clarity, vitality, and steadiness into everyday life.",
  emptyTitle: "New events are being scheduled",
  emptyDescription:
    "There are no upcoming events listed right now. Please check back soon, or get in touch to register your interest and be notified.",
  contactHeading: "Have a question about an event?",
  contactDescription:
    "Reach out and we'll be glad to help you find the right session and answer any questions. Please leave a message below.",
};

export const placeholderRetreatsPage: RetreatsPage = {
  heroEyebrow: "Retreats & Partner Programs",
  heroTitle: "Classical Hatha Yoga retreats",
  heroDescription:
    "Upcoming immersive Classical Hatha Yoga retreats in Albania — devoted to traditional practice, quiet settings, and inner transformation. Dates will be announced; register your interest to be notified.",
  comingSoonHeading: "Retreats are on their way",
  comingSoonBody:
    "We are carefully preparing upcoming Classical Hatha Yoga retreats in Albania. No retreat is open for booking yet — if you would like to hear when dates are announced, please register your interest.",
  expectationsHeading: "An invitation to go deeper",
  expectations: [
    {
      title: "Immersive practice",
      body: "Extended, unhurried time with the practices, away from the demands of everyday life.",
    },
    {
      title: "Calm surroundings",
      body: "A quiet, supportive setting designed to help the body and mind settle.",
    },
    {
      title: "Guided learning",
      body: "Careful, attentive guidance in the Classical Hatha Yoga practices, in their original form.",
    },
  ],
  listingCta: {
    heading: "Questions about a retreat?",
    body: "Reach out and we'll be glad to share more details and help you decide if it's right for you.",
    cta: { label: "Contact us", href: "/contact" },
  },
  partnerPrograms: {
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
  },
};

export const placeholderLegalPages: Record<string, LegalPage> =
  getPlaceholderLegalPages();
