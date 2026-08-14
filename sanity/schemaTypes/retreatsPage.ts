import { defineField, defineType } from "sanity";

export const retreatsPage = defineType({
  name: "retreatsPage",
  title: "Retreats Page",
  type: "document",
  description:
    "Intro copy for /retreats (hero, Coming Soon, partner programs). Add actual retreats under Retreats, not here.",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero eyebrow",
      type: "string",
      group: "content",
      initialValue: "Retreats & Partner Programs",
    }),
    defineField({
      name: "heroTitle",
      title: "Page title",
      type: "string",
      group: "content",
      initialValue: "Immersive retreats & partner programs",
    }),
    defineField({
      name: "heroDescription",
      title: "Page introduction",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short text shown below the page title.",
    }),
    defineField({
      name: "comingSoonHeading",
      title: "“Coming soon” heading",
      type: "string",
      group: "content",
      description: "Shown when there are no upcoming retreats.",
    }),
    defineField({
      name: "comingSoonBody",
      title: "“Coming soon” text",
      type: "text",
      rows: 4,
      group: "content",
      description: "Shown when there are no upcoming retreats.",
    }),
    defineField({
      name: "expectationsHeading",
      title: "“What to expect” heading",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "expectations",
      title: "“What to expect” cards",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        },
      ],
    }),
    defineField({
      name: "listingCta",
      title: "Retreats list CTA",
      type: "object",
      group: "content",
      description: "Shown below the retreat cards when upcoming retreats are listed.",
      fields: [
        { name: "heading", title: "Heading", type: "string" },
        { name: "body", title: "Body", type: "text", rows: 2 },
        { name: "cta", title: "Button", type: "ctaLink" },
      ],
    }),
    defineField({
      name: "partnerPrograms",
      title: "Partner Programs",
      type: "object",
      group: "content",
      fields: [
        { name: "heading", title: "Heading", type: "string" },
        {
          name: "intro",
          title: "Introduction paragraphs",
          type: "array",
          of: [{ type: "text", rows: 3 }],
        },
        { name: "collaborateHeading", title: "Collaborate heading", type: "string" },
        {
          name: "collaborateItems",
          title: "Collaborate list",
          type: "array",
          of: [{ type: "string" }],
        },
        {
          name: "closing",
          title: "Closing paragraphs",
          type: "array",
          of: [{ type: "text", rows: 2 }],
        },
        {
          name: "whatsappPrefill",
          title: "WhatsApp pre-filled message",
          type: "string",
        },
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
    prepare: () => ({ title: "Retreats Page" }),
  },
});
