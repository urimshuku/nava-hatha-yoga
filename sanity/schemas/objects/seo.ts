import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "SEO Title",
      type: "string",
      description:
        "Title shown primarily in Google search results and browser tabs. Keep it natural and under approximately 60 characters when possible. Leave blank to use the page title.",
      validation: (rule) => rule.max(70).warning("Shorter titles display better."),
    }),
    defineField({
      name: "description",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description:
        "A short summary shown in search results (about 1–2 sentences, under approximately 160 characters).",
      validation: (rule) =>
        rule.max(180).warning("Shorter descriptions display better."),
    }),
    defineField({
      name: "image",
      title: "Social Image",
      type: "imageWithAlt",
      description:
        "Optional image used when this page is shared. If empty, the website uses the page image or the site default. The page URL for search engines is generated automatically.",
    }),
  ],
});
