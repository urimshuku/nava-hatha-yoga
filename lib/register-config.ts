/**
 * Resolves the registration form copy: CMS content layered over the built-in
 * defaults from `lib/register-content.ts`.
 */

import {
  AGREEMENT_BULLETS,
  AGREEMENT_CONSENT_LABEL,
  BEFORE_PROGRAM_DOCUMENT,
  BEFORE_PROGRAM_TITLE,
  BEFORE_SESSION_CLOTHING,
  BEFORE_SESSION_STOMACH,
  HEALTH_CONDITION_NOT_APPLICABLE,
  HEALTH_CONDITIONS,
  HEALTH_DETAILS_LABEL,
  HEALTH_INTRO,
  MAJOR_SURGERY_HINT,
  MAJOR_SURGERY_QUESTION,
  MEDICAL_DISCLAIMER_BULLETS,
  MEDICAL_DISCLAIMER_CONSENT_LABEL,
  MEDICAL_DISCLAIMER_DOCUMENT,
  MEDICAL_DISCLAIMER_INTRO,
  MEDICAL_DISCLAIMER_TITLE,
  PARTICIPANT_AGREEMENT_TITLE,
  PREGNANCY_LABEL,
  REFUND_POLICY_BULLETS,
  REFUND_POLICY_CONSENT_LABEL,
  type DisclaimerSection,
  type GuidelineBlock,
  type GuidelineSection,
} from "@/lib/register-content";
import type {
  DisclaimerSectionData,
  GuidelineBlockData,
  GuidelineSectionData,
  HowHeardGroupData,
  RegisterFormFieldData,
  RegisterInputType,
  RegisterPage,
  RegisterStepData,
} from "@/lib/cms/content-types";
import type { RegistrationKind } from "@/lib/registration-kind";
import { slugifySegment } from "@/lib/utils";

export type RegisterInputKind = RegisterInputType;

export interface RegisterFormField {
  key: string;
  label: string;
  required?: boolean;
  type: RegisterInputKind;
  options?: readonly string[];
  placeholder?: string;
}

export interface HowHeardGroup {
  heading: string;
  options: readonly string[];
}

export type RegisterStepKind =
  | "personal"
  | "health"
  | "program"
  | "agreement"
  | "guidelines"
  | "fields";

export interface RegisterStep {
  kind: RegisterStepKind;
  title: string;
  fields?: readonly RegisterFormField[];
  emergencyHeading?: string;
  emergencyFields?: readonly RegisterFormField[];
  healthIntro?: readonly string[];
  healthConditionsLegend?: string;
  healthConditions?: readonly string[];
  otherConditionLabel?: string;
  notApplicableLabel?: string;
  specifyPlaceholder?: string;
  healthDetailsLabel?: string;
  majorSurgeryQuestion?: string;
  majorSurgeryHint?: string;
  pregnancyLabel?: string;
  yesLabel?: string;
  noLabel?: string;
  disclaimerIntro?: string;
  disclaimerLinkLabel?: string;
  disclaimerConfirmLead?: string;
  disclaimerTitle?: string;
  disclaimerDocument?: readonly DisclaimerSection[];
  disclaimerBullets?: readonly string[];
  disclaimerConsentLabel?: string;
  howHeardLabel?: string;
  howHeardGroups?: readonly HowHeardGroup[];
  howHeardOtherLabel?: string;
  priorPracticeLabel?: string;
  otherIshaLabel?: string;
  otherIshaDetailsLabel?: string;
  refundPolicyTitle?: string;
  refundPolicyBullets?: readonly string[];
  refundPolicyConsentLabel?: string;
  agreementTitle?: string;
  agreementBullets?: readonly string[];
  agreementConsentLabel?: string;
  beforeSessionBlocks?: readonly GuidelineBlock[];
  guidelinesPrompt?: string;
  guidelinesReadLabel?: string;
  guidelinesDownloadLabel?: string;
  guidelinesTitle?: string;
  guidelinesDocument?: readonly GuidelineSection[];
}

export interface RegisterContent {
  steps: readonly RegisterStep[];
  step1Title: string;
  personalFields: readonly RegisterFormField[];
  emergencyHeading: string;
  emergencyFields: readonly RegisterFormField[];
  step2Title: string;
  healthIntro: readonly string[];
  healthConditionsLegend: string;
  healthConditions: readonly string[];
  otherConditionLabel: string;
  notApplicableLabel: string;
  specifyPlaceholder: string;
  healthDetailsLabel: string;
  majorSurgeryQuestion: string;
  majorSurgeryHint: string;
  pregnancyLabel: string;
  yesLabel: string;
  noLabel: string;
  disclaimerIntro: string;
  disclaimerLinkLabel: string;
  disclaimerConfirmLead: string;
  disclaimerTitle: string;
  disclaimerDocument: readonly DisclaimerSection[];
  disclaimerBullets: readonly string[];
  disclaimerConsentLabel: string;
  step3Title: string;
  howHeardLabel: string;
  howHeardGroups: readonly HowHeardGroup[];
  howHeardOtherLabel: string;
  priorPracticeLabel: string;
  otherIshaLabel: string;
  otherIshaDetailsLabel: string;
  step4Title: string;
  refundPolicyTitle: string;
  refundPolicyBullets: readonly string[];
  refundPolicyConsentLabel: string;
  agreementTitle: string;
  agreementBullets: readonly string[];
  agreementConsentLabel: string;
  step5Title: string;
  beforeSessionBlocks: readonly GuidelineBlock[];
  guidelinesPrompt: string;
  guidelinesReadLabel: string;
  guidelinesDownloadLabel: string;
  guidelinesTitle: string;
  guidelinesDocument: readonly GuidelineSection[];
}

