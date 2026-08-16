import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fieldsets: [
    { name: "hero", title: "Hero", options: { collapsible: false } },
    { name: "highlights", title: "Highlights", options: { collapsible: true, collapsed: false } },
    { name: "intro", title: "What is Classical Hatha Yoga?", options: { collapsible: true, collapsed: false } },
    { name: "featured", title: "Featured programs", options: { collapsible: true, collapsed: false } },
    { name: "events", title: "Upcoming events", options: { collapsible: true, collapsed: false } },
    { name: "private", title: "Private Sessions — shown on Home and Programs", options: { collapsible: true, collapsed: false } },
    { name: "contact", title: "Contact", options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "content",
      fieldset: "hero",
      fields: [
        { name: "headline", title: "Headline", type: "string", validation: (rule) => rule.required() },
        {
          name: "subtitle",
          title: "Subtitle",
          type: "string",
          description: "Optional line under the headline. Leave empty for headline only.",
        },
        { name: "supportingText", title: "Supporting Text", type: "text", rows: 3, validation: (rule) => rule.required() },
        { name: "primaryCta", title: "Primary Button", type: "ctaLink" },
        { name: "secondaryCta", title: "Secondary Button", type: "ctaLink" },
        {
          name: "image",
          title: "Hero Image",
          type: "imageWithAlt",
          hidden: true,
          description:
            "LEGACY / STORED / NOT CURRENTLY DISPLAYED. Not shown on the homepage. Kept so existing images are not lost. Cannot override visible homepage text.",
        },
      ],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "object",
      group: "content",
      fieldset: "highlights",
      fields: [
        {
          name: "items",
          title: "Highlight items",
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
          title: "Closing Quote",
          type: "string",
          description: 'For example: "In balance. Life unfolds."',
        },
      ],
    }),
    defineField({
      name: "intro",
      title: "What is Classical Hatha Yoga?",
      type: "object",
      group: "content",
      fieldset: "intro",
      fields: [
        {
          name: "eyebrow",
          title: "Small Label",
          type: "string",
          description: "Short label above the heading.",
        },
        { name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() },
        { name: "body", title: "Body", type: "blockContent" },
        {
          name: "videoUrl",
          title: "YouTube Video URL",
          type: "url",
          description: "Optional video shown below the intro text.",
        },
        {
          name: "videoTitle",
          title: "Video Title",
          type: "string",
          description: "Accessible title for the intro video.",
        },
      ],
    }),
    defineField({
      name: "featuredProgramsSection",
      title: "Featured Programs — Headings",
      type: "object",
      group: "content",
      fieldset: "featured",
      fields: [
        { name: "eyebrow", title: "Small Label", type: "string" },
        { name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() },
        { name: "description", title: "Description", type: "text", rows: 2 },
        { name: "ctaLabel", title: "Button Label", type: "string" },
      ],
    }),
    defineField({
      name: "featuredPrograms",
      title: "Featured Programs",
      type: "array",
      group: "content",
      fieldset: "featured",
      description: "Choose 3–6 programs to feature on the homepage. Drag to reorder.",
      of: [{ type: "reference", to: [{ type: "program" }] }],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "upcomingEventsSection",
      title: "Upcoming Events — Headings",
      type: "object",
      group: "content",
      fieldset: "events",
      fields: [
        { name: "eyebrow", title: "Small Label", type: "string" },
        { name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() },
        { name: "description", title: "Description", type: "text", rows: 2 },
        { name: "emptyTitle", title: "Empty State Title", type: "string" },
        { name: "emptyDescription", title: "Empty State Text", type: "text", rows: 2 },
        { name: "ctaLabel", title: "See-all Button Label", type: "string" },
      ],
    }),
    defineField({
      name: "privateCorporate",
      title: "Private Sessions — shown on Home and Programs",
      type: "object",
      group: "content",
      fieldset: "private",
      description:
        "Edit this content here. The same content is displayed on both the Home page and the Programs page. Do not look for a separate copy under Programs.",
      fields: [
        { name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() },
        { name: "lead", title: "Lead Text", type: "text", rows: 3, validation: (rule) => rule.required() },
        {
          name: "offerings",
          title: "Session types",
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
      title: "Contact",
      type: "object",
      group: "content",
      fieldset: "contact",
      fields: [
        { name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() },
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
    prepare: () => ({ title: "Home" }),
  },
});
