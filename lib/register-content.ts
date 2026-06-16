/**
 * Static content for the event registration form (6-step wizard).
 *
 * These texts, policies, and bank details are displayed verbatim to the user.
 * They live here (rather than Sanity) so they can be edited in one place in
 * code. Update the values below as needed.
 */

/* ------------------------------------------------------------------ */
/* Step 2 — Health-Related Information                                  */
/* ------------------------------------------------------------------ */

export const HEALTH_INTRO = [
  "(Please indicate below if you currently or previously have had any physical or mental ailments. If not, select 'NOT APPLICABLE')",
  "In case of any health condition, this information can help us to adapt the classes to your personal needs. This information is confidential. If required we can also discuss your personal needs in more detail on the phone.",
] as const;

export const HEALTH_CONDITIONS = [
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
] as const;

export const HEALTH_CONDITION_NOT_APPLICABLE = "NOT APPLICABLE";

export const HEALTH_DETAILS_LABEL =
  "If you have selected any of the above conditions, please give details of the nature and duration of the condition and if you are currently undergoing any treatment.";

export const MAJOR_SURGERY_QUESTION =
  "Have you had any major surgery in the last six months?";

export const MAJOR_SURGERY_HINT =
  "(If 'Yes', please give details of the nature and duration of the condition and if you are currently undergoing any treatment. Otherwise mention 'No' as your response)";

export const PREGNANCY_LABEL = "For women, are you currently pregnant?";

export const MEDICAL_DISCLAIMER_INTRO =
  "Please review the Medical Acknowledgement & Liability Disclaimer before proceeding:";

/**
 * Full Medical Acknowledgement & Liability Disclaimer document, shown in a
 * themed pop-up when the user clicks "Click Here".
 */
export interface DisclaimerItem {
  title: string;
  lead?: string;
  points?: readonly string[];
  contact?: { name: string; email: string };
}

export interface DisclaimerSection {
  symbol: string;
  title: string;
  intro?: string;
  items: readonly DisclaimerItem[];
}

export const MEDICAL_DISCLAIMER_DOCUMENT: readonly DisclaimerSection[] = [
  {
    symbol: "\uD83E\uDDD8\u200D\u2640\uFE0F",
    title: "Medical Acknowledgment & Liability Disclaimer",
    intro:
      "I hereby acknowledge that I fully understand the risks associated with participating in the program.",
    items: [
      {
        title: "Personal Responsibility & Physical / Mental Health",
        points: [
          "I understand that the program includes physical yoga practices which may involve stretching, movement, and stillness, and may aggravate existing injuries or physical or mental health conditions.",
          "I confirm that I am physically and mentally fit to participate in this program.",
          "I understand that it is my responsibility to consult a physician, psychologist, or other qualified healthcare professional before and during the program if needed, and to follow any advice provided.",
        ],
      },
      {
        title: "Self-Awareness & Personal Limits",
        points: [
          "I agree to listen to my body and respect my physical and mental limits at all times.",
          "I will stop or modify any practice if I experience discomfort, pain, or strain.",
          "If I have any existing or acute mental health condition, I confirm that I have consulted a qualified professional and will follow their guidance.",
        ],
      },
      {
        title: "No Medical or Performance Guarantees",
        points: [
          "I understand that participation in this yoga program does not constitute medical, psychological, or therapeutic treatment.",
          "No guarantees or promises are made regarding outcomes, results, or experiences.",
          "Any testimonials or shared experiences are for informational purposes only and do not represent guaranteed results.",
        ],
      },
      {
        title: "Liability Disclaimer",
        points: [
          "I voluntarily assume full responsibility for any risks, injuries, or damages, known or unknown, that may arise from my participation.",
          "I release the organizer from liability to the fullest extent permitted by law.",
          "This does not exclude liability for damages resulting from injury to life, body, or health caused by gross negligence or intentional misconduct.",
        ],
      },
    ],
  },
  {
    symbol: "\uD83D\uDD12",
    title: "GDPR / Data Protection Consent",
    intro: "Your privacy and personal data protection are important.",
    items: [
      {
        title: "Purpose of Data Processing",
        lead: "My personal data will be used only to:",
        points: [
          "Provide information about the yoga practices I have learned",
          "Inform me about future workshops, sessions, events, or special offers",
        ],
      },
      {
        title: "Storage & Sharing",
        points: [
          "My personal data will not be sold, shared, or transferred to third parties.",
        ],
      },
      {
        title: "Withdrawal & Deletion",
        points: [
          "I understand that I may withdraw my consent at any time with effect for the future.",
          "I have the right to request deletion of my personal data without any negative consequences.",
        ],
      },
      {
        title: "Data Controller Contact",
        lead: "The data controller responsible for processing is:",
        contact: {
          name: "Erlinda Mustafaraj",
          email: "info@anantahathayoga.com",
        },
      },
    ],
  },
];

