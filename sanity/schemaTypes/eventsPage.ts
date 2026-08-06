import { defineField, defineType } from "sanity";

export const eventsPage = defineType({
  name: "eventsPage",
  title: "Events Page",
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
      initialValue: "Events",
    }),
    defineField({
      name: "heroTitle",
      title: "Page title",
      type: "string",
      group: "content",
      initialValue: "Upcoming events",
    }),
    defineField({
      name: "heroDescription",
      title: "Page introduction",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "emptyTitle",
      title: "Empty state title",
      type: "string",
      group: "content",
      description: "Shown when there are no upcoming events.",
    }),
    defineField({
      name: "emptyDescription",
      title: "Empty state text",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "contactHeading",
      title: "Contact section heading",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "contactDescription",
      title: "Contact section text",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Events Page" }),
  },
});