const DEFAULT_BEFORE_SESSION_BLOCKS: GuidelineBlock[] = [
  {
    heading: BEFORE_SESSION_STOMACH.title,
    paragraphs: [BEFORE_SESSION_STOMACH.intro],
    lists: [
      {
        label: BEFORE_SESSION_STOMACH.empty.heading,
        items: [...BEFORE_SESSION_STOMACH.empty.items],
      },
      {
        label: BEFORE_SESSION_STOMACH.light.heading,
        items: [...BEFORE_SESSION_STOMACH.light.items],
      },
    ],
  },
  {
    heading: BEFORE_SESSION_CLOTHING.title,
    paragraphs: [BEFORE_SESSION_CLOTHING.intro],
    lists: [
      {
        label: BEFORE_SESSION_CLOTHING.heading,
        items: [...BEFORE_SESSION_CLOTHING.items],
      },
    ],
  },
];

export const DEFAULT_PERSONAL_FIELDS: RegisterFormField[] = [
  { key: "fullName", label: "Full name", required: true, type: "text" },
  { key: "preferredName", label: "Name you prefer to be called", type: "text" },
  { key: "email", label: "Email", required: true, type: "email" },
  { key: "phone", label: "Phone number", required: true, type: "tel" },
  {
    key: "address",
    label: "Residential address",
    required: true,
    type: "textarea",
  },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    placeholder: "Select (optional)",
    options: ["Female", "Male", "Other", "Prefer not to say"],
  },
  { key: "age", label: "Age", required: true, type: "text" },
  { key: "occupation", label: "Occupation", type: "text" },
];

export const DEFAULT_EMERGENCY_FIELDS: RegisterFormField[] = [
  { key: "emergencyName", label: "Full name", required: true, type: "text" },
  { key: "emergencyRelationship", label: "Relationship", type: "text" },
  { key: "emergencyPhone", label: "Phone number", required: true, type: "tel" },
];

export const DEFAULT_HOW_HEARD_GROUPS: HowHeardGroup[] = [
  {
    heading: "Personal",
    options: [
      "Friend or family recommendation",
      "Another participant / past student",
      "Another yoga teacher",
    ],
  },
  {
    heading: "Online / social",
    options: [
      "Instagram",
      "Website (ishafoundation.org)",
      "YouTube",
      "Website (navahathayoga.com)",
      "Facebook",
    ],
  },
  {
    heading: "Local / in person",
    options: [
      "Flyer / poster",
      "Local community or group",
      "Saw a class or practice in person",
      "Yoga / wellness event or retreat",
    ],
  },
];

const WORKSHOP_HOW_HEARD_LABEL = "How did you come to know of this program?";
const RETREAT_HOW_HEARD_LABEL = "How did you come to know of this retreat?";

const RETREAT_REFUND_POLICY_BULLETS = [
  "No shows or Drop out or Missed sessions - No refunds or carry forward to next retreat are possible.",
  "No refunds for cancellations made within 7 days prior to the retreat start date.",
  "Cancellations made between 8-14 days before the retreat are eligible for a 50% refund, minus a 10% administrative fee.",
  "Cancellations made more than 14 days in advance are eligible for a full refund, minus a 10% administrative fee.",
] as const;

const RETREAT_AGREEMENT_BULLETS = [
  "I willingly undertake to attend the retreat in full;",
  "I take full responsibility for my participation and release the organizers from any claims or liabilities;",
  "I will not communicate the contents of the retreat, either directly or indirectly to anyone else.",
  "I confirm that all information provided by me is true and accurate and complete to the best of my knowledge.",
  "We reserve the right to all the retreat images, videos, text and may use it to create awareness about other retreats.",
] as const;

const DEFAULT_REGISTER_COPY: Omit<RegisterContent, "steps"> = {
  step1Title: "Personal Information",
  personalFields: DEFAULT_PERSONAL_FIELDS,
  emergencyHeading: "Emergency contact",
  emergencyFields: DEFAULT_EMERGENCY_FIELDS,
  step2Title: "Health-Related Information",
  healthIntro: HEALTH_INTRO,
  healthConditionsLegend: "Health conditions",
  healthConditions: HEALTH_CONDITIONS,
  otherConditionLabel: "Other",
  notApplicableLabel: HEALTH_CONDITION_NOT_APPLICABLE,
  specifyPlaceholder: "Please specify",
  healthDetailsLabel: HEALTH_DETAILS_LABEL,
  majorSurgeryQuestion: MAJOR_SURGERY_QUESTION,
  majorSurgeryHint: MAJOR_SURGERY_HINT,
  pregnancyLabel: PREGNANCY_LABEL,
  yesLabel: "Yes",
  noLabel: "No",
  disclaimerIntro: MEDICAL_DISCLAIMER_INTRO,
  disclaimerLinkLabel: "Click Here",
  disclaimerConfirmLead: "By registering for the program, I confirm that:",
  disclaimerTitle: MEDICAL_DISCLAIMER_TITLE,
  disclaimerDocument: MEDICAL_DISCLAIMER_DOCUMENT,
  disclaimerBullets: MEDICAL_DISCLAIMER_BULLETS,
  disclaimerConsentLabel: MEDICAL_DISCLAIMER_CONSENT_LABEL,
  step3Title: "Program-Related Information",
  howHeardLabel: WORKSHOP_HOW_HEARD_LABEL,
  howHeardGroups: DEFAULT_HOW_HEARD_GROUPS,
  howHeardOtherLabel: "Other",
  priorPracticeLabel:
    "Please give details of yoga or meditation you have practiced and how long you have been practicing",
  otherIshaLabel: "Have you learnt any other Isha Yoga practices?",
  otherIshaDetailsLabel: "If yes, please give details below",
  step4Title: "Agreement",
  refundPolicyTitle: "Refund Policy:",
  refundPolicyBullets: REFUND_POLICY_BULLETS,
  refundPolicyConsentLabel: REFUND_POLICY_CONSENT_LABEL,
  agreementTitle: PARTICIPANT_AGREEMENT_TITLE,
  agreementBullets: AGREEMENT_BULLETS,
  agreementConsentLabel: AGREEMENT_CONSENT_LABEL,
  step5Title: "Before the Start of the Session",
  beforeSessionBlocks: DEFAULT_BEFORE_SESSION_BLOCKS,
  guidelinesPrompt:
    "For the full guidelines on what to know before, during, and after the program, please",
  guidelinesReadLabel: "read",
  guidelinesDownloadLabel: "download the PDF",
  guidelinesTitle: BEFORE_PROGRAM_TITLE,
  guidelinesDocument: BEFORE_PROGRAM_DOCUMENT,
};

