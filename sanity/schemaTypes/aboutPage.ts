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
      initialValue: "Classical Hatha Yoga, taught with care.",
    }),
    defineField({
      name: "heroDescription",
      title: "Page introduction",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short text shown below the page title.",
      initialValue:
        "Know more about the teacher behind Nava Hatha Yoga in Albania — certified Classical Hatha Yoga training, practices taught as intended, based in Saranda & Tirana.",
    }),
    defineField({
      name: "intro",
      title: "Optional rich introduction",
      type: "blockContent",
      group: "content",
      description:
        "Optional longer introduction shown below the hero, before the teacher section.",
    }),
    defineField({
      name: "teacherStory",
      title: "About the Teacher",
      type: "object",
      group: "content",
      description:
        "The teacher introduction shown at the top of the About page, with the full story in a pop-up.",
      fields: [
        defineField({
          name: "nameLine",
          title: "Introduction line",
          type: "string",
          description: "E.g. “My name is Linda.”",
        }),
        defineField({
          name: "photo",
          title: "Photo",
          type: "imageWithAlt",
        }),
        defineField({
          name: "teaser",
          title: "Short introduction",
          type: "array",
          of: [{ type: "string" }],
          description: "One or two short paragraphs shown before “Read My Full Story”.",
        }),
        defineField({
          name: "storyTitle",
          title: "Full story title",
          type: "string",
          description: "Title of the pop-up, e.g. “My Full Story”.",
        }),
        defineField({
          name: "story",
          title: "Full story",
          type: "array",
          of: [{ type: "text", rows: 3 }],
          description: "The full story, paragraph by paragraph.",
        }),
      ],
    }),
    defineField({
      name: "highlightCards",
      title: "Teacher highlight cards",
      type: "array",
      group: "content",
      description:
        "Titles shown in the infinite ribbon under “About the Teacher”.",
      of: [
        {
          type: "object",
          fields: [
            { name: "eyebrow", title: "Eyebrow", type: "string" },
            { name: "title", title: "Title", type: "string" },
            { name: "stat", title: "Stat / emphasis line", type: "string" },
            { name: "body", title: "Body", type: "text", rows: 4 },
            {
              name: "showCertificationLogo",
              title: "Show certification logo",
              type: "boolean",
              initialValue: false,
            },
          ],
          preview: { select: { title: "title", subtitle: "eyebrow" } },
        },
      ],
      validation: (rule) => rule.max(12),
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
