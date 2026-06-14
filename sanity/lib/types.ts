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
  logo?: SanityImage;
  seo?: SeoFields;
}

export interface ProgramListItem {
  _id: string;
  title: string;
  slug: string;
  shortIntro?: string;
  image?: SanityImage;
}

export interface Program extends ProgramListItem {
  body?: PortableTextBlock[];
  benefits?: string[];
  experiences?: string[];
  symbol?: SanityImage;
  seo?: SeoFields;
}

export interface AboutSection {
  title?: string;
  body?: PortableTextBlock[];
  image?: SanityImage;
}

export interface AboutPage {
  title?: string;
  intro?: PortableTextBlock[];
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
  intro?: { eyebrow?: string; heading?: string; body?: PortableTextBlock[] };
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

export interface YogaEvent {
  _id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  priceLabel?: string;
  teacher?: string;
  category?: EventCategory;
  relatedProgram?: { title?: string; slug?: string } | null;
  description?: string;
  image?: SanityImage;
  registrationLink?: string;
  whatsappEnabled?: boolean;
}

export interface PastEvent {
  _id: string;
  title: string;
  date: string;
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