function lastStep(
  steps: readonly RegisterStep[],
  kind: RegisterStepKind,
): RegisterStep | undefined {
  for (let index = steps.length - 1; index >= 0; index -= 1) {
    if (steps[index]?.kind === kind) return steps[index];
  }
  return undefined;
}

function personalStepFrom(
  content: Omit<RegisterContent, "steps">,
  options?: { includeEmergency?: boolean },
): RegisterStep {
  const includeEmergency = options?.includeEmergency !== false;
  return {
    kind: "personal",
    title: content.step1Title,
    fields: content.personalFields,
    emergencyHeading: includeEmergency ? content.emergencyHeading : undefined,
    emergencyFields: includeEmergency ? content.emergencyFields : [],
  };
}

function healthStepFrom(content: Omit<RegisterContent, "steps">): RegisterStep {
  return {
    kind: "health",
    title: content.step2Title,
    healthIntro: content.healthIntro,
    healthConditionsLegend: content.healthConditionsLegend,
    healthConditions: content.healthConditions,
    otherConditionLabel: content.otherConditionLabel,
    notApplicableLabel: content.notApplicableLabel,
    specifyPlaceholder: content.specifyPlaceholder,
    healthDetailsLabel: content.healthDetailsLabel,
    majorSurgeryQuestion: content.majorSurgeryQuestion,
    majorSurgeryHint: content.majorSurgeryHint,
    pregnancyLabel: content.pregnancyLabel,
    yesLabel: content.yesLabel,
    noLabel: content.noLabel,
    disclaimerIntro: content.disclaimerIntro,
    disclaimerLinkLabel: content.disclaimerLinkLabel,
    disclaimerConfirmLead: content.disclaimerConfirmLead,
    disclaimerTitle: content.disclaimerTitle,
    disclaimerDocument: content.disclaimerDocument,
    disclaimerBullets: content.disclaimerBullets,
    disclaimerConsentLabel: content.disclaimerConsentLabel,
  };
}

function programStepFrom(content: Omit<RegisterContent, "steps">): RegisterStep {
  return {
    kind: "program",
    title: content.step3Title,
    howHeardLabel: content.howHeardLabel,
    howHeardGroups: content.howHeardGroups,
    howHeardOtherLabel: content.howHeardOtherLabel,
    priorPracticeLabel: content.priorPracticeLabel,
    otherIshaLabel: content.otherIshaLabel,
    otherIshaDetailsLabel: content.otherIshaDetailsLabel,
    specifyPlaceholder: content.specifyPlaceholder,
    yesLabel: content.yesLabel,
    noLabel: content.noLabel,
  };
}

function agreementStepFrom(content: Omit<RegisterContent, "steps">): RegisterStep {
  return {
    kind: "agreement",
    title: content.step4Title,
    refundPolicyTitle: content.refundPolicyTitle,
    refundPolicyBullets: content.refundPolicyBullets,
    refundPolicyConsentLabel: content.refundPolicyConsentLabel,
    agreementTitle: content.agreementTitle,
    agreementBullets: content.agreementBullets,
    agreementConsentLabel: content.agreementConsentLabel,
  };
}

function guidelinesStepFrom(content: Omit<RegisterContent, "steps">): RegisterStep {
  return {
    kind: "guidelines",
    title: content.step5Title,
    beforeSessionBlocks: content.beforeSessionBlocks,
    guidelinesPrompt: content.guidelinesPrompt,
    guidelinesReadLabel: content.guidelinesReadLabel,
    guidelinesDownloadLabel: content.guidelinesDownloadLabel,
    guidelinesTitle: content.guidelinesTitle,
    guidelinesDocument: content.guidelinesDocument,
  };
}

function defaultTitleForKind(
  kind: RegisterStepKind,
  content: Omit<RegisterContent, "steps">,
): string {
  switch (kind) {
    case "personal":
      return content.step1Title;
    case "health":
      return content.step2Title;
    case "program":
      return content.step3Title;
    case "agreement":
      return content.step4Title;
    case "guidelines":
      return content.step5Title;
    case "fields":
      return "Questions";
  }
}

function stepsFromContent(
  content: Omit<RegisterContent, "steps">,
  kind?: RegistrationKind,
): RegisterStep[] {
  const personal = personalStepFrom(content, {
    includeEmergency: kind !== "free",
  });
  if (kind === "free") return [personal];
  return [
    personal,
    healthStepFrom(content),
    programStepFrom(content),
    agreementStepFrom(content),
    guidelinesStepFrom(content),
  ];
}

function contentFromCopy(
  copy: Omit<RegisterContent, "steps">,
  kind?: RegistrationKind,
): RegisterContent {
  const steps = stepsFromContent(copy, kind ?? "workshop");
  return applyStepsToContent(steps, { ...copy, steps });
}

export const DEFAULT_REGISTER_CONTENT: RegisterContent = contentFromCopy(
  DEFAULT_REGISTER_COPY,
  "workshop",
);

function defaultsForKind(kind?: RegistrationKind): RegisterContent {
  if (kind === "retreat") {
    return contentFromCopy(
      {
        ...DEFAULT_REGISTER_COPY,
        howHeardLabel: RETREAT_HOW_HEARD_LABEL,
        refundPolicyBullets: RETREAT_REFUND_POLICY_BULLETS,
        agreementBullets: RETREAT_AGREEMENT_BULLETS,
      },
      "retreat",
    );
  }
  if (kind === "free") {
    return contentFromCopy(DEFAULT_REGISTER_COPY, "free");
  }
  return DEFAULT_REGISTER_CONTENT;
}

