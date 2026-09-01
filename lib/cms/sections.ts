/**
 * The editor's navigation, arranged the way the website itself is arranged, so
 * finding something to change means thinking about where it appears on the site.
 */

import { LEGAL_PAGES, REGISTRATION_PAGES } from "./editable-pages";

export interface CmsNavItem {
  label: string;
  href: string;
  /** Plain-language note about where this content shows up on the website. */
  description: string;
}

export interface CmsNavSection {
  heading: string;
  items: CmsNavItem[];
}

/** There is no editor hub: login and /admin open Events. */
export const CMS_DEFAULT_PATH = "/admin/events";

export const CMS_SECTIONS: CmsNavSection[] = [
  {
    heading: "Content",
    items: [
      {
        label: "Events",
        href: "/admin/events",
        description:
          "Dates, times and prices for sessions. Shown on the Events page and the home page.",
      },
      {
        label: "Retreats",
        href: "/admin/retreats",
        description:
          "Retreats with their dates, photos and descriptions. Shown on the Retreats pages.",
      },
      {
        label: "Programs",
        href: "/admin/programs",
        description:
          "The yoga programs and their descriptions. Shown on the Programs pages.",
      },
    ],
  },
  {
    heading: "Registration",
    items: REGISTRATION_PAGES.map((page) => ({
      label: page.label,
      href: `/admin/pages/${page.id}`,
      description: page.summary,
    })),
  },
  {
    heading: "Main Pages",
    items: [
      {
        label: "Main Pages",
        href: "/admin/pages",
        description:
          "The wording, photos and buttons on each main page of the website.",
      },
    ],
  },
  {
    heading: "Legal",
    items: LEGAL_PAGES.map((page) => ({
      label: page.label,
      href: `/admin/pages/${page.id}`,
      description: page.summary,
    })),
  },
];
