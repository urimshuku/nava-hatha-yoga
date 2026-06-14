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
        { name: "supportingText", title: "Supporting text", type: "text", rows: 3 },
        { name: "primaryCta", title: "Primary button", type: "ctaLink" },
        { name: "secondaryCta", title: "Secondary button", type: "ctaLink" },
        { name: "image", title: "Background / hero image", type: "imageWithAlt" },
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
      name: "privateCorporate",
      title: "Private & Corporate Sessions",
      type: "object",
      group: "sections",
      fields: [
        { name: "heading", title: "Heading", type: "string" },
        { name: "body", title: "Body", type: "blockContent" },
      ],
    }),
    defineField({
      name: "aboutIntro",
      title: "About intro",
      type: "object",
      group: "sections",
      fields: [
        { name: "eyebrow", title: "Eyebrow (small label)", type: "string" },
        { name: "heading", title: "Heading", type: "string" },
        { name: "body", title: "Body", type: "blockContent" },
        { name: "image", title: "Image", type: "imageWithAlt" },
      ],
    }),
    defineField({
      name: "finalCta",
      title: "Final call to action",
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
