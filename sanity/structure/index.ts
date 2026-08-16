import type { StructureBuilder, StructureResolver } from "sanity/structure";

import { apiVersion } from "../env";
import { eventsList } from "./events";
import { sortProgramsForStudio, type ProgramNavItem } from "./programs";
import { retreatsList } from "./retreats";

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

function singleton(
  S: StructureBuilder,
  schemaType: string,
  title: string,
  documentId = schemaType,
) {
  return S.listItem()
    .title(title)
    .id(documentId)
    .child(S.document().schemaType(schemaType).documentId(documentId));
}

/**
 * Studio desk that follows the website: Home, Programs, Retreats, Events,
 * About, Contact, then Site Settings.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "homePage", "Home"),
      S.listItem()
        .title("Programs")
        .id("programs")
        .child(async () => {
          const client = context.getClient({ apiVersion });
          const programs = await client.fetch<ProgramNavItem[]>(
            `*[_type == "program"]{_id, title, "slug": slug.current}`,
          );
          const ordered = sortProgramsForStudio(programs ?? []);

          return S.list()
            .title("Programs")
            .items([
              singleton(S, "programsPage", "Programs page"),
              S.divider(),
              ...(ordered.length
                ? ordered.map((program) =>
                    S.listItem()
                      .title(program.title || "Untitled program")
                      .id(program._id)
                      .schemaType("program")
                      .child(
                        S.document()
                          .schemaType("program")
                          .documentId(program._id),
                      ),
                  )
                : [S.documentTypeListItem("program").title("All programs")]),
            ]);
        }),
      S.listItem()
        .title("Retreats")
        .id("retreats")
        .child(async () => retreatsList(S, context)),
      S.listItem()
        .title("Events")
        .id("events")
        .child(async () => eventsList(S, context)),
      singleton(S, "aboutPage", "About"),
      singleton(S, "contactPage", "Contact"),
      S.divider(),
      S.listItem()
        .title("Site Settings")
        .id("site-settings-group")
        .child(async () => {
          const client = context.getClient({ apiVersion });
          const legalPages = await client.fetch<
            Array<{ _id: string; title?: string; slug?: string }>
          >(
            `*[_type == "legalPage"]{_id, title, "slug": slug.current} | order(title asc)`,
          );

          return S.list()
            .title("Site Settings")
            .items([
              singleton(S, "siteSettings", "Site Settings"),
              singleton(S, "registerPage", "Registration form"),
              S.divider(),
              ...(legalPages ?? []).map((page) =>
                S.listItem()
                  .title(page.title || "Legal page")
                  .id(page._id)
                  .schemaType("legalPage")
                  .child(
                    S.document()
                      .schemaType("legalPage")
                      .documentId(page._id),
                  ),
              ),
            ]);
        }),
    ]);
