import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "content",
      initialValue: "About Ananta Hatha Yoga",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "story",
      title: "Story",
      type: "blockContent",
      group: "content",
      description: "The teacher's story and the intention behind Ananta Hatha Yoga.",
    }),
    defineField({
      name: "training",
      title: "Training & certification",
      type: "blockContent",
      group: "content",
      description: "Training background (e.g. Isha certification).",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
