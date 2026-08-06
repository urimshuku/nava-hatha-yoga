import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero section",
      type: "object",
      group: "hero",
      fields: [
        { name: "headline", title: "Headline", type: "string" },
        {
          name: "subtitle",
          title: "Subtitle",
          type: "string",
          description: 'e.g. "Now in Albania, and Beyond."',
        },
        { name: "supportingText", title: "Supporting text", type: "text", rows: 3 },
        { name: "primaryCta", title: "Primary button", type: "ctaLink" },
        { name: "secondaryCta", title: "Secondary button", type: "ctaLink" },
        { name: "image", title: "Background / hero image", type: "imageWithAlt" },
      ],
    }),
    defineField({
      name: "highlights",
      title: "Hero highlights",
      type: "object",
      group: "hero",
      fields: [
        {
          name: "items",
          title: "Highlights",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "text", title: "Text", type: "string" },
                {
                  name: "lines",
                  title: "Line breaks (optional)",
                  type: "array",
                  of: [{ type: "string" }],
                  description:
                    "If set, each entry is shown on its own line instead of the single text field.",
                },
              ],
              preview: { select: { title: "text" } },
            },
          ],
          validation: (rule) => rule.max(3),
        },
        {
          name: "closingQuote",
          title: "Closing quote",
          type: "string",
          description: 'e.g. "In balance. Life unfolds."',
        },
      ],
    }),
    defineField({
      name: "intro",
      title: "What is Classical Hatha Yoga?",
      type: "object",
      group: "sections",
      fields: [
        { name: "eyebrow", title: "Eyebrow (small label)", type: "string" },
        { name: "heading", title: "Heading", type: "string" },
        { name: "body", title: "Body", type: "blockContent" },
        {
          name: "videoUrl",
          title: "YouTube video URL",
          type: "url",
          description: "Optional video shown below the intro text.",
        },
      ],
    }),
    defineField({
      name: "featuredProgramsSection",
      title: "Featured programs section",
      type: "object",
      group: "sections",
      fields: [
        { name: "eyebrow", title: "Eyebrow", type: "string" },
        { name: "title", title: "Heading", type: "string" },
        { name: "description", title: "Description", type: "text", rows: 2 },
        { name: "ctaLabel", title: "Button label", type: "string" },
      ],
    }),
    defineField({
      name: "featuredPrograms",
      title: "Featured programs",
      type: "array",
      group: "sections",
      description: "Choose 3-6 programs to feature. Drag to reorder.",
      of: [{ type: "reference", to: [{ type: "program" }] }],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "upcomingEventsSection",
      title: "Upcoming events section",
      type: "object",
      group: "sections",
      fields: [
        { name: "eyebrow", title: "Eyebrow", type: "string" },
        { name: "title", title: "Heading", type: "string" },
        { name: "description", title: "Description", type: "text", rows: 2 },
        { name: "emptyTitle", title: "Empty state title", type: "string" },
        { name: "emptyDescription", title: "Empty state text", type: "text", rows: 2 },
        { name: "ctaLabel", title: "See-all button label", type: "string" },
      ],
    }),
    defineField({
      name: "privateCorporate",
      title: "Private Sessions",
      type: "object",
      group: "sections",
      fields: [
        { name: "heading", title: "Heading", type: "string" },
        { name: "lead", title: "Lead text", type: "text", rows: 3 },
        {
          name: "offerings",
          title: "Offerings",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "title", title: "Title", type: "string" },
                { name: "body", title: "Body", type: "text", rows: 3 },
              ],
              preview: { select: { title: "title", subtitle: "body" } },
            },
          ],
        },
        { name: "cta", title: "Button", type: "ctaLink" },
      ],
    }),
    defineField({
      name: "finalCta",
      title: "Contact / final call to action",
      type: "object",
      group: "sections",
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
    prepare: () => ({ title: "Home Page" }),
  },
});
