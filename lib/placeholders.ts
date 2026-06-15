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
import { CONTACT, getProgramPriceLabel, programAfterProgramText, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

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
    title: "Surya Kriya",
    slug: "surya-kriya",
    priceLabel: "150€",
    videoUrl: "https://youtu.be/_wq-OiPk-pU?si=qrktHL8oppvDoS7N",
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
    priceLabel: getProgramPriceLabel(p.slug, p.priceLabel),
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
    videoUrl: "https://youtu.be/UIK3hR-NjYU",
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
