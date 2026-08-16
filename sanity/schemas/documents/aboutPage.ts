import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Small Label",
      type: "string",
      group: "content",
      description: "Short label above the page title (for example “About”).",
      initialValue: "About",
    }),
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      group: "content",
      initialValue: "Classical Hatha Yoga, taught with care.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Page Introduction",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short text shown below the page title.",
      initialValue:
        "Know more about the teacher behind Nava Hatha Yoga in Albania — certified Classical Hatha Yoga training, practices taught as intended, based in Saranda & Tirana.",
    }),
    defineField({
      name: "intro",
      title: "Optional Longer Introduction",
      type: "blockContent",
      group: "content",
      description:
        "Optional longer introduction shown below the hero, before the teacher section. Leave empty to hide it.",
    }),
    defineField({
      name: "teacherSectionTitle",
      title: "Teacher Section Heading",
      type: "string",
      group: "content",
      description: "Heading above the teacher introduction.",
      initialValue: "About the Teacher",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "teacherStory",
      title: "About the Teacher",
      type: "object",
      group: "content",
      description:
        "The teacher introduction at the top of the About page, with the full story in a pop-up.",
      fields: [
        defineField({
          name: "nameLine",
          title: "Introduction Line",
          type: "string",
          description: "For example: “My name is Linda.”",
        }),
        defineField({
          name: "photo",
          title: "Photo",
          type: "imageWithAlt",
        }),
        defineField({
          name: "teaser",
          title: "Short Introduction",
          type: "array",
          of: [{ type: "string" }],
          description: "One or two short paragraphs shown before “Read My Full Story”.",
        }),
        defineField({
          name: "storyTitle",
          title: "Full Story Title",
          type: "string",
          description: "Title of the pop-up, for example “My Full Story”.",
        }),
        defineField({
          name: "story",
          title: "Full Story",
          type: "array",
          of: [{ type: "text", rows: 3 }],
          description: "The full story, paragraph by paragraph.",
        }),
      ],
    }),
    defineField({
      name: "highlightCards",
      title: "Teacher Highlight Ribbon",
      type: "array",
      group: "content",
      description:
        "Titles shown in the scrolling ribbon under “About the Teacher”. Only the title is shown on the website.",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            {
              name: "eyebrow",
              title: "Eyebrow",
              type: "string",
              hidden: true,
              description:
                "LEGACY / STORED / NOT CURRENTLY DISPLAYED. The website ribbon uses Title only. This value cannot override visible About content.",
            },
            {
              name: "stat",
              title: "Stat / emphasis line",
              type: "string",
              hidden: true,
              description:
                "LEGACY / STORED / NOT CURRENTLY DISPLAYED. The website ribbon uses Title only. This value cannot override visible About content.",
            },
            {
              name: "body",
              title: "Body",
              type: "text",
              rows: 4,
              hidden: true,
              description:
                "LEGACY / STORED / NOT CURRENTLY DISPLAYED. The website ribbon uses Title only. This value cannot override visible About content.",
            },
            {
              name: "showCertificationLogo",
              title: "Show certification logo",
              type: "boolean",
              hidden: true,
              initialValue: false,
              description:
                "LEGACY / STORED / NOT CURRENTLY DISPLAYED. The website ribbon uses Title only. This value cannot override visible About content.",
            },
          ],
          preview: { select: { title: "title" } },
        },
      ],
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      group: "content",
      of: [{ type: "aboutSection" }],
      description:
        "The main sections on the About page, in the same order they appear on the website.",
      validation: (rule) => rule.min(1).max(6),
    }),
    defineField({
      name: "finalCta",
      title: "Closing Call to Action",
      type: "object",
      group: "content",
      description: "Shown at the bottom of the About page.",
      fields: [
        { name: "heading", title: "Heading", type: "string" },
        { name: "body", title: "Body", type: "text", rows: 3 },
        { name: "cta", title: "Button", type: "ctaLink" },
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
    prepare: () => ({ title: "About" }),
  },
});
