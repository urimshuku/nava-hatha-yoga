import type { PortableTextBlock } from "@portabletext/types";
import type { Image } from "sanity";

export type SanityImage = Image & { alt?: string };

export interface SeoFields {
  title?: string;
  description?: string;
}

export interface CtaLink {
  label?: string;
  href?: string;
}

export interface SiteSettings {
  brandName?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  social?: { label?: string; url?: string }[];
  beforeProgramNotes?: string[];
  medicalNotice?: string;
  seo?: SeoFields;
}

export type ProgramCategory = "main" | "special";

export interface ProgramListItem {
  _id: string;
  title: string;
  slug: string;
  shortIntro?: string;
  category?: ProgramCategory;
  image?: SanityImage;
}

export interface Program extends ProgramListItem {
  whatIs?: PortableTextBlock[];
  aboutThePractice?: PortableTextBlock[];
  benefits?: string[];
  beforeProgramTitle?: string;
  beforeProgramNotes?: string[];
  practiceIndependently?: PortableTextBlock[];
  privateAndGroupSessions?: PortableTextBlock[];
  videoUrl?: string;
  videoTitle?: string;
  priceLabel?: string;
  seo?: SeoFields;
}

export interface AboutSection {
  title?: string;
  body?: PortableTextBlock[];
  image?: SanityImage;
  cta?: CtaLink;
}

export interface TeacherStory {
  nameLine?: string;
  photo?: SanityImage;
  teaser?: string[];
  storyTitle?: string;
  story?: string[];
}

export interface AboutPage {
  title?: string;
  intro?: PortableTextBlock[];
  teacherStory?: TeacherStory;
  sections?: AboutSection[];
  seo?: SeoFields;
}

export interface HomePage {
  hero?: {
    headline?: string;
    supportingText?: string;
    primaryCta?: CtaLink;
    secondaryCta?: CtaLink;
    image?: SanityImage;
  };
  intro?: { eyebrow?: string; heading?: string; body?: PortableTextBlock[]; videoUrl?: string };
  featuredPrograms?: ProgramListItem[];
  privateCorporate?: { heading?: string; body?: PortableTextBlock[] };
  aboutIntro?: {
    eyebrow?: string;
    heading?: string;
    body?: PortableTextBlock[];
    image?: SanityImage;
  };
  finalCta?: { heading?: string; body?: string; cta?: CtaLink };
  seo?: SeoFields;
}

export type EventCategory = "Workshop" | "Retreat" | "Free Session";

export interface EventSession {
  day?: string;
  hours?: string;
}

export interface YogaEvent {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  sessions?: EventSession[];
  sessionNote?: string;
  time?: string;
  location?: string;
  priceLabel?: string;
  paymentNote?: string;
  teacher?: string;
  ageRequirement?: string;
  category?: EventCategory;
  relatedProgram?: { title?: string; slug?: string } | null;
  description?: string;
  notes?: string[];
  image?: SanityImage;
  registrationLink?: string;
  whatsappEnabled?: boolean;
}

export interface PastEvent {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  sessions?: EventSession[];
  sessionNote?: string;
  time?: string;
  location?: string;
  category?: EventCategory;
  relatedProgram?: { title?: string; slug?: string } | null;
}

export interface RetreatListItem {
  _id: string;
  title: string;
  slug: string;
  date?: string;
  location?: string;
  priceLabel?: string;
  description?: string;
  image?: SanityImage;
}

export interface Retreat extends RetreatListItem {
  body?: PortableTextBlock[];
  gallery?: SanityImage[];
  registrationLink?: string;
  cancellationPolicy?: PortableTextBlock[];
  seo?: SeoFields;
}

export interface LegalPage {
  title?: string;
  slug?: string;
  body?: PortableTextBlock[];
  seo?: SeoFields;
}

export interface ContactPage {
  heroTitle?: string;
  heroDescription?: string;
  formHeading?: string;
  quickMessageBody?: string;
  whatsappPrefill?: string;
  seo?: SeoFields;
}

export interface RetreatsPage {
  heroTitle?: string;
  heroDescription?: string;
  comingSoonHeading?: string;
  comingSoonBody?: string;
  expectationsHeading?: string;
  expectations?: { title?: string; body?: string }[];
  seo?: SeoFields;
}

export interface GuidelineListData {
  label?: string;
  items?: string[];
}

export interface GuidelineBlockData {
  heading?: string;
  paragraphs?: string[];
  lists?: GuidelineListData[];
}

export interface GuidelineSectionData {
  title?: string;
  blocks?: GuidelineBlockData[];
}

export interface DisclaimerItemData {
  title?: string;
  lead?: string;
  points?: string[];
  contactName?: string;
  contactEmail?: string;
}

export interface DisclaimerSectionData {
  title?: string;
  intro?: string;
  items?: DisclaimerItemData[];
}

export interface RegisterPage {
  healthIntro?: string[];
  healthConditions?: string[];
  healthDetailsLabel?: string;
  majorSurgeryQuestion?: string;
  majorSurgeryHint?: string;
  pregnancyLabel?: string;
  disclaimerTitle?: string;
  disclaimerDocument?: DisclaimerSectionData[];
  disclaimerBullets?: string[];
  disclaimerConsentLabel?: string;
  refundPolicyBullets?: string[];
  refundPolicyConsentLabel?: string;
  agreementTitle?: string;
  agreementBullets?: string[];
  agreementConsentLabel?: string;
  beforeSessionBlocks?: GuidelineBlockData[];
  guidelinesTitle?: string;
  guidelinesDocument?: GuidelineSectionData[];
}
