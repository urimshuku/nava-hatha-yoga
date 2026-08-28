/**
 * The editor's navigation, arranged the way the website itself is arranged, so
 * finding something to change means thinking about where it appears on the site.
 */

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

export const CMS_SECTIONS: CmsNavSection[] = [
  {
    heading: "Pages",
    items: [
      {
        label: "All pages",
        href: "/admin/pages",
        description:
          "The wording, photos and buttons on each page of the website.",
      },
    ],
  },
  {
    heading: "Website content",
    items: [
      {
        label: "Events",
        href: "/admin/events",
        description:
          "Dates, times and prices for sessions. Shown on the Events page and the home page.",
      },
      {
        label: "Programs",
        href: "/admin/programs",
        description:
          "The yoga programs and their descriptions. Shown on the Programs pages.",
      },
      {
        label: "Retreats",
        href: "/admin/retreats",
        description:
          "Retreats with their dates, photos and descriptions. Shown on the Retreats pages.",
      },
    ],
  },
  {
    heading: "Settings",
    items: [
      {
        label: "Site settings",
        href: "/admin/pages/settings",
        description:
          "Contact details and the notes reused across program and event pages.",
      },
    ],
  },
];
