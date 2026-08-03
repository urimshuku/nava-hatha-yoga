/**
 * Generates seed/seed.ndjson from structured content so the Studio can be
 * populated in one command. Run with: node scripts/generate-seed.mjs
 * Then import with: npm run seed
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../seed/seed.ndjson");
const legalContent = JSON.parse(
  readFileSync(resolve(__dirname, "../lib/legal-content.json"), "utf8"),
);

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;

/**
 * Reference a local file so `sanity dataset import` uploads it as an asset.
 * Path is relative to the repository's public/ folder.
 */
function imageAsset(publicPath, alt) {
  return {
    _type: "imageWithAlt",
    _sanityAsset: `image@file://${resolve(__dirname, "../public", publicPath)}`,
    ...(alt ? { alt } : {}),
  };
}

function blocks(...paragraphs) {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
}

function sectionsToBlocks(sections) {
  return sections.map((section) => ({
    _type: "block",
    _key: key(),
    style: section.type === "h2" ? "h2" : "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text: section.text, marks: [] }],
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
  "childrens-program": "150€",
  "eye-care-practices": "55€",
  "jala-neti": "55€",
  pavanamuktasana: "55€",
  "shanmukhi-mudra": "55€",
  "surya-kriya": "150€",
  "surya-shakti": "95€",
  thoppukarnam: "55€",
  "upa-yoga": "150€",
  yogasanas: "220€",
};

const PROGRAM_ORDER = [
  "upa-yoga",
  "surya-kriya",
  "surya-shakti",
  "yogasanas",
  "angamardana",
  "bhuta-shuddhi",
  "childrens-program",
  "bhastrika-kriya",
  "jala-neti",
  "thoppukarnam",
  "shanmukhi-mudra",
  "eye-care-practices",
  "pavanamuktasana",
];

const MAIN_PROGRAM_SLUGS = [
  "upa-yoga",
  "surya-kriya",
  "surya-shakti",
  "yogasanas",
  "angamardana",
  "bhuta-shuddhi",
  "childrens-program",
];

const PROGRAM_IMAGES = {
  angamardana: "images/programs/angamardana.webp",
  "bhastrika-kriya": "images/programs/bhastrika-kriya.jpg",
  "bhuta-shuddhi": "images/programs/bhuta-shuddhi.webp",
  "childrens-program": "images/programs/childrens-program.jpg",
  "eye-care-practices": "images/programs/eye-care-practices.webp",
  "jala-neti": "images/programs/jala-neti.jpg",
  pavanamuktasana: "images/programs/pavanamuktasana.webp",
  "shanmukhi-mudra": "images/programs/shanmukhi-mudra.webp",
  "surya-kriya": "images/programs/surya-kriya.webp",
  "surya-shakti": "images/programs/surya-shakti.webp",
  thoppukarnam: "images/programs/thoppukarnam.webp",
  "upa-yoga": "images/programs/upa-yoga.jpg",
  yogasanas: "images/programs/yogasanas.webp",
};

const PROGRAM_VIDEO_TITLES = {
  angamardana: "Sadhguru speaks on Angamardana",
  "bhuta-shuddhi": "Bhuta Shuddhi — The Ultimate Cleansing",
};

const DEFAULT_BEFORE_PROGRAM_NOTES = [
  "This practice does not require prior yoga experience.",
];

const PROGRAM_BEFORE_PROGRAM_NOTES = {
  angamardana: [
    "This practice does not require prior yoga experience.",
    "Those who are pregnant, recovering from surgery, or managing chronic injuries should speak with the teacher before registering.",
  ],
  "eye-care-practices": [
    "Must have learned any of the following programs such as: Surya Kriya, Surya Shakti, Yogasanas, Angamardana or full Upa-Yoga (not taught online or in Inner Engineering).",
  ],
  "jala-neti": [
    "Must have learned any of the following programs such as: Surya Kriya, Surya Shakti, Yogasanas, Angamardana.",
  ],
};

const PROGRAM_BEFORE_PROGRAM_TITLES = {
  "eye-care-practices": "Pre-Requisite",
  "jala-neti": "Pre-Requisite",
};

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
    title: "Children's Program",
    slug: "childrens-program",
    priceLabel: "150€",
    shortIntro:
      "A unique possibility for every child to experience a joyful blossoming of their natural potential. The program introduces yoga to children, led through an exploration of fun, love and joy.",
    body: [
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
    experiences: ["A grounded, balanced state", "Steady energy through the day"],
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
    title: "Upa Yoga",
    slug: "upa-yoga",
    priceLabel: "150€",
    videoUrl: "https://youtu.be/tVZcK9pjI9I?si=gePcv9RJXXMO2TGA",
    shortIntro:
      "A simple yet powerful system of practice that activates the joints, muscle and energy system.",
    body: [
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
    experiences: ["A grounded, balanced state", "Steady energy through the day"],
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
    videoUrl: "https://www.youtube.com/watch?v=OBds5NZ4PRs",
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
  const beforeNotes =
    PROGRAM_BEFORE_PROGRAM_NOTES[p.slug] ?? DEFAULT_BEFORE_PROGRAM_NOTES;
  const beforeTitle = PROGRAM_BEFORE_PROGRAM_TITLES[p.slug];
  const imagePath = PROGRAM_IMAGES[p.slug];
  const videoTitle = PROGRAM_VIDEO_TITLES[p.slug];

  docs.push({
    _id: `program-${p.slug}`,
    _type: "program",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    published: true,
    category: MAIN_PROGRAM_SLUGS.includes(p.slug) ? "main" : "special",
    orderRank: (i + 1) * 10,
    ...(imagePath ? { image: imageAsset(imagePath, p.title) } : {}),
    shortIntro: p.shortIntro,
    whatIs: blocks(...p.whatIs),
    aboutThePractice: blocks(...p.aboutThePractice),
    benefits: p.benefits,
    ...(beforeTitle ? { beforeProgramTitle: beforeTitle } : {}),
    beforeProgramNotes: beforeNotes,
    practiceIndependently: blocks(...p.practiceIndependently),
    privateAndGroupSessions: blocks(...p.privateAndGroupSessions),
    ...(p.videoUrl ? { videoUrl: p.videoUrl } : {}),
    ...(videoTitle ? { videoTitle } : {}),
    priceLabel: programPriceLabel(p.slug, p.priceLabel),
  });
});

docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  brandName: "Nava Hatha Yoga",
  tagline: "In balance, life unfolds.",
  description:
    "Nava Hatha Yoga offers Classical Hatha Yoga in Saranda, Albania — practices taught in their traditional form to support clarity, balance, and inner stability. Classes are in-person.",
  email: "info@navahathayoga.com",
  phone: "+355 69 939 1791",
  whatsapp: "355699391791",
  location: "Saranda, Albania",
  beforeProgramNotes: DEFAULT_BEFORE_PROGRAM_NOTES,
  medicalNotice:
    "These practices are offered as complementary tools for wellbeing and inner balance. Please consult your physician if you have any medical condition or concern.",
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
    { _type: "reference", _key: key(), _ref: "program-upa-yoga" },
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
      "Nava Hatha Yoga is dedicated to offering Classical Hatha Yoga with sincerity and respect for the tradition. Classes are held in person in Saranda, Albania, and are open to both beginners and committed practitioners.",
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
  title: "Classical Hatha Yoga, taught with care.",
  teacherStory: {
    nameLine: "My name is Linda.",
    photo: imageAsset(
      "images/about/teacher-linda.png",
      "Linda, Classical Hatha Yoga teacher at Nava Hatha Yoga",
    ),
    teaser: [
      "What began as a personal journey, over 10 years of lived experience and teaching at Isha Yoga Center in India, has naturally become a longing to share across the world Classical Hatha Yoga in its purest form.",
    ],
    storyTitle: "My Full Story",
    story: [
      "Is there something more to life than simply getting through it?",
      "This question has been with me for as long as I can remember and, in many ways, has shaped the course of my life.",
      "While studying Mathematics and Physics, and later building a career in teaching and international infrastructure projects (World Bank, EBRD, EIB), I was always looking for something more—not more achievement or success, but a more balanced and deeper way of experiencing life.",
      "That search led me through martial arts (karate, kung fu, tai chi), extensive travel, and the exploration of different traditions and philosophies. Looking for their roots eventually brought me to Yoga and its place of origin, India.",
      "It was at the Isha Yoga Center in Coimbatore, South India, that I found the authentic and scientific approach I had been searching for. To immerse myself fully in it, I underwent over 1,750 hours of intensive Classical Hatha Yoga Teacher Training under Sadhguru Gurukulam.",
      "What began as a personal exploration grew into nearly 10 years of full time volunteering, learning and living within the ashram environment alongside many volunteers, senior teachers and monks.",
      "During this time, I had the privilege of offering the practices I had received and supporting more than 6,000 participants from around the world through programs such as Sadhanapada and Isha Health Solutions.",
      "Over the years, I witnessed how these practices touched the lives of countless people, bringing in them greater balance, joy, and aliveness.",
      "There is no greater fulfillment I have experienced than that.",
      "Gradually, I realised that what I had been searching for was not somewhere else or sometime in the future, but a different way of experiencing life itself.",
      "For this, these practices became the foundation I had been longing all along.",
      "Today, ten years later, practicing them remains at the heart of my daily life—the transformation and their impact continues to shape the way I experience life every moment.",
      "This is where my longing to share these tools with more and more people comes from.",
      "Today, I continue to teach not because I believe everyone should follow the same path I did, but because I believe every human being deserves access to tools that help them experience more of life and more of themselves.",
      "Not merely to get through life, but to live it more fully and allow what is best within them to find expression.",
    ],
  },
  sections: [
    {
      _type: "aboutSection",
      _key: key(),
      title: "Isha Hatha Yoga Teacher Training",
      image: imageAsset(
        "images/about/isha-hatha-yoga-teacher-training.jpg",
        "Isha Hatha Yoga Teacher Training",
      ),
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
      _key: key(),
      title: "Isha Yoga Center",
      image: imageAsset("images/about/isha-yoga-center.jpg", "Isha Yoga Center"),
      body: blocks(
        "Located at the foothills of the lush Velliangiri Mountains in Tamil Nadu, South India, the Isha Yoga Center is a sacred space for self-transformation dedicated to fostering inner transformation and creating an established state of wellbeing in individuals. The center offers all four major paths of yoga – kriya (energy), gnana (knowledge), karma (action), and bhakti (devotion), attracting people from all over the world. A large residential facility houses an active international community of monks, full-time volunteers, guests and visitors, making it a vibrant hub of spiritual growth and activity.",
      ),
    },
    {
      _type: "aboutSection",
      _key: key(),
      title: "Isha Foundation",
      image: imageAsset("images/about/isha-foundation.jpg", "Isha Foundation"),
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
      _key: key(),
      title: "Sadhguru",
      image: imageAsset("images/about/sadhguru.jpg", "Sadhguru"),
      body: blocks(
        "Sadhguru is a yogi, mystic and visionary, and a prominent spiritual leader. An author, poet, and internationally-renowned speaker, Sadhguru's wit and piercing logic provoke and widen our perception of life. www.ishafoundation.org",
        "Yogi, mystic and visionary, Sadhguru is a spiritual master with a difference. An arresting blend of profundity and pragmatism, his life and work serve as a reminder that yoga is not an esoteric discipline from an outdated past, but a contemporary science, vitally relevant to our times. Probing, passionate and provocative, insightful, logical and unfailingly witty, Sadhguru's talks have earned him the reputation of a speaker and opinion-maker of international renown. With a celebratory engagement with life on all levels, Sadhguru's areas of active involvement encompass fields as diverse as architecture and visual design, poetry and painting, ecology and horticulture, music and sports. Sadhguru is also the founder of Isha Foundation, a non-profit organization which has been dedicated to the wellbeing of the individual and the world for the past three decades. Isha Foundation does not promote any particular ideology, religion, or race, but transmits inner sciences of universal appeal.",
      ),
    },
  ],
});

const legal = Object.values(legalContent);

legal.forEach((l) => {
  docs.push({
    _id: `legal-${l.slug}`,
    _type: "legalPage",
    title: l.title,
    slug: { _type: "slug", current: l.slug },
    body: sectionsToBlocks(l.sections),
  });
});

docs.push({
  _id: "contactPage",
  _type: "contactPage",
  heroTitle: "Get in touch",
  heroDescription:
    "For questions regarding upcoming programs, private instruction, or general inquiries, please leave a message below.",
  formHeading: "Send a message",
  quickMessageBody:
    "Prefer WhatsApp? Reach out directly and we'll reply as soon as we can.",
  whatsappPrefill: "Hello, I'd like to know more about your classes.",
});

docs.push({
  _id: "retreatsPage",
  _type: "retreatsPage",
  heroTitle: "Immersive retreats",
  heroDescription:
    "Immersive weekends in quiet settings — devoted to Classical Hatha Yoga, sattvic meals and time in nature.",
  comingSoonHeading: "Retreats are on their way",
  comingSoonBody:
    "We are carefully preparing immersive Classical Hatha Yoga retreats. If you would like to be among the first to hear when dates are announced, please register your interest.",
  expectationsHeading: "An invitation to go deeper",
  expectations: [
    {
      _key: key(),
      title: "Immersive practice",
      body: "Extended, unhurried time with the practices, away from the demands of everyday life.",
    },
    {
      _key: key(),
      title: "Calm surroundings",
      body: "A quiet, supportive setting designed to help the body and mind settle.",
    },
    {
      _key: key(),
      title: "Guided learning",
      body: "Careful, attentive guidance in the Classical Hatha Yoga practices, in their original form.",
    },
  ],
});

function guidelineList(label, items) {
  return { _type: "guidelineList", _key: key(), label, items };
}

function guidelineBlock(heading, paragraphs, lists) {
  return {
    _type: "guidelineBlock",
    _key: key(),
    heading,
    ...(paragraphs ? { paragraphs } : {}),
    ...(lists ? { lists } : {}),
  };
}

function guidelineSection(title, blocks) {
  return { _type: "guidelineSection", _key: key(), title, blocks };
}

function disclaimerItem(title, { lead, points, contactName, contactEmail } = {}) {
  return {
    _type: "disclaimerItem",
    _key: key(),
    title,
    ...(lead ? { lead } : {}),
    ...(points ? { points } : {}),
    ...(contactName ? { contactName } : {}),
    ...(contactEmail ? { contactEmail } : {}),
  };
}

function disclaimerSection(title, intro, items) {
  return { _type: "disclaimerSection", _key: key(), title, intro, items };
}

docs.push({
  _id: "registerPage",
  _type: "registerPage",
  healthIntro: [
    "(Please indicate below if you currently or previously have had any physical or mental ailments. If not, select 'NOT APPLICABLE')",
    "In case of any health condition, this information can help us to adapt the classes to your personal needs. This information is confidential. If required we can also discuss your personal needs in more detail on the phone.",
  ],
  healthConditions: [
    "Any physical disabilities",
    "Asthma/ Respiratory conditions",
    "Allergy",
    "Neck/ Back aches/ injuries",
    "Joint-related issues",
    "Ligament injuries",
    "Spinal conditions",
    "Bowel/ Bladder issues",
    "Communicable disease",
    "Chronic pain",
    "Retinal detachment/ eye surgery",
  ],
  healthDetailsLabel:
    "If you have selected any of the above conditions, please give details of the nature and duration of the condition and if you are currently undergoing any treatment.",
  majorSurgeryQuestion: "Have you had any major surgery in the last six months?",
  majorSurgeryHint:
    "(If 'Yes', please give details of the nature and duration of the condition and if you are currently undergoing any treatment. Otherwise mention 'No' as your response)",
  pregnancyLabel: "For women, are you currently pregnant?",
  disclaimerTitle:
    "Medical Acknowledgement and Liability Disclaimer and GDPR/Data Protection Consent",
  disclaimerDocument: [
    disclaimerSection(
      "Medical Acknowledgment & Liability Disclaimer",
      "I hereby acknowledge that I fully understand the risks associated with participating in the program.",
      [
        disclaimerItem("Personal Responsibility & Physical / Mental Health", {
          points: [
            "I understand that the program includes physical yoga practices which may involve stretching, movement, and stillness, and may aggravate existing injuries or physical or mental health conditions.",
            "I confirm that I am physically and mentally fit to participate in this program.",
            "I understand that it is my responsibility to consult a physician, psychologist, or other qualified healthcare professional before and during the program if needed, and to follow any advice provided.",
          ],
        }),
        disclaimerItem("Self-Awareness & Personal Limits", {
          points: [
            "I agree to listen to my body and respect my physical and mental limits at all times.",
            "I will stop or modify any practice if I experience discomfort, pain, or strain.",
            "If I have any existing or acute mental health condition, I confirm that I have consulted a qualified professional and will follow their guidance.",
          ],
        }),
        disclaimerItem("No Medical or Performance Guarantees", {
          points: [
            "I understand that participation in this yoga program does not constitute medical, psychological, or therapeutic treatment.",
            "No guarantees or promises are made regarding outcomes, results, or experiences.",
            "Any testimonials or shared experiences are for informational purposes only and do not represent guaranteed results.",
          ],
        }),
        disclaimerItem("Liability Disclaimer", {
          points: [
            "I voluntarily assume full responsibility for any risks, injuries, or damages, known or unknown, that may arise from my participation.",
            "I release the organizer from liability to the fullest extent permitted by law.",
            "This does not exclude liability for damages resulting from injury to life, body, or health caused by gross negligence or intentional misconduct.",
          ],
        }),
      ],
    ),
    disclaimerSection(
      "GDPR / Data Protection Consent",
      "Your privacy and personal data protection are important.",
      [
        disclaimerItem("Purpose of Data Processing", {
          lead: "My personal data will be used only to:",
          points: [
            "Provide information about the yoga practices I have learned",
            "Inform me about future workshops, sessions, events, or special offers",
          ],
        }),
        disclaimerItem("Storage & Sharing", {
          points: [
            "My personal data will not be sold, shared, or transferred to third parties.",
          ],
        }),
        disclaimerItem("Withdrawal & Deletion", {
          points: [
            "I understand that I may withdraw my consent at any time with effect for the future.",
            "I have the right to request deletion of my personal data without any negative consequences.",
          ],
        }),
        disclaimerItem("Data Controller Contact", {
          lead: "The data controller responsible for processing is:",
          contactName: "Erlinda Mustafaraj",
          contactEmail: "info@navahathayoga.com",
        }),
      ],
    ),
  ],
  disclaimerBullets: [
    "I willingly undertake to attend the program in full;",
    "I take full responsibility for my participation and release the organizers from any claims or liabilities;",
    "I will not communicate the contents of the program, either directly or indirectly to anyone else.",
    "We reserve the right to all the program images, videos, text and may use it to create awareness about other programs.",
    "I confirm that all information provided by me is true and accurate and complete to the best of my knowledge.",
  ],
  disclaimerConsentLabel:
    "I have read and agree to the Medical Acknowledgement and Liability Disclaimer and GDPR/Data Protection Consent",
  refundPolicyBullets: [
    "No shows or Drop out or Missed sessions - No refunds or carry forward to next program are possible.",
    "No refunds for cancellations made within 7 days prior to the program start date.",
    "Cancellations made between 8-14 days before the program are eligible for a 50% refund, minus a 10% administrative fee.",
    "Cancellations made more than 14 days in advance are eligible for a full refund, minus a 10% administrative fee.",
  ],
  refundPolicyConsentLabel: "I have read and agree to the Refund Policy.",
  agreementTitle: "Participant Agreement & Consent Policy",
  agreementBullets: [
    "I willingly undertake to attend the program in full;",
    "I take full responsibility for my participation and release the organizers from any claims or liabilities;",
    "I will not communicate the contents of the program, either directly or indirectly to anyone else.",
    "I confirm that all information provided by me is true and accurate and complete to the best of my knowledge.",
    "We reserve the right to all the program images, videos, text and may use it to create awareness about other programs.",
  ],
  agreementConsentLabel:
    "I have read and agree to the Participant Agreement & Consent Policy.",
  beforeSessionBlocks: [
    guidelineBlock(
      "Empty or slightly full stomach",
      [
        "Please only come to class with an empty stomach and only practice at home once you have learned the entire practice – unless the particular practice specifically requires only a slightly full stomach.",
      ],
      [
        guidelineList("Empty stomach means:", [
          "at least 4 hours after a meal",
          "at least 2.5 hours after a snack",
          "at least 1.5 hours after a drink (except water)",
        ]),
        guidelineList("Light stomach means:", [
          "at least 2.5 hours after a meal",
          "at least 1.5 hours after a drink (except water)",
        ]),
      ],
    ),
    guidelineBlock(
      "Clothing & Accessories",
      [
        "For the practice of classical Hatha Yoga, it is most beneficial to wear comfortable, loose-fitting clothing made of organic cotton. Please avoid wearing metallic jewelry during the exercises if possible.",
      ],
      [
        guidelineList("For the course you only need:", [
          "a yoga mat",
          "a yoga cushion, if needed and available",
        ]),
      ],
    ),
  ],
  guidelinesTitle:
    "Full Guidelines on What to Know Before, During and After the Program",
  guidelinesDocument: [
    guidelineSection("Before the Start of Classes", [
      guidelineBlock(
        "Empty or slightly full stomach",
        [
          "Please attend the class on an empty stomach. Once you have learned the practice in its entirety, these guidelines should also be followed during your home practice unless the particular practice specifically requires a light-stomach condition only.",
        ],
        [
          guidelineList("Empty stomach means:", [
            "at least 4 hours after a meal",
            "at least 2.5 hours after a snack",
            "at least 1.5 hours after a drink (except water)",
          ]),
          guidelineList("Light stomach means:", [
            "at least 2.5 hours after a meal",
            "at least 1.5 hours after a drink (except water)",
          ]),
        ],
      ),
      guidelineBlock(
        "Clothing & Accessories",
        [
          "For the practice of Classical Hatha Yoga, it is most beneficial to wear comfortable, loose-fitting clothing made of organic cotton. Please avoid wearing metallic jewelry during the exercises, if possible.",
        ],
        [
          guidelineList("For the course, you only need:", [
            "a yoga mat",
            "a yoga cushion, if needed to sit on the ground",
          ]),
        ],
      ),
    ]),
    guidelineSection("During the Session", [
      guidelineBlock("Punctuality", [
        "The course begins and ends on time. Doors open 30 minutes before the start, giving you plenty of time to settle in.",
        "Since each part of the practice builds on the previous one, participation after the course has started is unfortunately not possible.",
      ]),
      guidelineBlock("Shoes, Bags & Phones", [
        "Please leave your shoes at the entrance and keep your personal belongings—including your cell phone—safely outside the practice room.",
        "Make sure your phone is completely silent (no sound, no vibration) so we can practice together in a quiet atmosphere.",
      ]),
      guidelineBlock("Water", [
        "You are welcome to drink water before and after your session.",
        "Please refrain from drinking it during the session—unless you are participating in a prenatal yoga class, in which case special considerations apply.",
      ]),
      guidelineBlock("Mindfulness in the Classroom", [
        "Please pay full attention to every step of the practice. All instructions are carefully structured and important, so that you can practice safely and effectively at home later.",
        "We ask that you do not take notes during the class—you will receive all important information in writing at the end of the last session.",
      ]),
      guidelineBlock("Questions", [
        "At the end of each course unit, there will be time to ask questions. If something is unclear and prevents you from continuing comfortably, please let me know immediately. Otherwise, we kindly ask that questions be kept until the end of the session.",
      ]),
    ]),
    guidelineSection("After Completion of the Program", [
      guidelineBlock("Accompaniment & Support", [
        "Your learning does not end with the completion of the course. If questions arise during your practice, or if you need clarification, I am happy to support you.",
        "Please feel free to contact me at any time – by email at info@navahathayoga.com or by WhatsApp at +355 69 939 1791.",
      ]),
      guidelineBlock("Confidentiality of the Practice", [
        "The practices you learn will be taught in a specific way—as defined by Sadhguru. The content of each lesson is precisely defined and may not be altered or shared.",
        "Please do not teach these practices yourself under any circumstances. A Classical Hatha Yoga teacher undergoes an intensive five-month training course at the Isha Yoga Center to become qualified.",
        "As Sadhguru says: “A practice that can transform your life can also harm you if done incorrectly.” Therefore, it is crucial that it is taught only by certified teachers.",
      ]),
      guidelineBlock("Dignity of the Practice", [
        "The practices should be performed with mindfulness and respect. Please do not talk during practice or during an asana, and do not slip into a posture carelessly.",
        "Do not change any of the exercises – every movement, every sequence, has been consciously chosen and contributes to the effectiveness of the practice.",
      ]),
      guidelineBlock("No Music During Practice", [
        "The practices are designed to direct your awareness inward. Therefore, please refrain from listening to music while practicing Classical Hatha Yoga.",
      ]),
      guidelineBlock("Room Temperature", [
        "Please practice only in an environment with a temperature between 16–32 °C (60–89 °F). In this range, the practices can be fully effective.",
      ]),
      guidelineBlock("Prana & Nutrition", [
        "A central aspect of this practice is raising the body's samat prana. To support this process, a balanced and conscious diet is recommended.",
        "Foods and habits that promote clarity, vitality, and wellbeing naturally support the process and help maintain the benefits of the practice.",
      ]),
    ]),
  ],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://navahathayoga.com";

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

function toEventDate(year, month, day, endOfSession = false) {
  const hour = endOfSession ? 16 : 14;
  return new Date(Date.UTC(year, month - 1, day, hour, 30, 0, 0)).toISOString();
}

const EVENT_TIMEZONE = "Europe/Tirane";

const MONTH_TO_INDEX = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const SESSION_LINE_RE =
  /^(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+(\d{4}))?\s*:\s*(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/i;

function zonedLocalToUtcMs(year, month, day, hour, minute, timeZone = EVENT_TIMEZONE) {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    dtf
      .formatToParts(new Date(utcGuess))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const reconstructed = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second ?? "0"),
  );

  return utcGuess - (reconstructed - utcGuess);
}

function parseSessionLine(match, defaultYear) {
  const month = MONTH_TO_INDEX[match[2].toLowerCase()] + 1;
  return {
    year: match[3] ? Number(match[3]) : defaultYear,
    month,
    day: Number(match[1]),
    startHour: Number(match[4]),
    startMinute: Number(match[5]),
    endHour: Number(match[6]),
    endMinute: Number(match[7]),
  };
}

function sessionBoundaryFromSchedule(time, defaultYear) {
  let first = null;
  let last = null;

  for (const rawLine of time.split("\n")) {
    const match = rawLine.trim().match(SESSION_LINE_RE);
    if (!match) continue;

    const parsed = parseSessionLine(match, defaultYear);
    if (!first) first = parsed;
    last = parsed;
  }

  if (!first || !last) return null;

  return {
    date: new Date(
      zonedLocalToUtcMs(first.year, first.month, first.day, first.startHour, first.startMinute),
    ).toISOString(),
    endDate: new Date(
      zonedLocalToUtcMs(last.year, last.month, last.day, last.endHour, last.endMinute),
    ).toISOString(),
  };
}

function resolveEventDates(event, time) {
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

function buildSessionSchedule(startDay, endDay, month) {
  const monthName = MONTH_NAMES[month - 1];
  const sessionLines = [];
  for (let day = startDay; day <= endDay; day++) {
    sessionLines.push(`${day} ${monthName}: 16:30 – 18:30`);
  }
  const sessionCount = endDay - startDay + 1;
  const time = [...sessionLines, "", `All ${sessionCount} sessions are mandatory`].join("\n");
  return { sessionLines, sessionCount, time };
}

function buildEventDescription(program, sessionLines, sessionCount, durationLabel) {
  return [
    ...(program?.aboutThePractice ?? []),
    "",
    "Benefits:",
    ...(program?.benefits ?? []).map((benefit) => `\u2022 ${benefit}`),
    "",
    `Duration: ${durationLabel ?? `${sessionCount} sessions / 2 hours.`}`,
    ...sessionLines,
  ].join("\n");
}

function resolveEventSchedule(event) {
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

const scheduledEvents = [
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
    startDay: 4,
    endDay: 6,
    ageRequirement: "14+",
    priceLabel: "170€",
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

scheduledEvents.forEach((event) => {
  const program = programs.find((p) => p.slug === event.programSlug);
  const { sessionLines, sessionCount, time, durationLabel } = resolveEventSchedule(event);
  const { date, endDate } = resolveEventDates(event, time);

  docs.push({
    _id: `event-${event.id}`,
    _type: "event",
    title: event.title,
    published: true,
    date,
    endDate,
    time,
    location: event.location ?? eventLocation,
    priceLabel: event.priceLabel ?? programPriceLabel(event.programSlug, program?.priceLabel),
    paymentNote: eventPaymentNote,
    teacher: "Erlinda Mustafaraj",
    ...(event.ageRequirement ? { ageRequirement: event.ageRequirement } : {}),
    category: "Workshop",
    relatedProgram: { _type: "reference", _ref: `program-${event.programSlug}` },
    description: buildEventDescription(program, sessionLines, sessionCount, durationLabel),
    registrationLink: `${SITE_URL}/contact`,
    whatsappEnabled: false,
  });
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, docs.map((d) => JSON.stringify(d)).join("\n") + "\n", "utf8");
console.log(`Wrote ${docs.length} documents to ${outPath}`);