function overlayHowHeardLabel(
  value: string | undefined,
  kind: RegistrationKind | undefined,
  fallback: string,
): string {
  if (kind === "retreat" && value?.trim() === WORKSHOP_HOW_HEARD_LABEL) {
    return RETREAT_HOW_HEARD_LABEL;
  }
  return overlayOptional(value, fallback);
}

function toRetreatRefundBullet(line: string): string {
  return line
    .replace(
      "next program are possible",
      "next retreat are possible",
    )
    .replace(
      "prior to the program start date",
      "prior to the retreat start date",
    )
    .replace(
      "before the program are eligible",
      "before the retreat are eligible",
    );
}

function overlayRefundPolicyBullets(
  value: string[] | undefined,
  kind: RegistrationKind | undefined,
  fallback: readonly string[],
): readonly string[] {
  const bullets = overlayStrings(value, fallback);
  if (kind !== "retreat") return bullets;
  return bullets.map(toRetreatRefundBullet);
}

function toRetreatAgreementBullet(line: string): string {
  return line
    .replace("attend the program in full", "attend the retreat in full")
    .replace("contents of the program", "contents of the retreat")
    .replace("all the program images", "all the retreat images")
    .replace("about other programs", "about other retreats");
}

function overlayAgreementBullets(
  value: string[] | undefined,
  kind: RegistrationKind | undefined,
  fallback: readonly string[],
): readonly string[] {
  const bullets = overlayStrings(value, fallback);
  if (kind !== "retreat") return bullets;
  return bullets.map(toRetreatAgreementBullet);
}

function strings(value: string[] | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  return value.map((item) => item.trim()).filter(Boolean);
}

function overlayStrings(
  value: string[] | undefined,
  fallback: readonly string[],
): readonly string[] {
  if (value === undefined) return fallback;
  return strings(value) ?? [];
}

function overlayOptional(
  value: string | undefined,
  fallback: string,
): string {
  if (value === undefined) return fallback;
  return value.trim();
}

function overlayTitle(value: string | undefined, fallback: string): string {
  return text(value) ?? fallback;
}

