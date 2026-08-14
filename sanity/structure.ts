import type { StructureResolver } from "sanity/structure";

import { RetreatHowTo } from "./components/RetreatHowTo";

/** Document types that must only ever have a single, fixed-ID document. */
export const SINGLETON_TYPES = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "contactPage",
  "registerPage",
  "programsPage",
  "eventsPage",
  "retreatsPage",
]);

/**
 * A friendly, grouped Studio for a non-technical client:
 * singletons (one-off pages) are separated from collections.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("About Page")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Programs Page")
        .id("programsPage")
        .child(
          S.document().schemaType("programsPage").documentId("programsPage"),
        ),
      S.listItem()
        .title("Events Page")
        .id("eventsPage")
        .child(S.document().schemaType("eventsPage").documentId("eventsPage")),
      S.listItem()
        .title("Contact Page")
        .id("contactPage")
        .child(
          S.document().schemaType("contactPage").documentId("contactPage"),
        ),
      S.listItem()
        .title("Register Page")
        .id("registerPage")
        .child(
          S.document().schemaType("registerPage").documentId("registerPage"),
        ),
      S.listItem()
        .title("Retreats Page")
        .id("retreatsPage")
        .child(
          S.document().schemaType("retreatsPage").documentId("retreatsPage"),
        ),
      S.divider(),
      S.documentTypeListItem("program").title("Programs"),
      S.documentTypeListItem("event").title("Events"),
      S.listItem()
        .title("How to add a retreat")
        .id("retreat-how-to")
        .child(
          S.component(RetreatHowTo)
            .id("retreat-how-to-pane")
            .title("How to add a retreat"),
        ),
      S.listItem()
        .title("Retreat template")
        .id("retreat-test-preview")
        .schemaType("retreat")
        .child(
          S.document()
            .schemaType("retreat")
            .documentId("retreat-test-preview"),
        ),
      S.documentTypeListItem("retreat").title("Retreats"),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Legal Pages"),
    ]);
