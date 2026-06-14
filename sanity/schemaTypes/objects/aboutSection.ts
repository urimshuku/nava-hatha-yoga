import { defineField, defineType } from "sanity";

export const aboutSection = defineType({
  name: "aboutSection",
  title: "About section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Section image",
      type: "imageWithAlt",
      description: "Photo for this section.",
    }),
    defineField({
      name: "body",
      title: "Section text",
      type: "blockContent",
      description: "The main content for this section.",
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
    prepare({ title, media }) {
      return { title: title || "Untitled section", media };
    },
  },
});
