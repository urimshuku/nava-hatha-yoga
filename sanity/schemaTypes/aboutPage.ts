import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "content",
      initialValue: "About Ananta Hatha Yoga",
    }),
    defineField({
      name: "intro",
      title: "Page introduction",
      type: "blockContent",
      group: "content",
      description:
        "Optional short introduction shown below the page heading, before the main sections.",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "content",
      of: [{ type: "aboutSection" }],
      description:
        "The four main sections on the About page. Each section supports a title, image, and text.",
      validation: (rule) => rule.min(1).max(6),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
