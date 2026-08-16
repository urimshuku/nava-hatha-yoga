import type { StructureBuilder, StructureResolverContext } from "sanity/structure";

import { apiVersion } from "../env";

type EventNavItem = {
  _id: string;
  title?: string;
  date?: string;
};

export async function eventsList(
  S: StructureBuilder,
  context: StructureResolverContext,
) {
  const client = context.getClient({ apiVersion });
  const events = await client.fetch<EventNavItem[]>(
    `*[_type == "event"]{_id, title, date} | order(date asc)`,
  );

  return S.list()
    .title("Events")
    .items([
      S.listItem()
        .title("Events page")
        .id("eventsPage")
        .child(S.document().schemaType("eventsPage").documentId("eventsPage")),
      S.divider(),
      ...(events ?? []).map((event) =>
        S.listItem()
          .title(event.title || "Untitled event")
          .id(event._id)
          .schemaType("event")
          .child(S.document().schemaType("event").documentId(event._id)),
      ),
    ]);
}
