import { defineField, defineType } from "sanity";

/** A bullet list with an optional label, used inside guideline blocks. */
export const guidelineList = defineType({
  name: "guidelineList",
  title: "Bullet list",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Optional line above the bullets, e.g. “Empty stomach means:”.",
    }),
    defineField({
      name: "items",
      title: "Bullets",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "label", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "Bullet list",
      subtitle: Array.isArray(items) ? `${items.length} bullets` : undefined,
    }),
  },
});

/** A guideline block: heading, paragraphs, and optional bullet lists. */
export const guidelineBlock = defineType({
  name: "guidelineBlock",
  title: "Guideline block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    }),
    defineField({
      name: "lists",
      title: "Bullet lists",
      type: "array",
      of: [{ type: "guidelineList" }],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});

/** A titled group of guideline blocks (e.g. “Before the Start of Classes”). */
export const guidelineSection = defineType({
  name: "guidelineSection",
  title: "Guideline section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Blocks",
      type: "array",
      of: [{ type: "guidelineBlock" }],
    }),
  ],
  preview: {
    select: { title: "title", blocks: "blocks" },
    prepare: ({ title, blocks }) => ({
      title,
      subtitle: Array.isArray(blocks) ? `${blocks.length} blocks` : undefined,
    }),
  },
});
