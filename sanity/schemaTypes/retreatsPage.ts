import { defineField, defineType } from "sanity";

export const retreatsPage = defineType({
  name: "retreatsPage",
  title: "Retreats Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Page title",
      type: "string",
      group: "content",
      initialValue: "Immersive retreats",
    }),
    defineField({
      name: "heroDescription",
      title: "Page introduction",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short text shown below the page title.",
    }),
    defineField({
      name: "comingSoonHeading",
      title: "“Coming soon” heading",
      type: "string",
      group: "content",
      description: "Shown while there are no published retreats.",
    }),
    defineField({
      name: "comingSoonBody",
      title: "“Coming soon” text",
      type: "text",
      rows: 4,
      group: "content",
      description: "Shown while there are no published retreats.",
    }),
    defineField({
      name: "expectationsHeading",
      title: "“What to expect” heading",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "expectations",
      title: "“What to expect” cards",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Retreats Page" }),
  },
});
