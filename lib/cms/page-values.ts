import { resolveRegisterContent } from "@/lib/register-config";
import {
  getAboutPage,
  getContactPage,
  getEventsPage,
  getHomePage,
  getLegalPage,
  getProgramsPage,
  getRegisterPage,
  getRetreatsPage,
  getSiteSettings,
} from "@/lib/cms/site-content";

import type { EditablePage } from "./editable-pages";

/**
 * The page exactly as the website shows it today, used to fill the editing form.
 *
 * These are the same getters the website uses, so whatever the client sees on the
 * page is what she sees in the editor.
 */
export async function loadPageValues(
  page: EditablePage,
): Promise<Record<string, unknown>> {
  switch (page.type) {
    case "homePage": {
      const home = await getHomePage();
      return {
        ...home,
        // The form edits the chosen programs as a list of web addresses.
        featuredProgramSlugs: (home.featuredPrograms ?? [])
          .map((program) => program?.slug)
          .filter(Boolean),
      };
    }

    case "aboutPage":
      return { ...(await getAboutPage()) };

    case "programsPage":
      return { ...(await getProgramsPage()) };

    case "eventsPage":
      return { ...(await getEventsPage()) };

    case "retreatsPage":
      return { ...(await getRetreatsPage()) };

    case "contactPage":
      return { ...(await getContactPage()) };

    case "siteSettings":
      return { ...(await getSiteSettings()) };

    case "registerPage": {
      const stored = await getRegisterPage();
      // The registration wording lives in code by default, so the form has to be
      // seeded from the resolved content rather than from the stored page alone.
      return {
        heroEyebrow: stored?.heroEyebrow,
        heroTitle: stored?.heroTitle,
        heroDescription: stored?.heroDescription,
        ...resolveRegisterContent(stored),
      };
    }

    case "legalPage":
      return { ...((await getLegalPage(page.slug)) ?? {}) };

    default:
      return {};
  }
}
