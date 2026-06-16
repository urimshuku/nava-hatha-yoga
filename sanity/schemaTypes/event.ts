import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "registration", title: "Registration" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      group: "details",
      description: "Turn off to hide this event from the website.",
      initialValue: true,
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      group: "details",
      description:
        "When the event takes place (or starts). Past events move automatically to the archive.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "datetime",
      group: "details",
      description:
        "Optional. For multi-day events, the last day. The card shows a date range (e.g. 27-29 June 2026).",
    }),
    defineField({
      name: "time",
      title: "Time (display label)",
      type: "string",
      group: "details",
      description: "E.g. '7:00 - 8:30 AM'. Optional, for display only.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "details",
      initialValue: "Saranda, Albania",
    }),
    defineField({
      name: "priceLabel",
      title: "Price label",
      type: "string",
      group: "details",
      description: "E.g. 'Free', 'By donation', or a price. Payments are handled in person.",
    }),
    defineField({
      name: "paymentNote",
      title: "Payment note",
      type: "string",
      group: "details",
      description:
        "Optional note shown in parentheses next to the price (e.g. payment instructions).",
    }),
    defineField({
      name: "teacher",
      title: "Teacher",
      type: "string",
      group: "details",
      initialValue: "Erlinda Mustafaraj",
    }),
    defineField({
      name: "ageRequirement",
      title: "Age requirement",
      type: "string",
      group: "details",
      description: "Shown on the event card, e.g. '14+'.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Workshop", value: "Workshop" },
          { title: "Retreat", value: "Retreat" },
          { title: "Free Session", value: "Free Session" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "relatedProgram",
      title: "Related program",
      type: "reference",
      group: "details",
      to: [{ type: "program" }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "details",
    }),
    defineField({
      name: "notes",
      title: "Card notes",
      type: "array",
      of: [{ type: "string" }],
      group: "details",
      description:
        "Short reminders shown on the event card (e.g. payment info, age requirement).",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      group: "media",
    }),
    defineField({
      name: "registrationLink",
      title: "Registration link",
      type: "url",
      group: "registration",
      description: "An external link where people can register (optional).",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "whatsappEnabled",
      title: "Offer WhatsApp registration",
      type: "boolean",
      group: "registration",
      description: "Show a 'Register via WhatsApp' button using the site WhatsApp number.",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Date (soonest first)",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
    {
      title: "Date (newest first)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "date", category: "category", media: "image" },
    prepare: ({ title, date, category, media }) => ({
      title,
      subtitle: [category, date ? new Date(date).toLocaleDateString("en-GB") : null]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
