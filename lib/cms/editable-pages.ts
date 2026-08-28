import { SINGLETON_SLUG, type CmsDocumentType } from "./repository";
import type { DocumentSchema } from "./schema";
import {
  aboutPageSchema,
  contactPageSchema,
  eventsPageSchema,
  homePageSchema,
  legalPageSchema,
  programsPageSchema,
  registerPageSchema,
  retreatsPageSchema,
  siteSettingsSchema,
} from "./schemas";

/**
 * The pages that exist once each, in the order they appear in the editor.
 *
 * One route (/admin/pages/[page]) and one save action serve all of them: the
 * entry below says which document to write and which schema describes it, so a
 * new editable page needs an entry here and nothing else.
 */

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
}

export const EDITABLE_PAGES: EditablePage[] = [
  {
    id: "home",
    label: "Home",
    summary: "The front page: opening section, highlights, and the invitations.",
    type: "homePage",
    slug: SINGLETON_SLUG,
    schema: homePageSchema,
    revalidate: ["/"],
  },
  {
    id: "about",
    label: "About",
    summary: "Your story, the highlight cards and the sections with photos.",
    type: "aboutPage",
    slug: SINGLETON_SLUG,
    schema: aboutPageSchema,
    revalidate: ["/about"],
  },
  {
    id: "programs",
    label: "Programs page",
    summary: "The wording around the list of programs.",
    type: "programsPage",
    slug: SINGLETON_SLUG,
    schema: programsPageSchema,
    revalidate: ["/programs"],
  },
  {
    id: "events",
    label: "Events page",
    summary: "The wording of the events page and the past events page.",
    type: "eventsPage",
    slug: SINGLETON_SLUG,
    schema: eventsPageSchema,
    revalidate: ["/events", "/events/archive"],
  },
  {
    id: "retreats",
    label: "Retreats page",
    summary: "What to expect, working with partners, and the past retreats page.",
    type: "retreatsPage",
    slug: SINGLETON_SLUG,
    schema: retreatsPageSchema,
    revalidate: ["/retreats", "/retreats/archive"],
  },
  {
    id: "contact",
    label: "Contact",
    summary: "The contact page and where your classes are held.",
    type: "contactPage",
    slug: SINGLETON_SLUG,
    schema: contactPageSchema,
    revalidate: ["/contact"],
  },
  {
    id: "register",
    label: "Registration",
    summary:
      "The registration form: health questions, the disclaimer and the guidelines.",
    type: "registerPage",
    slug: SINGLETON_SLUG,
    schema: registerPageSchema,
    revalidate: ["/register"],
  },
  {
    id: "privacy-policy",
    label: "Privacy policy",
    summary: "The privacy policy page.",
    type: "legalPage",
    slug: "privacy-policy",
    schema: legalPageSchema("/privacy-policy"),
    revalidate: ["/privacy-policy"],
  },
  {
    id: "terms-of-service",
    label: "Terms of service",
    summary: "The terms of service page.",
    type: "legalPage",
    slug: "terms-of-service",
    schema: legalPageSchema("/terms-of-service"),
    revalidate: ["/terms-of-service"],
  },
  {
    id: "cookie-policy",
    label: "Cookie policy",
    summary: "The cookie policy page.",
    type: "legalPage",
    slug: "cookie-policy",
    schema: legalPageSchema("/cookie-policy"),
    revalidate: ["/cookie-policy"],
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
  },
];

export function findEditablePage(id: string): EditablePage | undefined {
  return EDITABLE_PAGES.find((page) => page.id === id);
}
