import { defineField, defineType } from "sanity";

/** A numbered item in the disclaimer document. */
export const disclaimerItem = defineType({
  name: "disclaimerItem",
  title: "Disclaimer item",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lead",
      title: "Lead sentence",
      type: "text",
      rows: 2,
      description: "Optional sentence shown before the bullets.",
    }),
    defineField({
      name: "points",
      title: "Bullets",
      type: "array",
      of: [{ type: "text", rows: 2 }],
    }),
    defineField({
      name: "contactName",
      title: "Contact name",
      type: "string",
      description: "Only for the data controller item.",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      description: "Only for the data controller item.",
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});

/** A section of the disclaimer document (e.g. medical, GDPR). */
export const disclaimerSection = defineType({
  name: "disclaimerSection",
  title: "Disclaimer section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "disclaimerItem" }],
    }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare: ({ title, items }) => ({
      title,
      subtitle: Array.isArray(items) ? `${items.length} items` : undefined,
    }),
  },
});
