import type { StructureBuilder, StructureResolverContext } from "sanity/structure";

import { RetreatHowTo } from "../components/RetreatHowTo";
import { apiVersion } from "../env";

export const RETREAT_TEMPLATE_ID = "retreat-test-preview";

type RetreatNavItem = {
  _id: string;
  title?: string;
};

export async function retreatsList(
  S: StructureBuilder,
  context: StructureResolverContext,
) {
  const client = context.getClient({ apiVersion });
  const retreats = await client.fetch<RetreatNavItem[]>(
    `*[_type == "retreat" && !(_id in [$template, $draftTemplate])]{_id, title} | order(date desc)`,
    {
      template: RETREAT_TEMPLATE_ID,
      draftTemplate: `drafts.${RETREAT_TEMPLATE_ID}`,
    },
  );

  return S.list()
    .title("Retreats")
    .items([
      S.listItem()
        .title("Retreats page")
        .id("retreatsPage")
        .child(
          S.document().schemaType("retreatsPage").documentId("retreatsPage"),
        ),
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
        .id("retreat-template")
        .schemaType("retreat")
        .child(
          S.document().schemaType("retreat").documentId(RETREAT_TEMPLATE_ID),
        ),
      S.divider(),
      ...(retreats ?? []).map((retreat) =>
        S.listItem()
          .title(retreat.title || "Untitled retreat")
          .id(retreat._id)
          .schemaType("retreat")
          .child(S.document().schemaType("retreat").documentId(retreat._id)),
      ),
    ]);
}
