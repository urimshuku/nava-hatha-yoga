import { defineField, defineType } from "sanity";

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fieldsets: [
    {
      name: "hero",
      title: "Hero",
      options: { collapsible: false },
    },
    {
      name: "sidebar",
      title: "Sidebar",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "pageSettings",
      title: "Page settings",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      fieldset: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortIntro",
      title: "Short Introduction",
      type: "text",
      rows: 3,
      group: "content",
      fieldset: "hero",
      description: "Shown on program cards and under the title on this program’s page.",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "contextLine",
      title: "Location / Context Line",
      type: "text",
      rows: 2,
      group: "content",
      fieldset: "hero",
      hidden: true,
      description:
        "LEGACY / STORED / NOT CURRENTLY DISPLAYED. Previously shown under the program introduction. Kept so existing values are not lost. Cannot override visible program content.",
    }),
    defineField({
      name: "whatIs",
      title: "What Is This Practice?",
      type: "blockContent",
      group: "content",
      description: "First main section on the program page.",
    }),
    defineField({
      name: "aboutThePractice",
      title: "About the Practice",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description: "Use careful language (for example “may support”, “is designed to support”).",
    }),
    defineField({
      name: "beforeProgramTitle",
      title: "Before the Program — Section Title",
      type: "string",
      group: "content",
      description:
        "Optional. Leave blank to use “Before the Program”. Use “Pre-Requisite” when this practice has a requirement.",
    }),
    defineField({
      name: "beforeProgramNotes",
      title: "Before the Program — Notes",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description:
        "Optional. Leave empty to use the site-wide default from Site Settings.",
    }),
    defineField({
      name: "practiceIndependently",
      title: "After the Program",
      type: "blockContent",
      group: "content",
      description: "Guidance on continuing the practice at home after completing the program.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      group: "content",
      fieldset: "sidebar",
      description:
        "Shown in the program page sidebar and on program cards. The built-in image is used when this is empty.",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      group: "content",
      fieldset: "sidebar",
      description: "Optional YouTube link shown in the sidebar.",
    }),
    defineField({
      name: "videoTitle",
      title: "Video Title",
      type: "string",
      group: "content",
      fieldset: "sidebar",
      description:
        "Optional label for the video (for example “Sadhguru speaks on Angamardana”). Defaults to “[Program] on YouTube”.",
    }),
    defineField({
      name: "intensity",
      title: "Intensity",
      type: "string",
      group: "content",
      fieldset: "sidebar",
      options: {
        list: [
          { title: "Low", value: "Low" },
          { title: "Medium", value: "Medium" },
          { title: "High", value: "High" },
        ],
        layout: "radio",
      },
      description: "Shown in the sidebar and on related event cards.",
    }),
    defineField({
      name: "priceLabel",
      title: "Price",
      type: "string",
      group: "content",
      fieldset: "sidebar",
      description:
        "Stored for this program (for example “300€”). The sidebar price is currently hidden on the website.",
    }),
    defineField({
      name: "privateAndGroupSessions",
      title: "Private and Group Sessions",
      type: "blockContent",
      group: "content",
      fieldset: "sidebar",
      description: "How this practice is offered. Shown in the sidebar above the buttons.",
    }),
    defineField({
      name: "relatedPrograms",
      title: "Related Programs",
      type: "array",
      group: "content",
      fieldset: "sidebar",
      of: [{ type: "ctaLink" }],
      description:
        "Shown in the sidebar as Related links. Use a program path (for example /programs/upa-yoga) or another site page such as /about.",
    }),
    defineField({
      name: "published",
      title: "Show on the website",
      type: "boolean",
      group: "content",
      fieldset: "pageSettings",
      description: "Turn off to hide this program from the website.",
      initialValue: true,
    }),
    defineField({
      name: "slug",
      title: "Page URL",
      type: "slug",
      group: "content",
      fieldset: "pageSettings",
      description:
        "The address of this program’s page. Auto-generated from the title. Do not change existing URLs unless you intend to move the page.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Listing group",
      type: "string",
      group: "content",
      fieldset: "pageSettings",
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
      title: "Order on the Programs page",
      type: "number",
      group: "content",
      fieldset: "pageSettings",
      description:
        "Controls the live /programs page order (lower numbers appear first). This currently matches the Studio sidebar order. Do not change this number unless you intend to change the public website order.",
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
      title: "Title A–Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      published: "published",
      media: "image",
    },
    prepare: ({ title, category, published, media }) => {
      const kind = category === "special" ? "Special program" : "Program";
      return {
        title: title || "Untitled program",
        subtitle: published === false ? `Hidden · ${kind}` : kind,
        media,
      };
    },
  },
});
