import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Page title",
      type: "string",
      group: "content",
      initialValue: "Get in touch",
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
      name: "formHeading",
      title: "Form heading",
      type: "string",
      group: "content",
      initialValue: "Send a message",
    }),
    defineField({
      name: "quickMessageBody",
      title: "Quick message text",
      type: "text",
      rows: 3,
      group: "content",
      description: "Shown above the WhatsApp / Instagram icons in the sidebar.",
    }),
    defineField({
      name: "whatsappPrefill",
      title: "WhatsApp pre-filled message",
      type: "string",
      group: "content",
      description: "The message that opens pre-typed when someone taps the WhatsApp link.",
    }),
    defineField({
      name: "teachingLocations",
      title: "Teaching locations",
      type: "object",
      group: "content",
      fields: [
        { name: "mainHeading", title: "Main locations heading", type: "string" },
        { name: "mainLocations", title: "Main locations", type: "string" },
        { name: "otherHeading", title: "Other locations heading", type: "string" },
        { name: "otherLocations", title: "Other locations", type: "string" },
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
    prepare: () => ({ title: "Contact Page" }),
  },
});