export const MEDICAL_DISCLAIMER_BULLETS = [
  "I willingly undertake to attend the program in full;",
  "I take full responsibility for my participation and release the organizers from any claims or liabilities;",
  "I will not communicate the contents of the program, either directly or indirectly to anyone else.",
  "We reserve the right to all the program images, videos, text and may use it to create awareness about other programs.",
  "I confirm that all information provided by me is true and accurate and complete to the best of my knowledge.",
] as const;

export const MEDICAL_DISCLAIMER_CONSENT_LABEL =
  "I have read and agree to the Medical Acknowledgement and Liability Disclaimer";

/* ------------------------------------------------------------------ */
/* Step 4 — Agreement                                                  */
/* ------------------------------------------------------------------ */

export const REFUND_POLICY_BULLETS = [
  "No shows or Drop out or Missed sessions - No refunds or carry forward to next program are possible.",
  "No refunds for cancellations made within 7 days prior to the program start date.",
  "Cancellations made between 8-14 days before the program are eligible for a 50% refund, minus a 10% administrative fee.",
  "Cancellations made more than 14 days in advance are eligible for a full refund, minus a 10% administrative fee.",
] as const;

export const REFUND_POLICY_CONSENT_LABEL = "I have read and agree to the Refund Policy.";

export const PARTICIPANT_AGREEMENT_TITLE = "Participant Agreement & Consent Policy";

export const AGREEMENT_BULLETS = [
  "I willingly undertake to attend the program in full;",
  "I take full responsibility for my participation and release the organizers from any claims or liabilities;",
  "I will not communicate the contents of the program, either directly or indirectly to anyone else.",
  "I confirm that all information provided by me is true and accurate and complete to the best of my knowledge.",
  "We reserve the right to all the program images, videos, text and may use it to create awareness about other programs.",
] as const;

export const AGREEMENT_CONSENT_LABEL =
  "I have read and agree to the Participant Agreement & Consent Policy.";

/* ------------------------------------------------------------------ */
/* Step 5 — Payment Details                                            */
/* ------------------------------------------------------------------ */

export const BANK_DETAILS = [
  { label: "Account Holder Name", value: "Erlinda Mustafaraj" },
  { label: "Address", value: "Lagjia Zinxhira" },
  { label: "Street", value: "Celo Sinani, Hyrja 15, No. 2" },
  { label: "City", value: "Gjirokaster" },
  { label: "Country", value: "Albania" },
  { label: "Bank", value: "OTP Bank Albania" },
  { label: "Bank Address", value: "Lagjia 18 Shtatori, Gjirokaster, Albania" },
  { label: "IBAN", value: "AL54902612350231400665640806" },
  { label: "Swift Code", value: "PUPPALTR" },
] as const;

/* ------------------------------------------------------------------ */
/* Step 6 — Before the Start of the Session                            */
/* ------------------------------------------------------------------ */

export const BEFORE_SESSION_STOMACH = {
  title: "Empty or slightly full stomach",
  intro:
    "Please only come to class with an empty stomach and only practice at home once you have learned the entire practice \u2013 unless the particular practice specifically requires only a slightly full stomach.",
  empty: {
    heading: "Empty stomach means:",
    items: [
      "at least 4 hours after a meal",
      "at least 2.5 hours after a snack",
      "at least 1.5 hours after a drink (except water)",
    ],
  },
  light: {
    heading: "Light stomach means:",
    items: [
      "at least 2.5 hours after a meal",
      "at least 1.5 hours after a drink (except water)",
    ],
  },
} as const;

export const BEFORE_SESSION_CLOTHING = {
  title: "Clothing & Accessories",
  intro:
    "For the practice of classical Hatha Yoga, it is most beneficial to wear comfortable, loose-fitting clothing made of organic cotton. Please avoid wearing metallic jewelry during the exercises if possible.",
  heading: "For the course you only need:",
  items: ["a yoga mat", "a yoga cushion, if needed and available"],
} as const;

/* ------------------------------------------------------------------ */
/* Full Guidelines on What to Know Before, During and After the Program */
/* ------------------------------------------------------------------ */

export const BEFORE_PROGRAM_TITLE =
  "Full Guidelines on What to Know Before, During and After the Program";

export interface GuidelineList {
  label?: string;
  items: readonly string[];
}

export interface GuidelineBlock {
  heading: string;
  paragraphs?: readonly string[];
  lists?: readonly GuidelineList[];
}

export interface GuidelineSection {
  title: string;
  blocks: readonly GuidelineBlock[];
}

