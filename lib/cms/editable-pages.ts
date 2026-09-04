import { REGISTER_DOCUMENT_SLUG } from "@/lib/registration-kind";

import { SINGLETON_SLUG, type CmsDocumentType } from "./repository";
import type { DocumentSchema } from "./schema";
import {
  aboutPageSchema,
  contactPageSchema,
  eventsPageSchema,
  freeOfferingRegisterPageSchema,
  homePageSchema,
  legalPageSchema,
  moduleRegisterPageSchema,
  programsPageSchema,
  retreatRegisterPageSchema,
  retreatsPageSchema,
  siteSettingsSchema,
  workshopRegisterPageSchema,
} from "./schemas";

/**
 * The pages that exist once each, in the order they appear in the editor.
 *
 * One route (/admin/pages/[page]) and one save action serve all of them: the
 * entry below says which document to write and which schema describes it, so a
 * new editable page needs an entry here and nothing else.
 */

export type EditablePageSection = "pages" | "registration" | "legal";

export interface EditablePage {
  /** URL segment under /admin/pages/ and the key used by the navigation. */
  id: string;
  label: string;
  /** One-line description shown in the editor's page list. */
  summary: string;
  type: CmsDocumentType;
  slug: string;
  schema: DocumentSchema;
  /** Website paths whose cached copy must be dropped after a save. */
  revalidate: string[];
  /** Sidebar group. Main Pages appear in the list; registration and legal have their own nav. */
  section?: EditablePageSection;
}

export const MAIN_PAGES: EditablePage[] = [
  {
    id: "home",
    label: "Home Page",
    summary: "The front page: opening section, highlights, and the invitations.",
    type: "homePage",
    slug: SINGLETON_SLUG,
    schema: homePageSchema,
    revalidate: ["/"],
    section: "pages",
  },
  {
    id: "about",
    label: "About Page",
    summary: "Your story, the highlight cards and the sections with photos.",
    type: "aboutPage",
    slug: SINGLETON_SLUG,
    schema: aboutPageSchema,
    revalidate: ["/about"],
    section: "pages",
  },
  {
    id: "programs",
    label: "Programs & Offerings Page",
    summary: "The wording around the list of programs and free offerings.",
    type: "programsPage",
    slug: SINGLETON_SLUG,
    schema: programsPageSchema,
    revalidate: ["/programs"],
    section: "pages",
  },
  {
    id: "events",
    label: "Events & Partner Program Page",
    summary: "The wording of the events page and the past events page.",
    type: "eventsPage",
    slug: SINGLETON_SLUG,
    schema: eventsPageSchema,
    revalidate: ["/events", "/events/archive"],
    section: "pages",
  },
  {
    id: "retreats",
    label: "Retreats Page",
    summary: "What to expect and working with partners.",
    type: "retreatsPage",
    slug: SINGLETON_SLUG,
    schema: retreatsPageSchema,
    revalidate: ["/retreats", "/events", "/events/archive"],
    section: "pages",
  },
  {
    id: "contact",
    label: "Contact Page",
    summary: "The contact page and where your classes are held.",
    type: "contactPage",
    slug: SINGLETON_SLUG,
    schema: contactPageSchema,
    revalidate: ["/contact"],
    section: "pages",
  },
  {
    id: "settings",
    label: "Site settings",
    summary:
      "Contact details and the notes that appear across program and event pages.",
    type: "siteSettings",
    slug: SINGLETON_SLUG,
    schema: siteSettingsSchema,
    revalidate: ["/", "/contact", "/programs", "/events", "/about"],
    section: "pages",
  },
];

export const LEGAL_PAGES: EditablePage[] = [
  {
    id: "privacy-policy",
    label: "Privacy policy",
    summary: "The privacy policy page.",
    type: "legalPage",
    slug: "privacy-policy",
    schema: legalPageSchema("/privacy-policy"),
    revalidate: ["/privacy-policy"],
    section: "legal",
  },
  {
    id: "terms-of-service",
    label: "Terms of service",
    summary: "The terms of service page.",
    type: "legalPage",
    slug: "terms-of-service",
    schema: legalPageSchema("/terms-of-service"),
    revalidate: ["/terms-of-service"],
    section: "legal",
  },
  {
    id: "cookie-policy",
    label: "Cookie policy",
    summary: "The cookie policy page.",
    type: "legalPage",
    slug: "cookie-policy",
    schema: legalPageSchema("/cookie-policy"),
    revalidate: ["/cookie-policy"],
    section: "legal",
  },
];

export const REGISTRATION_PAGES: EditablePage[] = [
  {
    id: "register",
    label: "Workshop Registration",
    summary:
      "The workshop form. Add, remove or reorder steps, then edit the fields on each one.",
    type: "registerPage",
    slug: REGISTER_DOCUMENT_SLUG.workshop,
    schema: workshopRegisterPageSchema,
    revalidate: ["/register"],
    section: "registration",
  },
  {
    id: "register-free",
    label: "Free Offering Registration",
    summary:
      "Starts as a one-page form for free sessions. Add or remove steps the same way as the other registration pages.",
    type: "registerPage",
    slug: REGISTER_DOCUMENT_SLUG.free,
    schema: freeOfferingRegisterPageSchema,
    revalidate: ["/register"],
    section: "registration",
  },
  {
    id: "register-module",
    label: "Modular Registration",
    summary:
      "The full form for modular registration. Starts as a copy of Workshop Registration.",
    type: "registerPage",
    slug: REGISTER_DOCUMENT_SLUG.module,
    schema: moduleRegisterPageSchema,
    revalidate: ["/register"],
    section: "registration",
  },
  {
    id: "register-retreat",
    label: "Retreat Registration",
    summary:
      "The full form used when someone registers for a retreat. Starts as a copy of Workshop Registration.",
    type: "registerPage",
    slug: REGISTER_DOCUMENT_SLUG.retreat,
    schema: retreatRegisterPageSchema,
    revalidate: ["/register"],
    section: "registration",
  },
];

export const EDITABLE_PAGES: EditablePage[] = [
  ...MAIN_PAGES,
  ...LEGAL_PAGES,
  ...REGISTRATION_PAGES,
];

export function findEditablePage(id: string): EditablePage | undefined {
  return EDITABLE_PAGES.find((page) => page.id === id);
}
