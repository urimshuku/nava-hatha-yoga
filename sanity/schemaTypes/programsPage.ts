import { defineField, defineType } from "sanity";

export const programsPage = defineType({
  name: "programsPage",
  title: "Programs Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero eyebrow",
      type: "string",
      group: "content",
      initialValue: "Programs & Offerings",
    }),
    defineField({
      name: "heroTitle",
      title: "Page title",
      type: "string",
      group: "content",
      initialValue: "Classical Hatha Yoga practices",
    }),
    defineField({
      name: "heroDescription",
      title: "Page introduction",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "freeOfferings",
      title: "Free offerings",
      type: "object",
      group: "content",
      fields: [
        { name: "eyebrow", title: "Eyebrow", type: "string" },
        { name: "lead", title: "Lead text", type: "text", rows: 2 },
        {
          name: "items",
          title: "Offerings",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "title", title: "Title", type: "string" },
                { name: "description", title: "Description", type: "text", rows: 3 },
              ],
              preview: { select: { title: "title", subtitle: "description" } },
            },
          ],
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
    prepare: () => ({ title: "Programs Page" }),
  },
});
