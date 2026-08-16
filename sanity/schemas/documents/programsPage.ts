import { defineField, defineType } from "sanity";

export const programsPage = defineType({
  name: "programsPage",
  title: "Programs page",
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
      description: "Short label above the page title.",
      initialValue: "Programs & Offerings",
    }),
    defineField({
      name: "heroTitle",
      title: "Page Title",
      type: "string",
      group: "content",
      initialValue: "Classical Hatha Yoga programs",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Page Introduction",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainProgramsHeading",
      title: "Core Programs Heading",
      type: "string",
      group: "content",
      description: "Heading above the main program cards.",
      initialValue: "Main programs",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "specialProgramsHeading",
      title: "Special Programs Heading",
      type: "string",
      group: "content",
      description: "Heading above the second program list.",
      initialValue: "Special programs",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "specialProgramsLead",
      title: "Special Programs Introduction",
      type: "text",
      rows: 2,
      group: "content",
      description: "Short line under the special programs heading.",
      initialValue: "Practices that support specific aspects of health and wellbeing.",
    }),
    defineField({
      name: "freeOfferings",
      title: "Free Offerings",
      type: "object",
      group: "content",
      fields: [
        { name: "eyebrow", title: "Small Label", type: "string" },
        { name: "lead", title: "Lead Text", type: "text", rows: 2 },
        {
          name: "items",
          title: "Offerings",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "title", title: "Title", type: "string" },
                { name: "description", title: "Description", type: "text", rows: 3 },
              ],
              preview: { select: { title: "title", subtitle: "description" } },
            },
          ],
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
    prepare: () => ({ title: "Programs page" }),
  },
});