function text(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function toGuidelineBlock(data: GuidelineBlockData): GuidelineBlock | null {
  const heading = text(data.heading);
  if (!heading) return null;
  return {
    heading,
    paragraphs: strings(data.paragraphs),
    lists: data.lists
      ?.map((list) => ({
        label: text(list.label),
        items: strings(list.items) ?? [],
      }))
      .filter((list) => list.items.length > 0),
  };
}

function toGuidelineBlocks(
  data: GuidelineBlockData[] | undefined,
): GuidelineBlock[] | undefined {
  if (data === undefined) return undefined;
  return data
    .map(toGuidelineBlock)
    .filter((block): block is GuidelineBlock => block != null);
}

function toGuidelineSections(
  data: GuidelineSectionData[] | undefined,
): GuidelineSection[] | undefined {
  if (data === undefined) return undefined;
  return data
    .map((section): GuidelineSection | null => {
      const title = text(section.title);
      const blocks = toGuidelineBlocks(section.blocks);
      if (!title || !blocks?.length) return null;
      return { title, blocks };
    })
    .filter((section): section is GuidelineSection => section != null);
}

function toDisclaimerSections(
  data: DisclaimerSectionData[] | undefined,
): DisclaimerSection[] | undefined {
  if (data === undefined) return undefined;
  return data
    .map((section) => {
      const title = text(section.title);
      if (!title) return null;
      const items =
        section.items
          ?.map((item) => {
            const itemTitle = text(item.title);
            if (!itemTitle) return null;
            const contactName = text(item.contactName);
            const contactEmail = text(item.contactEmail);
            return {
              title: itemTitle,
              lead: text(item.lead),
              points: strings(item.points),
              contact:
                contactName && contactEmail
                  ? { name: contactName, email: contactEmail }
                  : undefined,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item != null) ?? [];
      if (items.length === 0) return null;
      return { symbol: "", title, intro: text(section.intro), items };
    })
    .filter((section): section is NonNullable<typeof section> => section != null);
}

function toFormField(data: RegisterFormFieldData): RegisterFormField | null {
  const label = text(data.label);
  if (!label) return null;
  const key = (text(data.key) || slugifySegment(label)).replace(
    /[^a-zA-Z0-9_-]/g,
    "",
  );
  if (!key || key === "company") return null;
  const type =
    data.type === "textarea" ||
    data.type === "email" ||
    data.type === "tel" ||
    data.type === "select"
      ? data.type
      : "text";
  return {
    key,
    label,
    required: Boolean(data.required),
    type,
    options: type === "select" ? strings(data.options) : undefined,
    placeholder: text(data.placeholder),
  };
}

function toFormFields(
  data: RegisterFormFieldData[] | undefined,
): RegisterFormField[] | undefined {
  if (data === undefined) return undefined;
  return data
    .map(toFormField)
    .filter((field): field is RegisterFormField => field != null);
}

function toHowHeardGroups(
  data: HowHeardGroupData[] | undefined,
): HowHeardGroup[] | undefined {
  if (data === undefined) return undefined;
  const groups: HowHeardGroup[] = [];
  for (const group of data) {
    const heading = text(group.heading);
    const options = strings(group.options);
    if (!heading || !options?.length) continue;
    groups.push({ heading, options });
  }
  return groups;
}

function overlayLegacy(
  cms: RegisterPage,
  d: RegisterContent,
  kind?: RegistrationKind,
): Omit<RegisterContent, "steps"> {
  return {
    step1Title: overlayTitle(cms.step1Title, d.step1Title),
    personalFields: toFormFields(cms.personalFields) ?? d.personalFields,
    emergencyHeading: overlayOptional(cms.emergencyHeading, d.emergencyHeading),
    emergencyFields: toFormFields(cms.emergencyFields) ?? d.emergencyFields,
    step2Title: overlayTitle(cms.step2Title, d.step2Title),
    healthIntro: overlayStrings(cms.healthIntro, d.healthIntro),
    healthConditionsLegend: overlayOptional(
      cms.healthConditionsLegend,
      d.healthConditionsLegend,
    ),
    healthConditions: overlayStrings(cms.healthConditions, d.healthConditions),
    otherConditionLabel: overlayOptional(
      cms.otherConditionLabel,
      d.otherConditionLabel,
    ),
    notApplicableLabel: overlayOptional(
      cms.notApplicableLabel,
      d.notApplicableLabel,
    ),
    specifyPlaceholder: overlayOptional(
      cms.specifyPlaceholder,
      d.specifyPlaceholder,
    ),
    healthDetailsLabel: overlayOptional(
      cms.healthDetailsLabel,
      d.healthDetailsLabel,
    ),
    majorSurgeryQuestion: overlayOptional(
      cms.majorSurgeryQuestion,
      d.majorSurgeryQuestion,
    ),
    majorSurgeryHint: overlayOptional(cms.majorSurgeryHint, d.majorSurgeryHint),
    pregnancyLabel: overlayOptional(cms.pregnancyLabel, d.pregnancyLabel),
    yesLabel: overlayOptional(cms.yesLabel, d.yesLabel),
    noLabel: overlayOptional(cms.noLabel, d.noLabel),
    disclaimerIntro: overlayOptional(cms.disclaimerIntro, d.disclaimerIntro),
    disclaimerLinkLabel: overlayOptional(
      cms.disclaimerLinkLabel,
      d.disclaimerLinkLabel,
    ),
    disclaimerConfirmLead: overlayOptional(
      cms.disclaimerConfirmLead,
      d.disclaimerConfirmLead,
    ),
    disclaimerTitle: overlayTitle(cms.disclaimerTitle, d.disclaimerTitle),
    disclaimerDocument:
      toDisclaimerSections(cms.disclaimerDocument) ?? d.disclaimerDocument,
    disclaimerBullets: overlayStrings(
      cms.disclaimerBullets,
      d.disclaimerBullets,
    ),
    disclaimerConsentLabel: overlayOptional(
      cms.disclaimerConsentLabel,
      d.disclaimerConsentLabel,
    ),
    step3Title: overlayTitle(cms.step3Title, d.step3Title),
    howHeardLabel: overlayHowHeardLabel(cms.howHeardLabel, kind, d.howHeardLabel),
    howHeardGroups: toHowHeardGroups(cms.howHeardGroups) ?? d.howHeardGroups,
    howHeardOtherLabel: overlayOptional(
      cms.howHeardOtherLabel,
      d.howHeardOtherLabel,
    ),
    priorPracticeLabel: overlayOptional(
      cms.priorPracticeLabel,
      d.priorPracticeLabel,
    ),
    otherIshaLabel: overlayOptional(cms.otherIshaLabel, d.otherIshaLabel),
    otherIshaDetailsLabel: overlayOptional(
      cms.otherIshaDetailsLabel,
      d.otherIshaDetailsLabel,
    ),
    step4Title: overlayTitle(cms.step4Title, d.step4Title),
    refundPolicyTitle: overlayOptional(
      cms.refundPolicyTitle,
      d.refundPolicyTitle,
    ),
    refundPolicyBullets: overlayRefundPolicyBullets(
      cms.refundPolicyBullets,
      kind,
      d.refundPolicyBullets,
    ),
    refundPolicyConsentLabel: overlayOptional(
      cms.refundPolicyConsentLabel,
      d.refundPolicyConsentLabel,
    ),
    agreementTitle: overlayOptional(cms.agreementTitle, d.agreementTitle),
    agreementBullets: overlayAgreementBullets(
      cms.agreementBullets,
      kind,
      d.agreementBullets,
    ),
    agreementConsentLabel: overlayOptional(
      cms.agreementConsentLabel,
      d.agreementConsentLabel,
    ),
    step5Title: overlayTitle(cms.step5Title, d.step5Title),
    beforeSessionBlocks:
      toGuidelineBlocks(cms.beforeSessionBlocks) ?? d.beforeSessionBlocks,
    guidelinesPrompt: overlayOptional(cms.guidelinesPrompt, d.guidelinesPrompt),
    guidelinesReadLabel: overlayOptional(
      cms.guidelinesReadLabel,
      d.guidelinesReadLabel,
    ),
    guidelinesDownloadLabel: overlayOptional(
      cms.guidelinesDownloadLabel,
      d.guidelinesDownloadLabel,
    ),
    guidelinesTitle: overlayTitle(cms.guidelinesTitle, d.guidelinesTitle),
    guidelinesDocument:
      toGuidelineSections(cms.guidelinesDocument) ?? d.guidelinesDocument,
  };
}

const REGISTER_STEP_KINDS: readonly RegisterStepKind[] = [
  "personal",
  "health",
  "program",
  "agreement",
  "guidelines",
  "fields",
];

function parseStepKind(value?: string): RegisterStepKind | null {
  return REGISTER_STEP_KINDS.includes(value as RegisterStepKind)
    ? (value as RegisterStepKind)
    : null;
}

function isBlankValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.every(isBlankValue);
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !key.startsWith("_"))
      .every(([, entry]) => isBlankValue(entry));
  }
  return false;
}

function stepHasCustomContent(data: RegisterStepData): boolean {
  return Object.entries(data).some(([key, value]) => {
    if (key === "kind" || key === "title" || key.startsWith("_")) return false;
    return !isBlankValue(value);
  });
}

function nonemptyFields(
  fields: RegisterFormField[] | undefined,
): RegisterFormField[] | undefined {
  if (fields === undefined || fields.length === 0) return undefined;
  return fields;
}

