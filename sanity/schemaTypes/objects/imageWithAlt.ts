import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describe the image for screen readers and search engines (e.g. 'A practitioner in a seated posture').",
      validation: (rule) =>
        rule.required().error("Add alt text describing the image for accessibility and SEO."),
    }),
  ],
});
