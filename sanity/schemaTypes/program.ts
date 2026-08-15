import { defineField, defineType } from "sanity";

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
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
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      description:
        "Core programs appear in the main list; special programs appear in the second list on the Programs page.",
      options: {
        list: [
          { title: "Core program", value: "main" },
          { title: "Special program", value: "special" },
        ],
        layout: "radio",
      },
      initialValue: "main",
    }),
    defineField({
      name: "orderRank",
      title: "Order",
      type: "number",
      group: "content",
      description: "Lower numbers appear first. Leave blank to sort alphabetically.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      group: "content",
      description:
        "Shown in the program page sidebar and on program cards. Falls back to the built-in image when empty.",
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
      name: "contextLine",
      title: "Context line",
      type: "text",
      rows: 2,
      group: "content",
      description:
        "Optional line under the short intro (e.g. offered in Albania, based in Saranda & Tirana).",
    }),
    defineField({
      name: "relatedPrograms",
      title: "Related programs",
      type: "array",
      group: "content",
      of: [{ type: "ctaLink" }],
      description: "Shown in the program sidebar as Related links.",
    }),
    defineField({
      name: "whatIs",
      title: "What is this practice?",
      type: "blockContent",
      group: "content",
      description:
        "Introductory overview for the “What is [program name]?” section on the page.",
    }),
    defineField({
      name: "aboutThePractice",
      title: "About the Practice",
      type: "blockContent",
      group: "content",
      description: "A deeper description of how the practice is taught and approached.",
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
      name: "intensity",
      title: "Intensity",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Low", value: "Low" },
          { title: "Medium", value: "Medium" },
          { title: "High", value: "High" },
        ],
        layout: "radio",
      },
      description: "Shown in the program sidebar and on related event cards.",
    }),
    defineField({
      name: "practiceIndependently",
      title: "After the Program",
      type: "blockContent",
      group: "content",
      description: "Guidance on continuing the practice at home after completing the program.",
    }),
    defineField({
      name: "privateAndGroupSessions",
      title: "Private and Group Sessions",
      type: "blockContent",
      group: "content",
      description:
        "How this practice is offered in group and private settings. Shown in the program sidebar.",
    }),
    defineField({
      name: "beforeProgramTitle",
      title: "“Before the Program” section title",
      type: "string",
      group: "content",
      description:
        "Optional. Overrides the default section title (e.g. “Pre-Requisite”). Leave blank to use “Before the Program”.",
    }),
    defineField({
      name: "beforeProgramNotes",
      title: "“Before the Program” notes",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description:
        "Optional. Overrides the default notes for this program (e.g. prerequisites). Leave empty to use the site-wide default from Site Settings.",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      group: "content",
      description: "Optional YouTube link shown in the program sidebar.",
    }),
    defineField({
      name: "videoTitle",
      title: "Video title",
      type: "string",
      group: "content",
      description:
        "Optional label for the video link (e.g. “Sadhguru speaks on Angamardana”). Defaults to “[Program] on YouTube”.",
    }),
    defineField({
      name: "priceLabel",
      title: "Price",
      type: "string",
      group: "content",
      description: "Shown in the sidebar, e.g. “300€” or “Contact for details”.",
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
    select: { title: "title", subtitle: "shortIntro", published: "published" },
    prepare: ({ title, subtitle, published }) => ({
      title,
      subtitle: published ? subtitle : `(hidden) ${subtitle ?? ""}`,
    }),
  },
});
