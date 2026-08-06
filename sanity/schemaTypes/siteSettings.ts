import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "contact", title: "Contact" },
    { name: "programs", title: "Program pages" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "brandName",
      title: "Brand name",
      type: "string",
      group: "brand",
      validation: (rule) => rule.required(),
      initialValue: "Nava Hatha Yoga",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "brand",
      description: "A short line shown alongside the brand name.",
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      group: "brand",
      description: "Used as a default description across the site and for SEO.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      type: "string",
      group: "contact",
      description:
        "Digits only, in international format without +, spaces, or symbols (e.g. 355690000000).",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "contact",
      initialValue: "Saranda, Albania",
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "beforeProgramNotes",
      title: "Default “Before the Program” notes",
      type: "array",
      group: "programs",
      of: [{ type: "string" }],
      description:
        "Shown in the “Before the Program” section on every program page, unless a program provides its own notes.",
    }),
    defineField({
      name: "bonusTitle",
      title: "Bonus box title",
      type: "string",
      group: "programs",
      initialValue: "Bonus",
    }),
    defineField({
      name: "bonusItems",
      title: "Bonus items",
      type: "array",
      group: "programs",
      of: [{ type: "string" }],
      description: "Shown in the Bonus box on every program page.",
    }),
    defineField({
      name: "discountNote",
      title: "Discount note",
      type: "string",
      group: "programs",
    }),
    defineField({
      name: "medicalNoticeTitle",
      title: "Medical notice title",
      type: "string",
      group: "programs",
      initialValue: "Medical Notice!",
    }),
    defineField({
      name: "medicalNotice",
      title: "Medical notice",
      type: "text",
      rows: 3,
      group: "programs",
      description: "Shown in the medical notice box on every program page.",
    }),
    defineField({
      name: "eventExperienceNote",
      title: "Event experience note",
      type: "string",
      group: "programs",
      description:
        "Shown on event cards when intensity is set (e.g. “No prior yoga experience required!”).",
      initialValue: "No prior yoga experience required!",
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
