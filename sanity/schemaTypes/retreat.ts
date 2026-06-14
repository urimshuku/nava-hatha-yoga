import { defineField, defineType } from "sanity";

export const retreat = defineType({
  name: "retreat",
  title: "Retreat",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "registration", title: "Registration" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      group: "content",
      description:
        "Turn off while a retreat is still being planned. Retreats are 'coming soon' until published.",
      initialValue: false,
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "priceLabel",
      title: "Price label",
      type: "string",
      group: "content",
      description: "E.g. a price or 'Contact for details'. Payments are handled in person.",
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Full description",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "image",
      title: "Cover image",
      type: "imageWithAlt",
      group: "media",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [{ type: "imageWithAlt" }],
    }),
    defineField({
      name: "registrationLink",
      title: "Registration link",
      type: "url",
      group: "registration",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "cancellationPolicy",
      title: "Cancellation / refund policy",
      type: "blockContent",
      group: "registration",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", date: "date", media: "image", published: "published" },
    prepare: ({ title, date, media, published }) => ({
      title,
      subtitle: [
        published ? "Published" : "Coming soon",
        date ? new Date(date).toLocaleDateString("en-GB") : null,
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
