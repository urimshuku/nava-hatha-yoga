import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact",
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
      initialValue: "Contact",
    }),
    defineField({
      name: "heroTitle",
      title: "Page Title",
      type: "string",
      group: "content",
      initialValue: "Get in touch",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Page Introduction",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short text shown below the page title.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "formHeading",
      title: "Form Heading",
      type: "string",
      group: "content",
      initialValue: "Send a message",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quickMessageBody",
      title: "Quick Message Text",
      type: "text",
      rows: 3,
      group: "content",
      description: "Shown above the WhatsApp / Instagram icons in the sidebar.",
    }),
    defineField({
      name: "whatsappPrefill",
      title: "WhatsApp Pre-filled Message",
      type: "string",
      group: "content",
      description: "The message that opens pre-typed when someone taps the WhatsApp link.",
    }),
    defineField({
      name: "teachingLocations",
      title: "Teaching Locations",
      type: "object",
      group: "content",
      description: "Only list locations where teaching is genuinely offered.",
      fields: [
        { name: "mainHeading", title: "Main Locations Heading", type: "string" },
        { name: "mainLocations", title: "Main Locations", type: "string" },
        { name: "otherHeading", title: "Other Locations Heading", type: "string" },
        { name: "otherLocations", title: "Other Locations", type: "string" },
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
    prepare: () => ({ title: "Contact" }),
  },
});
