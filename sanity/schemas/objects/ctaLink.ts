import { defineField, defineType } from "sanity";

export const ctaLink = defineType({
  name: "ctaLink",
  title: "Button / Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Button Label",
      type: "string",
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description:
        "An internal path (e.g. /programs) or a full URL (e.g. https://...).",
    }),
  ],
});
