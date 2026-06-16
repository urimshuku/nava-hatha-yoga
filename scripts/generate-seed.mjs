/**
 * Generates seed/seed.ndjson from structured content so the Studio can be
 * populated in one command. Run with: node scripts/generate-seed.mjs
 * Then import with: npm run seed
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../seed/seed.ndjson");

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;

function blocks(...paragraphs) {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
}

function defaultPracticeIndependently(title) {
  return [
    `${title} can be practised independently at home. Regular, consistent practice helps deepen the benefits and integrate the practice into daily life.`,
    "Also, 40 days of practice support is available after the program.",
  ];
}

function defaultPrivateAndGroupSessions(title) {
  return [
    `${title} is offered in group sessions and can also be arranged privately. Group sessions provide a supportive environment for learning alongside others, while private sessions allow focused, individual attention.`,
    "Get in touch to learn about upcoming sessions or to arrange a private or group setting.",
  ];
}

const PROGRAM_PRICE_LABELS = {
  angamardana: "300€",
  "bhastrika-kriya": "55€",
  "bhuta-shuddhi": "175€",
  "eye-care-practices": "55€",
  "jala-neti": "55€",
  pavanamuktasana: "55€",
  "shanmukhi-mudra": "55€",
  "surya-kriya": "150€",
  "surya-shakti": "95€",
  thoppukarnam: "55€",
  yogasanas: "275€",
};

const PROGRAM_ORDER = [
  "surya-kriya",
  "surya-shakti",
  "yogasanas",
  "angamardana",
  "bhuta-shuddhi",
  "bhastrika-kriya",
  "jala-neti",
  "thoppukarnam",
  "shanmukhi-mudra",
  "eye-care-practices",
  "pavanamuktasana",
];

function programPriceLabel(slug, priceLabel) {
  if (priceLabel?.trim()) return priceLabel.trim();
  return PROGRAM_PRICE_LABELS[slug] ?? "Contact for details";
}

const programs = [
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
    body: [
      "Angamardana is a series of 31 processes to invigorate the body, and reach peak physical fitness and mental health.",
      "Angamardana, a fitness system rooted in yoga, offers everyone the opportunity to invigorate the body and reach peak physical and mental health.",
    ],
    benefits: [
      "Strengthens the spine, skeletal and muscular system.",
      "Builds physical strength, fitness and tenacity.",
      "Invigorates the body, bringing a sense of lightness and freedom in the body.",
      "Prepares the body for Hatha Yoga.",
      "Revitalizes the body including the muscles, blood circulation, skeletal and nervous systems.",
      "Helps in weight-loss.",
    ],
    experiences: [
      "A sense of physical lightness and vitality",
      "Steadiness and focus that can carry into daily life",
    ],
    videoUrl: "https://youtu.be/9aAzFTQOJJU",
    priceLabel: "300€",
  },
  {
    title: "Bhastrika Kriya",
    slug: "bhastrika-kriya",
    shortIntro:
      "The way you breathe is the way you think. The way you think is the way you breathe. ― Sadhguru",
    body: [
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
    experiences: [
      "A feeling of openness in the chest and breath",
      "Calm alertness after practice",
    ],
    priceLabel: "55€",
  },
  {
    title: "Bhuta Shuddhi",
    slug: "bhuta-shuddhi",
    shortIntro:
      "Bhuta Shuddhi is about removing everything that you have built up so that the Creator's creation will rise and shine within you.",
    body: [
      "Bhuta Shuddhi refers to the purification of the five elements — earth, water, fire, air, and space — that the human system is composed of. It is considered a foundational process within the yogic sciences.",
      "The basis for all creation, including the physical body, is the group of five elements: earth, water, wind, fire, and space. The wellbeing of the body and mind can be established by purifying these five elements within the human system. This process also shapes the body into a stepping stone towards one's ultimate wellbeing.",
    ],
    benefits: [
      "Keeps the system in harmony and balance.",
      "Prepares the system to handle powerful states of energy.",
      "Enhances the capabilities of the physical body, mind and energy system.",
      "Creates the basis to gain complete mastery over the human system.",
    ],
    experiences: [
      "A quiet sense of order and balance",
      "Greater sensitivity to one's own inner state",
    ],
    videoUrl: "https://youtu.be/hc9g8u77g24?si=pyriUm6aNl1XFLuq",
    priceLabel: "175€",
  },
  {
    title: "Eye Care Practices",
    slug: "eye-care-practices",
    shortIntro:
      "Simple yogic practices that improve or maintain one's eye sight.",
    body: [
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
    experiences: [
      "A sense of relief around the eyes",
      "A calmer relationship with daily screen use",
    ],
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
    experiences: ["Easier, clearer breathing", "A light, refreshed feeling"],
    priceLabel: "55€",
  },
  {
    title: "Pavanamuktasana",
    slug: "pavanamuktasana",
    shortIntro:
      "A posture designed to release trapped gas, stimulate digestion, and relieve lower back tension.",
    body: [
      "Pavanamuktasana is a classic yoga posture which involves lying on your back, drawing your knees to your chest, and using your arms to compress the abdomen.",
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
    experiences: [
      "Freer, more comfortable movement",
      "A relaxed and grounded body",
    ],
    priceLabel: "55€",
  },
  {
    title: "Shanmukhi Mudra",
    slug: "shanmukhi-mudra",
    priceLabel: "55€",
    shortIntro:
      "If you turn inward, you will find a space where there is a solution for everything. ― Sadhguru",
    body: [
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
    experiences: [
      "A sense of quiet and inwardness",
      "Reduced mental restlessness",
    ],
  },
  {
    title: "Surya Kriya",
    slug: "surya-kriya",
    priceLabel: "150€",
    videoUrl: "https://youtu.be/_wq-OiPk-pU?si=qrktHL8oppvDoS7N",
    shortIntro:
      "\"Surya\" means \"sun,\" and \"kriya\" means \"inner energy process.\" Surya Kriya activates the solar plexus to raise the samat prana, or solar heat, in the system.",
    body: [
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
    experiences: ["A grounded, balanced state", "Steady energy through the day"],
  },
  {
    title: "Surya Shakti",
    slug: "surya-shakti",
    priceLabel: "95€",
    shortIntro:
      "\"Surya\" means \"Sun,\" and \"Shakti\" means \"energy\". Surya Shakti is a dynamic form of the Sun Salutation which is an ancient yogic practice with a powerful sequence of 18 postures.",
    body: [
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
    experiences: [
      "A strong and energised body",
      "A sense of capability and vigour",
    ],
  },
  {
    title: "Thoppukarnam",
    slug: "thoppukarnam",
    priceLabel: "55€",
    shortIntro:
      "Thoppukarnam is a practice which helps with neurological vitality and different neurological issues. It is also known as \"brain yoga\".",
    body: [
      "The word Thoppukarnam comes from the Sanskrit words 'thorpi' meaning 'holding by hands' and 'karnam' means 'ears'. With usage it has become 'Thoppukarnam'.",
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
    experiences: ["Improved focus and rhythm", "A balanced, attentive state"],
  },
  {
    title: "Yogasanas",
    slug: "yogasanas",
    priceLabel: "275€",
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
    experiences: [
      "A more open, comfortable body",
      "A settled, stable inner state",
    ],
  },
];

programs.sort(
  (a, b) => PROGRAM_ORDER.indexOf(a.slug) - PROGRAM_ORDER.indexOf(b.slug),
);

const docs = [];

const programDocs = programs.map((p) => ({
  title: p.title,
  slug: p.slug,
  shortIntro: p.shortIntro,
  whatIs: p.whatIs ?? [p.body[0]],
  aboutThePractice: p.aboutThePractice ?? [p.body[1]],
  benefits: p.benefits,
  practiceIndependently: defaultPracticeIndependently(p.title),
  privateAndGroupSessions: defaultPrivateAndGroupSessions(p.title),
  videoUrl: p.videoUrl,
  priceLabel: p.priceLabel,
}));

programDocs.forEach((p, i) => {
  docs.push({
    _id: `program-${p.slug}`,
    _type: "program",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    published: true,
    orderRank: (i + 1) * 10,
    shortIntro: p.shortIntro,
    whatIs: blocks(...p.whatIs),
    aboutThePractice: blocks(...p.aboutThePractice),
    benefits: p.benefits,
    practiceIndependently: blocks(...p.practiceIndependently),
    privateAndGroupSessions: blocks(...p.privateAndGroupSessions),
    ...(p.videoUrl ? { videoUrl: p.videoUrl } : {}),
    priceLabel: programPriceLabel(p.slug, p.priceLabel),
  });
});

docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  brandName: "Ananta Hatha Yoga",
  tagline: "Above all, balance.",
  description:
    "Ananta Hatha Yoga offers Classical Hatha Yoga in Saranda, Albania — practices taught in their traditional form to support clarity, balance, and inner stability. Classes are in-person.",
  email: "info@anantahathayoga.com",
  phone: "+355 69 939 1791",
  whatsapp: "355699391791",
  location: "Saranda, Albania",
});

docs.push({
  _id: "homePage",
  _type: "homePage",
  hero: {
    headline: "Classical Hatha Yoga",
    supportingText:
      "“Hatha Yoga is not body-bending business. It is about taking charge of the way you think, feel, and perceive life.” ― Sadhguru",
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
  featuredPrograms: [
    { _type: "reference", _key: key(), _ref: "program-surya-kriya" },
    { _type: "reference", _key: key(), _ref: "program-angamardana" },
    { _type: "reference", _key: key(), _ref: "program-yogasanas" },
    { _type: "reference", _key: key(), _ref: "program-bhuta-shuddhi" },
  ],
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
});

docs.push({
  _id: "aboutPage",
  _type: "aboutPage",
  title: "About Ananta Hatha Yoga",
  sections: [
    {
      _type: "aboutSection",
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
      _type: "aboutSection",
      title: "Isha Yoga Center",
      body: blocks(
        "Located at the foothills of the lush Velliangiri Mountains in Tamil Nadu, South India, the Isha Yoga Center is a sacred space for self-transformation dedicated to fostering inner transformation and creating an established state of wellbeing in individuals. The center offers all four major paths of yoga – kriya (energy), gnana (knowledge), karma (action), and bhakti (devotion), attracting people from all over the world. A large residential facility houses an active international community of monks, full-time volunteers, guests and visitors, making it a vibrant hub of spiritual growth and activity.",
      ),
    },
    {
      _type: "aboutSection",
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
      _type: "aboutSection",
      title: "Sadhguru",
      body: blocks(
        "Sadhguru is a yogi, mystic and visionary, and a prominent spiritual leader. An author, poet, and internationally-renowned speaker, Sadhguru's wit and piercing logic provoke and widen our perception of life. www.ishafoundation.org",
        "Yogi, mystic and visionary, Sadhguru is a spiritual master with a difference. An arresting blend of profundity and pragmatism, his life and work serve as a reminder that yoga is not an esoteric discipline from an outdated past, but a contemporary science, vitally relevant to our times. Probing, passionate and provocative, insightful, logical and unfailingly witty, Sadhguru's talks have earned him the reputation of a speaker and opinion-maker of international renown. With a celebratory engagement with life on all levels, Sadhguru's areas of active involvement encompass fields as diverse as architecture and visual design, poetry and painting, ecology and horticulture, music and sports. Sadhguru is also the founder of Isha Foundation, a non-profit organization which has been dedicated to the wellbeing of the individual and the world for the past three decades. Isha Foundation does not promote any particular ideology, religion, or race, but transmits inner sciences of universal appeal.",
      ),
    },
  ],
});

const legal = [
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    body: [
      "These Terms of Service govern your use of the Ananta Hatha Yoga website and participation in our in-person classes and programs. This is placeholder content to be reviewed and finalised before launch.",
      "By using this website or registering for a class, you agree to engage with the practices responsibly and to follow any guidance provided by the teacher. Classes are offered in person, and registration is confirmed personally.",
      "Please consult a qualified health professional before beginning any new practice if you have a medical condition.",
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    body: [
      "This Privacy Policy describes how Ananta Hatha Yoga handles the information you share with us. This is placeholder content to be reviewed and finalised before launch.",
      "When you contact us through the website, we collect only the details you provide — such as your name, email, phone number, and message — in order to respond to your enquiry. We do not sell your information.",
      "You may request access to or deletion of your information at any time by contacting us.",
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    body: [
      "This Cookie Policy explains how Ananta Hatha Yoga uses cookies and similar technologies. This is placeholder content to be reviewed and finalised before launch.",
      "This website aims to use only essential cookies needed for the site to function. Any analytics or additional cookies would be described here and used only with appropriate consent.",
    ],
  },
];

legal.forEach((l) => {
  docs.push({
    _id: `legal-${l.slug}`,
    _type: "legalPage",
    title: l.title,
    slug: { _type: "slug", current: l.slug },
    body: blocks(...l.body),
  });
});

// A couple of sample events (dates relative to generation time)
const now = new Date();
const inDays = (d) => {
  const date = new Date(now);
  date.setDate(date.getDate() + d);
  date.setHours(7, 0, 0, 0);
  return date.toISOString();
};

docs.push({
  _id: "event-sample-surya-kriya",
  _type: "event",
  title: "Surya Kriya — Morning Intensive",
  published: true,
  date: inDays(21),
  time: "7:00 - 9:00 AM",
  location: "Saranda, Albania",
  priceLabel: "Contact for details",
  teacher: "Erlinda Mustafaraj",
  category: "Workshop",
  relatedProgram: { _type: "reference", _ref: "program-surya-kriya" },
  description:
    "A focused morning session to learn and refine Surya Kriya in its classical form. Suitable for sincere beginners and returning practitioners.",
  whatsappEnabled: true,
});

docs.push({
  _id: "event-sample-intro",
  _type: "event",
  title: "Introduction to Classical Hatha Yoga",
  published: true,
  date: inDays(35),
  time: "6:00 - 7:30 PM",
  location: "Saranda, Albania",
  priceLabel: "Free",
  teacher: "Erlinda Mustafaraj",
  category: "Free Session",
  description:
    "An open evening to understand what Classical Hatha Yoga is, how it differs from fitness yoga, and how to begin.",
  whatsappEnabled: true,
});

// Surya Kriya — Saranda intensive (27-29 June 2026)
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.anantahathayoga.com";

const suryaKriyaProgram = programs.find((p) => p.slug === "surya-kriya");

const suryaKriyaEventDescription = [
  ...(suryaKriyaProgram?.aboutThePractice ?? []),
  "",
  "Benefits:",
  ...(suryaKriyaProgram?.benefits ?? []).map((benefit) => `\u2022 ${benefit}`),
  "",
  "Duration: 3 sessions / 2 hours.",
  "27 June: 4.30 pm – 6.30 pm",
  "28 June: 4.30 pm – 6.30 pm",
  "29 June: 4.30 pm – 6.30 pm",
].join("\n");

const suryaKriyaPaymentNote = "Payment details will be shared after registration.";

const suryaKriyaEventTime = [
  "27 June: 4.30 pm – 6.30 pm",
  "28 June: 4.30 pm – 6.30 pm",
  "29 June: 4.30 pm – 6.30 pm",
  "",
  "All 3 sessions are mandatory",
].join("\n");

docs.push({
  _id: "event-surya-kriya-saranda-jun-2026",
  _type: "event",
  title: "Surya Kriya",
  published: true,
  date: "2026-06-27T14:30:00.000Z",
  endDate: "2026-06-29T16:30:00.000Z",
  time: suryaKriyaEventTime,
  location: "Rruga Skenderbeu 31, 9701, Saranda",
  priceLabel: "150€",
  paymentNote: suryaKriyaPaymentNote,
  teacher: "Erlinda Mustafaraj",
  ageRequirement: "14+",
  category: "Workshop",
  relatedProgram: { _type: "reference", _ref: "program-surya-kriya" },
  description: suryaKriyaEventDescription,
  registrationLink: `${SITE_URL}/contact`,
  whatsappEnabled: false,
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, docs.map((d) => JSON.stringify(d)).join("\n") + "\n", "utf8");
console.log(`Wrote ${docs.length} documents to ${outPath}`);
