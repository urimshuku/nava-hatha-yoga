import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Page URL",
      type: "slug",
      description:
        "Address of this session’s page, for example /events/surya-kriya-tirane-2026-07-25. Generate after setting the title, date, and location. Do not use “archive”.",
      options: {
        source: (doc) =>
          [
            typeof doc.title === "string" ? doc.title : "",
            typeof doc.location === "string" ? doc.location : "",
            typeof doc.date === "string" ? doc.date.slice(0, 10) : "",
          ]
            .filter(Boolean)
            .join(" "),
        maxLength: 96,
      },
      validation: (rule) =>
        rule.custom((slug) => {
          if (slug?.current === "archive") {
            return "“archive” is reserved for the past events page.";
          }
          return true;
        }),
    }),
    defineField({
      name: "published",
      title: "Show on the website",
      type: "boolean",
      description: "Turn off to hide this event from the website.",
      initialValue: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Short summary shown on the event card.",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      description:
        "When the event takes place (or starts). Past events move automatically to the archive.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      description:
        "Optional. For multi-day events, the last day. The card shows a date range (for example 27–29 June 2026).",
    }),
    defineField({
      name: "sessions",
      title: "Session Schedule",
      type: "array",
      description:
        "Add one row per session. Each row becomes its own line on the event card (date + time).",
      of: [
        {
          type: "object",
          name: "session",
          fields: [
            defineField({
              name: "day",
              title: "Date",
              type: "string",
              description: "For example: 14 August",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "hours",
              title: "Time Range",
              type: "string",
              description: "For example: 16:30 – 18:30",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { day: "day", hours: "hours" },
            prepare: ({ day, hours }) => ({
              title: [day, hours].filter(Boolean).join(": ") || "Session",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "sessionNote",
      title: "Schedule Note",
      type: "string",
      description: 'Optional line under the schedule, for example "All 3 sessions are mandatory".',
    }),
    defineField({
      name: "time",
      title: "Time (legacy free text)",
      type: "text",
      rows: 6,
      description:
        "Displayed on the website only when Session Schedule has never been used. Prefer adding sessions as separate rows. Hidden whenever Session Schedule is present so leftover text cannot come back after rows are deleted.",
      hidden: ({ parent }) => Array.isArray(parent?.sessions),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Only list a location where this event is genuinely offered.",
      initialValue: "Saranda, Albania",
    }),
    defineField({
      name: "ageRequirement",
      title: "Age Requirement",
      type: "string",
      description: "Shown on the event card, for example '14+'.",
    }),
    defineField({
      name: "relatedProgram",
      title: "Related Program",
      type: "reference",
      to: [{ type: "program" }],
      description: "Used for the program symbol and intensity on the event card.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
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
      name: "priceLabel",
      title: "Price",
      type: "string",
      description: "For example 'Free', 'By donation', or a price. Payments are handled in person.",
    }),
    defineField({
      name: "paymentNote",
      title: "Payment Note",
      type: "string",
      description:
        "Optional note shown in parentheses next to the price (for example payment instructions).",
    }),
    defineField({
      name: "notes",
      title: "Card Notes",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Short reminders shown on the event card (for example payment info, age requirement).",
    }),
    defineField({
      name: "image",
      title: "Image for Search Results",
      type: "imageWithAlt",
      description:
        "Not shown on the event card. Used for search engines and social sharing. The card uses the related program’s symbol.",
    }),
    defineField({
      name: "teacher",
      title: "Teacher",
      type: "string",
      hidden: true,
      initialValue: "Erlinda Mustafaraj",
      description:
        "LEGACY / STORED / NOT CURRENTLY DISPLAYED. Not shown on event cards. Kept so existing values are not lost. Cannot override visible website content.",
    }),
    defineField({
      name: "registrationLink",
      title: "External Registration Link",
      type: "url",
      hidden: true,
      description:
        "LEGACY / STORED / NOT CURRENTLY DISPLAYED. Registration always goes to the Register page. Kept so existing values are not lost. Cannot override the Register button.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "whatsappEnabled",
      title: "Offer WhatsApp Registration",
      type: "boolean",
      description: "Show a “Register via WhatsApp” button using the site WhatsApp number.",
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
