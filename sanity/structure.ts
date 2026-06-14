import type { StructureResolver } from "sanity/structure";

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
      S.divider(),
      S.documentTypeListItem("program").title("Programs"),
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("retreat").title("Retreats"),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Legal Pages"),
    ]);
