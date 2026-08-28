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
  HEALTH_CONDITIONS,
  HEALTH_DETAILS_LABEL,
  HEALTH_INTRO,
  MAJOR_SURGERY_HINT,
  MAJOR_SURGERY_QUESTION,
  MEDICAL_DISCLAIMER_BULLETS,
  MEDICAL_DISCLAIMER_CONSENT_LABEL,
  MEDICAL_DISCLAIMER_DOCUMENT,
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
  RegisterPage,
} from "@/lib/cms/content-types";

export interface RegisterContent {
  healthIntro: readonly string[];
  healthConditions: readonly string[];
  healthDetailsLabel: string;
  majorSurgeryQuestion: string;
  majorSurgeryHint: string;
  pregnancyLabel: string;
  disclaimerTitle: string;
  disclaimerDocument: readonly DisclaimerSection[];
  disclaimerBullets: readonly string[];
  disclaimerConsentLabel: string;
  refundPolicyBullets: readonly string[];
  refundPolicyConsentLabel: string;
  agreementTitle: string;
  agreementBullets: readonly string[];
  agreementConsentLabel: string;
  beforeSessionBlocks: readonly GuidelineBlock[];
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

export const DEFAULT_REGISTER_CONTENT: RegisterContent = {
  healthIntro: HEALTH_INTRO,
  healthConditions: HEALTH_CONDITIONS,
  healthDetailsLabel: HEALTH_DETAILS_LABEL,
  majorSurgeryQuestion: MAJOR_SURGERY_QUESTION,
  majorSurgeryHint: MAJOR_SURGERY_HINT,
  pregnancyLabel: PREGNANCY_LABEL,
  disclaimerTitle: MEDICAL_DISCLAIMER_TITLE,
  disclaimerDocument: MEDICAL_DISCLAIMER_DOCUMENT,
  disclaimerBullets: MEDICAL_DISCLAIMER_BULLETS,
  disclaimerConsentLabel: MEDICAL_DISCLAIMER_CONSENT_LABEL,
  refundPolicyBullets: REFUND_POLICY_BULLETS,
  refundPolicyConsentLabel: REFUND_POLICY_CONSENT_LABEL,
  agreementTitle: PARTICIPANT_AGREEMENT_TITLE,
  agreementBullets: AGREEMENT_BULLETS,
  agreementConsentLabel: AGREEMENT_CONSENT_LABEL,
  beforeSessionBlocks: DEFAULT_BEFORE_SESSION_BLOCKS,
  guidelinesTitle: BEFORE_PROGRAM_TITLE,
  guidelinesDocument: BEFORE_PROGRAM_DOCUMENT,
};

function strings(value: string[] | undefined): string[] | undefined {
  const cleaned = value?.map((item) => item.trim()).filter(Boolean);
  return cleaned && cleaned.length > 0 ? cleaned : undefined;
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
  const blocks = data
    ?.map(toGuidelineBlock)
    .filter((block): block is GuidelineBlock => block != null);
  return blocks && blocks.length > 0 ? blocks : undefined;
}

function toGuidelineSections(
  data: GuidelineSectionData[] | undefined,
): GuidelineSection[] | undefined {
  const sections = data
    ?.map((section): GuidelineSection | null => {
      const title = text(section.title);
      const blocks = toGuidelineBlocks(section.blocks);
      if (!title || !blocks) return null;
      return { title, blocks };
    })
    .filter((section): section is GuidelineSection => section != null);
  return sections && sections.length > 0 ? sections : undefined;
}

function toDisclaimerSections(
  data: DisclaimerSectionData[] | undefined,
): DisclaimerSection[] | undefined {
  const sections = data
    ?.map((section) => {
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
  return sections && sections.length > 0 ? sections : undefined;
}

/** Merge CMS register-page content over the built-in defaults. */
export function resolveRegisterContent(
  cms?: RegisterPage | null,
): RegisterContent {
  if (!cms) return DEFAULT_REGISTER_CONTENT;
  const d = DEFAULT_REGISTER_CONTENT;
  return {
    healthIntro: strings(cms.healthIntro) ?? d.healthIntro,
    healthConditions: strings(cms.healthConditions) ?? d.healthConditions,
    healthDetailsLabel: text(cms.healthDetailsLabel) ?? d.healthDetailsLabel,
    majorSurgeryQuestion: text(cms.majorSurgeryQuestion) ?? d.majorSurgeryQuestion,
    majorSurgeryHint: text(cms.majorSurgeryHint) ?? d.majorSurgeryHint,
    pregnancyLabel: text(cms.pregnancyLabel) ?? d.pregnancyLabel,
    disclaimerTitle: text(cms.disclaimerTitle) ?? d.disclaimerTitle,
    disclaimerDocument:
      toDisclaimerSections(cms.disclaimerDocument) ?? d.disclaimerDocument,
    disclaimerBullets: strings(cms.disclaimerBullets) ?? d.disclaimerBullets,
    disclaimerConsentLabel:
      text(cms.disclaimerConsentLabel) ?? d.disclaimerConsentLabel,
    refundPolicyBullets: strings(cms.refundPolicyBullets) ?? d.refundPolicyBullets,
    refundPolicyConsentLabel:
      text(cms.refundPolicyConsentLabel) ?? d.refundPolicyConsentLabel,
    agreementTitle: text(cms.agreementTitle) ?? d.agreementTitle,
    agreementBullets: strings(cms.agreementBullets) ?? d.agreementBullets,
    agreementConsentLabel:
      text(cms.agreementConsentLabel) ?? d.agreementConsentLabel,
    beforeSessionBlocks:
      toGuidelineBlocks(cms.beforeSessionBlocks) ?? d.beforeSessionBlocks,
    guidelinesTitle: text(cms.guidelinesTitle) ?? d.guidelinesTitle,
    guidelinesDocument:
      toGuidelineSections(cms.guidelinesDocument) ?? d.guidelinesDocument,
  };
}