export const BEFORE_PROGRAM_DOCUMENT: readonly GuidelineSection[] = [
  {
    title: "Before the Start of Classes",
    blocks: [
      {
        heading: "Empty or slightly full stomach",
        paragraphs: [
          "Please attend the class on an empty stomach. Once you have learned the practice in its entirety, these guidelines should also be followed during your home practice unless the particular practice specifically requires a light-stomach condition only.",
        ],
        lists: [
          {
            label: "Empty stomach means:",
            items: [
              "at least 4 hours after a meal",
              "at least 2.5 hours after a snack",
              "at least 1.5 hours after a drink (except water)",
            ],
          },
          {
            label: "Light stomach means:",
            items: [
              "at least 2.5 hours after a meal",
              "at least 1.5 hours after a drink (except water)",
            ],
          },
        ],
      },
      {
        heading: "Clothing & Accessories",
        paragraphs: [
          "For the practice of Classical Hatha Yoga, it is most beneficial to wear comfortable, loose-fitting clothing made of organic cotton. Please avoid wearing metallic jewelry during the exercises, if possible.",
        ],
        lists: [
          {
            label: "For the course, you only need:",
            items: [
              "a yoga mat",
              "a yoga cushion, if needed to sit on the ground",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "During the Session",
    blocks: [
      {
        heading: "Punctuality",
        paragraphs: [
          "The course begins and ends on time. Doors open 30 minutes before the start, giving you plenty of time to settle in.",
          "Since each part of the practice builds on the previous one, participation after the course has started is unfortunately not possible.",
        ],
      },
      {
        heading: "Shoes, Bags & Phones",
        paragraphs: [
          "Please leave your shoes at the entrance and keep your personal belongings\u2014including your cell phone\u2014safely outside the practice room.",
          "Make sure your phone is completely silent (no sound, no vibration) so we can practice together in a quiet atmosphere.",
        ],
      },
      {
        heading: "Water",
        paragraphs: [
          "You are welcome to drink water before and after your session.",
          "Please refrain from drinking it during the session\u2014unless you are participating in a prenatal yoga class, in which case special considerations apply.",
        ],
      },
      {
        heading: "Mindfulness in the Classroom",
        paragraphs: [
          "Please pay full attention to every step of the practice. All instructions are carefully structured and important, so that you can practice safely and effectively at home later.",
          "We ask that you do not take notes during the class\u2014you will receive all important information in writing at the end of the last session.",
        ],
      },
      {
        heading: "Questions",
        paragraphs: [
          "At the end of each course unit, there will be time to ask questions. If something is unclear and prevents you from continuing comfortably, please let me know immediately. Otherwise, we kindly ask that questions be kept until the end of the session.",
        ],
      },
    ],
  },
  {
    title: "After Completion of the Program",
    blocks: [
      {
        heading: "Accompaniment & Support",
        paragraphs: [
          "Your learning does not end with the completion of the course. If questions arise during your practice, or if you need clarification, I am happy to support you.",
          "Please feel free to contact me at any time \u2013 by email at info@anantahathayoga.com or by WhatsApp at +355 69 939 1791.",
        ],
      },
      {
        heading: "Confidentiality of the Practice",
        paragraphs: [
          "The practices you learn will be taught in a specific way\u2014as defined by Sadhguru. The content of each lesson is precisely defined and may not be altered or shared.",
          "Please do not teach these practices yourself under any circumstances. A Classical Hatha Yoga teacher undergoes an intensive five-month training course at the Isha Yoga Center to become qualified.",
          "As Sadhguru says: \u201CA practice that can transform your life can also harm you if done incorrectly.\u201D Therefore, it is crucial that it is taught only by certified teachers.",
        ],
      },
      {
        heading: "Dignity of the Practice",
        paragraphs: [
          "The practices should be performed with mindfulness and respect. Please do not talk during practice or during an asana, and do not slip into a posture carelessly.",
          "Do not change any of the exercises \u2013 every movement, every sequence, has been consciously chosen and contributes to the effectiveness of the practice.",
        ],
      },
      {
        heading: "No Music During Practice",
        paragraphs: [
          "The practices are designed to direct your awareness inward. Therefore, please refrain from listening to music while practicing Classical Hatha Yoga.",
        ],
      },
      {
        heading: "Room Temperature",
        paragraphs: [
          "Please practice only in an environment with a temperature between 16\u201332 \u00B0C (60\u201389 \u00B0F). In this range, the practices can be fully effective.",
        ],
      },
      {
        heading: "Prana & Nutrition",
        paragraphs: [
          "A central aspect of this practice is raising the body's samat prana. To support this process, a balanced and conscious diet is recommended.",
          "Foods and habits that promote clarity, vitality, and wellbeing naturally support the process and help maintain the benefits of the practice.",
        ],
      },
    ],
  },
];