function parseCmsStep(
  data: RegisterStepData,
  d: RegisterContent,
  kind?: RegistrationKind,
): RegisterStep | null {
  const stepKind = parseStepKind(data.kind);
  if (!stepKind) return null;
  const title = overlayTitle(data.title, defaultTitleForKind(stepKind, d));
  const source = stepHasCustomContent(data) ? data : {};

  if (stepKind === "personal") {
    return {
      kind: "personal",
      title,
      fields: nonemptyFields(toFormFields(source.fields)) ?? d.personalFields,
      emergencyHeading: overlayOptional(
        source.emergencyHeading,
        d.emergencyHeading,
      ),
      emergencyFields: toFormFields(source.emergencyFields) ?? [],
    };
  }

  if (stepKind === "fields") {
    return {
      kind: "fields",
      title,
      fields: toFormFields(source.fields) ?? [],
    };
  }

  if (stepKind === "health") {
    return {
      ...healthStepFrom(
        source === data
          ? {
              ...d,
              healthIntro: overlayStrings(source.healthIntro, d.healthIntro),
              healthConditionsLegend: overlayOptional(
                source.healthConditionsLegend,
                d.healthConditionsLegend,
              ),
              healthConditions: overlayStrings(
                source.healthConditions,
                d.healthConditions,
              ),
              otherConditionLabel: overlayOptional(
                source.otherConditionLabel,
                d.otherConditionLabel,
              ),
              notApplicableLabel: overlayOptional(
                source.notApplicableLabel,
                d.notApplicableLabel,
              ),
              specifyPlaceholder: overlayOptional(
                source.specifyPlaceholder,
                d.specifyPlaceholder,
              ),
              healthDetailsLabel: overlayOptional(
                source.healthDetailsLabel,
                d.healthDetailsLabel,
              ),
              majorSurgeryQuestion: overlayOptional(
                source.majorSurgeryQuestion,
                d.majorSurgeryQuestion,
              ),
              majorSurgeryHint: overlayOptional(
                source.majorSurgeryHint,
                d.majorSurgeryHint,
              ),
              pregnancyLabel: overlayOptional(
                source.pregnancyLabel,
                d.pregnancyLabel,
              ),
              yesLabel: overlayOptional(source.yesLabel, d.yesLabel),
              noLabel: overlayOptional(source.noLabel, d.noLabel),
              disclaimerIntro: overlayOptional(
                source.disclaimerIntro,
                d.disclaimerIntro,
              ),
              disclaimerLinkLabel: overlayOptional(
                source.disclaimerLinkLabel,
                d.disclaimerLinkLabel,
              ),
              disclaimerConfirmLead: overlayOptional(
                source.disclaimerConfirmLead,
                d.disclaimerConfirmLead,
              ),
              disclaimerTitle: overlayTitle(
                source.disclaimerTitle,
                d.disclaimerTitle,
              ),
              disclaimerDocument:
                toDisclaimerSections(source.disclaimerDocument) ??
                d.disclaimerDocument,
              disclaimerBullets: overlayStrings(
                source.disclaimerBullets,
                d.disclaimerBullets,
              ),
              disclaimerConsentLabel: overlayOptional(
                source.disclaimerConsentLabel,
                d.disclaimerConsentLabel,
              ),
            }
          : d,
      ),
      title,
    };
  }

  if (stepKind === "program") {
    return {
      ...programStepFrom(
        source === data
          ? {
              ...d,
              howHeardLabel: overlayHowHeardLabel(
                source.howHeardLabel,
                kind,
                d.howHeardLabel,
              ),
              howHeardGroups:
                toHowHeardGroups(source.howHeardGroups) ?? d.howHeardGroups,
              howHeardOtherLabel: overlayOptional(
                source.howHeardOtherLabel,
                d.howHeardOtherLabel,
              ),
              priorPracticeLabel: overlayOptional(
                source.priorPracticeLabel,
                d.priorPracticeLabel,
              ),
              otherIshaLabel: overlayOptional(
                source.otherIshaLabel,
                d.otherIshaLabel,
              ),
              otherIshaDetailsLabel: overlayOptional(
                source.otherIshaDetailsLabel,
                d.otherIshaDetailsLabel,
              ),
              specifyPlaceholder: overlayOptional(
                source.specifyPlaceholder,
                d.specifyPlaceholder,
              ),
              yesLabel: overlayOptional(source.yesLabel, d.yesLabel),
              noLabel: overlayOptional(source.noLabel, d.noLabel),
            }
          : d,
      ),
      title,
    };
  }

  if (stepKind === "agreement") {
    return {
      ...agreementStepFrom(
        source === data
          ? {
              ...d,
              refundPolicyTitle: overlayOptional(
                source.refundPolicyTitle,
                d.refundPolicyTitle,
              ),
              refundPolicyBullets: overlayRefundPolicyBullets(
                source.refundPolicyBullets,
                kind,
                d.refundPolicyBullets,
              ),
              refundPolicyConsentLabel: overlayOptional(
                source.refundPolicyConsentLabel,
                d.refundPolicyConsentLabel,
              ),
              agreementTitle: overlayOptional(
                source.agreementTitle,
                d.agreementTitle,
              ),
              agreementBullets: overlayAgreementBullets(
                source.agreementBullets,
                kind,
                d.agreementBullets,
              ),
              agreementConsentLabel: overlayOptional(
                source.agreementConsentLabel,
                d.agreementConsentLabel,
              ),
            }
          : d,
      ),
      title,
    };
  }

  return {
    ...guidelinesStepFrom(
      source === data
        ? {
            ...d,
            beforeSessionBlocks:
              toGuidelineBlocks(source.beforeSessionBlocks) ??
              d.beforeSessionBlocks,
            guidelinesPrompt: overlayOptional(
              source.guidelinesPrompt,
              d.guidelinesPrompt,
            ),
            guidelinesReadLabel: overlayOptional(
              source.guidelinesReadLabel,
              d.guidelinesReadLabel,
            ),
            guidelinesDownloadLabel: overlayOptional(
              source.guidelinesDownloadLabel,
              d.guidelinesDownloadLabel,
            ),
            guidelinesTitle: overlayTitle(
              source.guidelinesTitle,
              d.guidelinesTitle,
            ),
            guidelinesDocument:
              toGuidelineSections(source.guidelinesDocument) ??
              d.guidelinesDocument,
          }
        : d,
    ),
    title,
  };
}

