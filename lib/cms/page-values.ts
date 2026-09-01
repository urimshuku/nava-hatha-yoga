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
import { getDocument, isTombstone } from "@/lib/cms/repository";
import type { HomePage, RegisterPage } from "@/lib/cms/content-types";
import {
  REGISTER_DOCUMENT_SLUG,
  registerPageCopiesWorkshop,
  registrationKindFromDocumentSlug,
} from "@/lib/registration-kind";

import type { EditablePage } from "./editable-pages";

/**
 * Fills the editing form from the working copy in the CMS when one exists, so
 * a Save that has not been published is what the editor sees next time.
 * Pages that have never been saved here use the wording currently on the
 * website (or the built-in defaults).
 */
export async function loadPageValues(
  page: EditablePage,
): Promise<Record<string, unknown>> {
  const stored = await getDocument<Record<string, unknown>>(page.type, page.slug);
  if (stored && !isTombstone(stored.data)) {
    return valuesFromWorkingCopy(page, stored.data);
  }

  // Module and Retreat Registration start as a copy of Workshop Registration
  // until they are saved on their own.
  if (page.type === "registerPage" && registerPageCopiesWorkshop(page.slug)) {
    const workshop = await getDocument<Record<string, unknown>>(
      "registerPage",
      REGISTER_DOCUMENT_SLUG.workshop,
    );
    if (workshop && !isTombstone(workshop.data)) {
      return valuesFromWorkingCopy(page, workshop.data);
    }
  }

  return valuesFromPublicSite(page);
}

function valuesFromWorkingCopy(
  page: EditablePage,
  data: Record<string, unknown>,
): Record<string, unknown> {
  if (page.type === "homePage") {
    const home = data as HomePage;
    return {
      ...data,
      featuredProgramSlugs: home.featuredProgramSlugs?.length
        ? home.featuredProgramSlugs
        : (home.featuredPrograms ?? [])
            .map((program) => program?.slug)
            .filter(Boolean),
    };
  }

  if (page.type === "registerPage") {
    return {
      heroEyebrow: data.heroEyebrow,
      heroTitle: data.heroTitle,
      heroDescription: data.heroDescription,
      ...resolveRegisterContent(data as RegisterPage),
    };
  }

  return { ...data };
}

async function valuesFromPublicSite(
  page: EditablePage,
): Promise<Record<string, unknown>> {
  switch (page.type) {
    case "homePage": {
      const home = await getHomePage();
      return {
        ...home,
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
      const stored = await getRegisterPage(
        registrationKindFromDocumentSlug(page.slug),
      );
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
