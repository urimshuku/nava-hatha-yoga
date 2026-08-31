import type { PortableTextBlock } from "@portabletext/types";

/**
 * An image uploaded through the built-in CMS. The bytes live in R2 and are
 * served from /media/<key>, so `next/image` and the Cloudflare resizing loader
 * treat it like any other same-origin image.
 */
export interface CmsImage {
  _type: "cmsImage";
  key: string;
  alt?: string;
  /** Measured in the browser at upload time, for correct layout reservation. */
  width?: number;
  height?: number;
}

/**
 * Any image the site can render. The name is kept so existing call sites that
 * already type fields as SanityImage do not all have to rename at once.
 */
export type SanityImage = CmsImage;

export function isCmsImage(image: unknown): image is CmsImage {
  return Boolean(
    image &&
      typeof image === "object" &&
      (image as { _type?: string })._type === "cmsImage",
  );
}

export interface SeoFields {
  title?: string;
  description?: string;
  image?: SanityImage;
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
  bonusTitle?: string;
  bonusItems?: string[];
  discountNote?: string;
  medicalNoticeTitle?: string;
  medicalNotice?: string;
  eventExperienceNote?: string;
  seo?: SeoFields;
}

export type ProgramCategory = "main" | "special";
export type ProgramIntensity = "Low" | "Medium" | "High";

export interface ProgramListItem {
  _id: string;
  title: string;
  slug: string;
  shortIntro?: string;
  category?: ProgramCategory;
  intensity?: ProgramIntensity;
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
  contextLine?: string;
  relatedPrograms?: CtaLink[];
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

export interface AboutHighlightCard {
  eyebrow?: string;
  title?: string;
  stat?: string;
  body?: string;
  showCertificationLogo?: boolean;
}

export interface AboutPage {
  title?: string;
  heroEyebrow?: string;
  heroDescription?: string;
  intro?: PortableTextBlock[];
  teacherSectionTitle?: string;
  teacherStory?: TeacherStory;
  highlightCards?: AboutHighlightCard[];
  sections?: AboutSection[];
  finalCta?: { heading?: string; body?: string; cta?: CtaLink };
  seo?: SeoFields;
}

export interface HighlightItem {
  text?: string;
  lines?: string[];
}

export interface OfferingItem {
  title?: string;
  body?: string;
}

export interface HomePage {
  hero?: {
    headline?: string;
    subtitle?: string;
    supportingText?: string;
    primaryCta?: CtaLink;
    secondaryCta?: CtaLink;
    image?: SanityImage;
  };
  highlights?: {
    items?: HighlightItem[];
    closingQuote?: string;
  };
  intro?: {
    eyebrow?: string;
    heading?: string;
    body?: PortableTextBlock[];
    videoUrl?: string;
    videoTitle?: string;
  };
  featuredProgramsSection?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    ctaLabel?: string;
  };
  featuredPrograms?: ProgramListItem[];
  featuredProgramSlugs?: string[];
  upcomingEventsSection?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    ctaLabel?: string;
  };
  privateCorporate?: {
    heading?: string;
    lead?: string;
    offerings?: OfferingItem[];
    cta?: CtaLink;
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
  slug?: string;
  _updatedAt?: string;
  date: string;
  endDate?: string;
  sessions?: EventSession[];
  sessionNote?: string;
  time?: string;
  location?: string;
  cityCountry?: string;
  intensity?: string;
  yogaExperience?: string;
  priceLabel?: string;
  paymentNote?: string;
  teacher?: string;
  ageRequirement?: string;
  category?: EventCategory;
  relatedProgram?: { title?: string; slug?: string; intensity?: ProgramIntensity } | null;
  description?: string;
  notes?: string[];
  image?: SanityImage;
  registrationLink?: string;
  whatsappEnabled?: boolean;
}

export interface PastEvent {
  _id: string;
  title: string;
  slug?: string;
  date: string;
  endDate?: string;
  sessions?: EventSession[];
  sessionNote?: string;
  time?: string;
  location?: string;
  cityCountry?: string;
  category?: EventCategory;
  relatedProgram?: { title?: string; slug?: string; intensity?: ProgramIntensity } | null;
}

export interface RetreatListItem {
  _id: string;
  title: string;
  slug: string;
  date?: string;
  endDate?: string;
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
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  formHeading?: string;
  quickMessageBody?: string;
  whatsappPrefill?: string;
  teachingLocations?: {
    mainHeading?: string;
    mainLocations?: string;
    otherHeading?: string;
    otherLocations?: string;
  };
  seo?: SeoFields;
}

export interface FreeOfferingItem {
  title?: string;
  description?: string;
}

export interface ProgramsPage {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  mainProgramsHeading?: string;
  specialProgramsHeading?: string;
  specialProgramsLead?: string;
  freeOfferings?: {
    eyebrow?: string;
    lead?: string;
    items?: FreeOfferingItem[];
  };
  seo?: SeoFields;
}

export interface EventsPage {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  contactHeading?: string;
  contactDescription?: string;
  archiveEyebrow?: string;
  archiveTitle?: string;
  archiveDescription?: string;
  archiveEmptyTitle?: string;
  archiveEmptyDescription?: string;
  seo?: SeoFields;
}

export interface RetreatsPage {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  comingSoonEyebrow?: string;
  comingSoonHeading?: string;
  comingSoonBody?: string;
  expectationsEyebrow?: string;
  expectationsHeading?: string;
  expectations?: { title?: string; body?: string }[];
  listingCta?: { heading?: string; body?: string; cta?: CtaLink };
  partnerPrograms?: {
    heading?: string;
    intro?: string[];
    collaborateHeading?: string;
    collaborateItems?: string[];
    closing?: string[];
    whatsappPrefill?: string;
  };
  archiveEyebrow?: string;
  archiveTitle?: string;
  archiveDescription?: string;
  archiveEmptyTitle?: string;
  archiveEmptyDescription?: string;
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
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
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