function applyStepsToContent(
  steps: RegisterStep[],
  d: RegisterContent,
): RegisterContent {
  const personal = steps.filter((step) => step.kind === "personal");
  const extra = steps.filter((step) => step.kind === "fields");
  const health = lastStep(steps, "health");
  const program = lastStep(steps, "program");
  const agreement = lastStep(steps, "agreement");
  const guidelines = lastStep(steps, "guidelines");

  return {
    ...d,
    steps,
    step1Title: personal[0]?.title ?? d.step1Title,
    personalFields: [...personal, ...extra].flatMap(
      (step) => step.fields ?? [],
    ),
    emergencyHeading: personal[0]?.emergencyHeading ?? "",
    emergencyFields: personal.flatMap((step) => step.emergencyFields ?? []),
    step2Title: health?.title ?? d.step2Title,
    healthIntro: health?.healthIntro ?? [],
    healthConditionsLegend: health?.healthConditionsLegend ?? "",
    healthConditions: health?.healthConditions ?? [],
    otherConditionLabel: health?.otherConditionLabel ?? "",
    notApplicableLabel: health?.notApplicableLabel ?? "",
    specifyPlaceholder:
      health?.specifyPlaceholder ||
      program?.specifyPlaceholder ||
      d.specifyPlaceholder,
    healthDetailsLabel: health?.healthDetailsLabel ?? "",
    majorSurgeryQuestion: health?.majorSurgeryQuestion ?? "",
    majorSurgeryHint: health?.majorSurgeryHint ?? "",
    pregnancyLabel: health?.pregnancyLabel ?? "",
    yesLabel: health?.yesLabel || program?.yesLabel || d.yesLabel,
    noLabel: health?.noLabel || program?.noLabel || d.noLabel,
    disclaimerIntro: health?.disclaimerIntro ?? "",
    disclaimerLinkLabel: health?.disclaimerLinkLabel ?? "",
    disclaimerConfirmLead: health?.disclaimerConfirmLead ?? "",
    disclaimerTitle: health?.disclaimerTitle ?? d.disclaimerTitle,
    disclaimerDocument: health?.disclaimerDocument ?? [],
    disclaimerBullets: health?.disclaimerBullets ?? [],
    disclaimerConsentLabel: health?.disclaimerConsentLabel ?? "",
    step3Title: program?.title ?? d.step3Title,
    howHeardLabel: program?.howHeardLabel ?? "",
    howHeardGroups: program?.howHeardGroups ?? [],
    howHeardOtherLabel: program?.howHeardOtherLabel ?? "",
    priorPracticeLabel: program?.priorPracticeLabel ?? "",
    otherIshaLabel: program?.otherIshaLabel ?? "",
    otherIshaDetailsLabel: program?.otherIshaDetailsLabel ?? "",
    step4Title: agreement?.title ?? d.step4Title,
    refundPolicyTitle: agreement?.refundPolicyTitle ?? "",
    refundPolicyBullets: agreement?.refundPolicyBullets ?? [],
    refundPolicyConsentLabel: agreement?.refundPolicyConsentLabel ?? "",
    agreementTitle: agreement?.agreementTitle ?? "",
    agreementBullets: agreement?.agreementBullets ?? [],
    agreementConsentLabel: agreement?.agreementConsentLabel ?? "",
    step5Title: guidelines?.title ?? d.step5Title,
    beforeSessionBlocks: guidelines?.beforeSessionBlocks ?? [],
    guidelinesPrompt: guidelines?.guidelinesPrompt ?? "",
    guidelinesReadLabel: guidelines?.guidelinesReadLabel ?? "",
    guidelinesDownloadLabel: guidelines?.guidelinesDownloadLabel ?? "",
    guidelinesTitle: guidelines?.guidelinesTitle ?? d.guidelinesTitle,
    guidelinesDocument: guidelines?.guidelinesDocument ?? [],
  };
}

/** Merge CMS register-page content over the built-in defaults. */
export function resolveRegisterContent(
  cms?: RegisterPage | null,
  kind?: RegistrationKind,
): RegisterContent {
  const d = defaultsForKind(kind);
  if (!cms) return d;

  const savedSteps = cms.steps
    ?.map((step) => parseCmsStep(step, d, kind))
    .filter((step): step is RegisterStep => step != null);
  if (savedSteps && savedSteps.length > 0) {
    return applyStepsToContent(savedSteps, d);
  }

  const overlaid = overlayLegacy(cms, d, kind);
  return applyStepsToContent(stepsFromContent(overlaid, kind), d);
}

export function hasRegisterStep(
  content: RegisterContent,
  kind: RegisterStepKind,
): boolean {
  return content.steps.some((step) => step.kind === kind);
}

/** Fields people actually see on the form, used so the API does not require hidden ones. */
export function registerFieldsForValidation(content: RegisterContent): {
  personal: RegisterFormField[];
  emergency: RegisterFormField[];
} {
  const personal: RegisterFormField[] = [];
  const emergency: RegisterFormField[] = [];
  for (const step of content.steps) {
    if (step.kind === "personal" || step.kind === "fields") {
      personal.push(...(step.fields ?? []));
    }
    if (step.kind === "personal") {
      emergency.push(...(step.emergencyFields ?? []));
    }
  }
  return { personal, emergency };
}

function fieldToEditor(field: RegisterFormField): RegisterFormFieldData {
  return {
    key: field.key,
    label: field.label,
    required: field.required,
    type: field.type,
    options: field.options ? [...field.options] : undefined,
    placeholder: field.placeholder,
  };
}

function disclaimerToEditor(
  sections: readonly DisclaimerSection[],
): DisclaimerSectionData[] {
  return sections.map((section) => ({
    title: section.title,
    intro: section.intro,
    items: section.items.map((item) => ({
      title: item.title,
      lead: item.lead,
      points: item.points ? [...item.points] : undefined,
      contactName: item.contact?.name,
      contactEmail: item.contact?.email,
    })),
  }));
}

