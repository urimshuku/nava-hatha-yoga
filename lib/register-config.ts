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
} from "@/lib/cms/content-types";
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

export interface RegisterContent {
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

export const DEFAULT_REGISTER_CONTENT: RegisterContent = {
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
  howHeardLabel: "How did you come to know of this program?",
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
    options: strings(data.options),
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

/** Merge CMS register-page content over the built-in defaults. */
export function resolveRegisterContent(
  cms?: RegisterPage | null,
): RegisterContent {
  if (!cms) return DEFAULT_REGISTER_CONTENT;
  const d = DEFAULT_REGISTER_CONTENT;
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
    howHeardLabel: overlayOptional(cms.howHeardLabel, d.howHeardLabel),
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
    refundPolicyBullets: overlayStrings(
      cms.refundPolicyBullets,
      d.refundPolicyBullets,
    ),
    refundPolicyConsentLabel: overlayOptional(
      cms.refundPolicyConsentLabel,
      d.refundPolicyConsentLabel,
    ),
    agreementTitle: overlayOptional(cms.agreementTitle, d.agreementTitle),
    agreementBullets: overlayStrings(cms.agreementBullets, d.agreementBullets),
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
