import { defineField, defineType } from "sanity";

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "The URL for this program's page (auto-generated from the title).",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      group: "content",
      description: "Turn off to hide this program from the website.",
      initialValue: true,
    }),
    defineField({
      name: "orderRank",
      title: "Order",
      type: "number",
      group: "content",
      description: "Lower numbers appear first. Leave blank to sort alphabetically.",
    }),
    defineField({
      name: "shortIntro",
      title: "Short intro",
      type: "text",
      rows: 3,
      group: "content",
      description: "A brief summary shown on cards and at the top of the page.",
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: "body",
      title: "Detailed description",
      type: "blockContent",
      group: "content",
      description: "An educational description of the practice.",
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description:
        "Use careful language (e.g. 'may support', 'is designed to support').",
    }),
    defineField({
      name: "experiences",
      title: "What participants may develop or experience",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      group: "media",
    }),
    defineField({
      name: "symbol",
      title: "Abstract symbol",
      type: "imageWithAlt",
      group: "media",
      description: "Optional decorative symbol associated with this program.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderRankAsc",
      by: [{ field: "orderRank", direction: "asc" }],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "shortIntro", media: "image", published: "published" },
    prepare: ({ title, subtitle, media, published }) => ({
      title,
      subtitle: published ? subtitle : `(hidden) ${subtitle ?? ""}`,
      media,
    }),
  },
});