function guidelineBlocksToEditor(
  blocks: readonly GuidelineBlock[],
): GuidelineBlockData[] {
  return blocks.map((block) => ({
    heading: block.heading,
    paragraphs: block.paragraphs ? [...block.paragraphs] : undefined,
    lists: block.lists?.map((list) => ({
      label: list.label,
      items: [...list.items],
    })),
  }));
}

/** Values for the registration editor’s named step sections. */
export function registerPageEditorValues(
  cms: RegisterPage | null | undefined,
  kind?: RegistrationKind,
): Record<string, unknown> {
  const content = resolveRegisterContent(cms, kind);
  return {
    step1Title: content.step1Title,
    personalFields: content.personalFields.map(fieldToEditor),
    emergencyHeading: content.emergencyHeading,
    emergencyFields: content.emergencyFields.map(fieldToEditor),
    step2Title: content.step2Title,
    healthIntro: [...content.healthIntro],
    healthConditionsLegend: content.healthConditionsLegend,
    healthConditions: [...content.healthConditions],
    otherConditionLabel: content.otherConditionLabel,
    notApplicableLabel: content.notApplicableLabel,
    specifyPlaceholder: content.specifyPlaceholder,
    healthDetailsLabel: content.healthDetailsLabel,
    majorSurgeryQuestion: content.majorSurgeryQuestion,
    majorSurgeryHint: content.majorSurgeryHint,
    pregnancyLabel: content.pregnancyLabel,
    yesLabel: content.yesLabel,
    noLabel: content.noLabel,
    disclaimerIntro: content.disclaimerIntro,
    disclaimerLinkLabel: content.disclaimerLinkLabel,
    disclaimerConfirmLead: content.disclaimerConfirmLead,
    disclaimerTitle: content.disclaimerTitle,
    disclaimerDocument: disclaimerToEditor(content.disclaimerDocument),
    disclaimerBullets: [...content.disclaimerBullets],
    disclaimerConsentLabel: content.disclaimerConsentLabel,
    step3Title: content.step3Title,
    howHeardLabel: content.howHeardLabel,
    howHeardGroups: content.howHeardGroups.map((group) => ({
      heading: group.heading,
      options: [...group.options],
    })),
    howHeardOtherLabel: content.howHeardOtherLabel,
    priorPracticeLabel: content.priorPracticeLabel,
    otherIshaLabel: content.otherIshaLabel,
    otherIshaDetailsLabel: content.otherIshaDetailsLabel,
    step4Title: content.step4Title,
    refundPolicyTitle: content.refundPolicyTitle,
    refundPolicyBullets: [...content.refundPolicyBullets],
    refundPolicyConsentLabel: content.refundPolicyConsentLabel,
    agreementTitle: content.agreementTitle,
    agreementBullets: [...content.agreementBullets],
    agreementConsentLabel: content.agreementConsentLabel,
    step5Title: content.step5Title,
    beforeSessionBlocks: guidelineBlocksToEditor(content.beforeSessionBlocks),
    guidelinesPrompt: content.guidelinesPrompt,
    guidelinesReadLabel: content.guidelinesReadLabel,
    guidelinesDownloadLabel: content.guidelinesDownloadLabel,
    guidelinesTitle: content.guidelinesTitle,
    guidelinesDocument: content.guidelinesDocument.map((section) => ({
      title: section.title,
      blocks: guidelineBlocksToEditor(section.blocks),
    })),
  };
}

export const REGISTER_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ExtraRegisterField {
  key: string;
  label: string;
  value: string;
}

export function parseExtraFields(raw: unknown): ExtraRegisterField[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as { key?: unknown; label?: unknown; value?: unknown };
    const key = typeof record.key === "string" ? record.key.trim() : "";
    if (!key || key === "company") return [];
    return [
      {
        key,
        label: typeof record.label === "string" ? record.label.trim() : key,
        value: typeof record.value === "string" ? record.value.trim() : "",
      },
    ];
  });
}

export function valueForRegisterField(
  field: RegisterFormField,
  known: Record<string, string | undefined>,
  extra: ExtraRegisterField[],
): string {
  const top = known[field.key];
  if (typeof top === "string") return top.trim();
  return extra.find((item) => item.key === field.key)?.value ?? "";
}

export function labeledValuesForFields(
  fields: readonly RegisterFormField[],
  known: Record<string, string | undefined>,
  extra: ExtraRegisterField[],
): { label: string; value: string }[] {
  return fields.map((field) => ({
    label: field.label,
    value: valueForRegisterField(field, known, extra),
  }));
}

/** True when a required field is blank or an email value is malformed. */
export function hasInvalidRegisterFields(
  fields: readonly RegisterFormField[],
  known: Record<string, string | undefined>,
  extra: ExtraRegisterField[],
): boolean {
  return fields.some((field) => {
    const value = valueForRegisterField(field, known, extra);
    if (field.required && !value) return true;
    if (field.type === "email" && value && !REGISTER_EMAIL_RE.test(value))
      return true;
    return false;
  });
}

export function firstEmailValue(
  fields: readonly RegisterFormField[],
  known: Record<string, string | undefined>,
  extra: ExtraRegisterField[],
): string {
  const emailField = fields.find((field) => field.type === "email");
  if (emailField) return valueForRegisterField(emailField, known, extra);
  const named = known.email?.trim();
  return named && REGISTER_EMAIL_RE.test(named) ? named : "";
}

export function displayNameValue(
  fields: readonly RegisterFormField[],
  known: Record<string, string | undefined>,
  extra: ExtraRegisterField[],
): string {
  const named = fields.find((field) => field.key === "fullName");
  if (named) return valueForRegisterField(named, known, extra);
  const firstRequired = fields.find((field) => field.required);
  if (firstRequired) return valueForRegisterField(firstRequired, known, extra);
  return fields[0]
    ? valueForRegisterField(fields[0], known, extra)
    : "";
}
