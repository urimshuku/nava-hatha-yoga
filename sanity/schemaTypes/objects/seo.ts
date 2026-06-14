import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      description:
        "Shown in browser tabs and search results. Keep it under ~60 characters. Leave blank to use the page title.",
      validation: (rule) => rule.max(70).warning("Shorter titles display better."),
    }),
    defineField({
      name: "description",
      title: "SEO description",
      type: "text",
      rows: 3,
      description:
        "A short summary shown in search results (about 1-2 sentences, under ~160 characters).",
      validation: (rule) =>
        rule.max(180).warning("Shorter descriptions display better."),
    }),
  ],
});
