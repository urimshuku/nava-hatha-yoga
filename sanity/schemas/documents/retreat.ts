import { defineField, defineType } from "sanity";

export const retreat = defineType({
  name: "retreat",
  title: "Retreat",
  type: "document",
  description:
    "Add an upcoming retreat by duplicating Retreat template (not Retreats page). Change the dates and copy, turn Published on, then click Publish. It appears on /retreats until the end date, then moves to Past Retreats. Keep the template Unpublished so the site stays on Coming Soon until a real retreat is ready.",
  groups: [
    { name: "content", title: "Content", default: true },
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
      name: "published",
      title: "Show on the website",
      type: "boolean",
      group: "content",
      description: "Turn off to hide this retreat from the website.",
      initialValue: true,
    }),
    defineField({
      name: "slug",
      title: "Page URL",
      type: "slug",
      group: "content",
      description: "The address of this retreat’s page. Auto-generated from the title.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      group: "content",
      description: "Shown on retreat cards and at the top of the retreat page.",
    }),
    defineField({
      name: "date",
      title: "Start Date",
      type: "datetime",
      group: "content",
      description:
        "When the retreat starts. After the end date it moves to Past Retreats.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      group: "content",
      description:
        "Last day and time of the retreat. Needed so a multi-day retreat is not archived on day one. Use the closing time of the last day.",
      validation: (rule) =>
        rule.required().custom((endDate, context) => {
          const start = (context.document as { date?: string } | undefined)?.date;
          if (!endDate || !start) return true;
          if (new Date(endDate).getTime() < new Date(start).getTime()) {
            return "End date must be on or after the start date.";
          }
          return true;
        }),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "content",
      description: "Only list a location where this retreat is genuinely offered.",
    }),
    defineField({
      name: "priceLabel",
      title: "Price",
      type: "string",
      group: "content",
      description: "For example a price or 'Contact for details'. Payments are handled in person.",
    }),
    defineField({
      name: "body",
      title: "Full Description",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "content",
      of: [{ type: "imageWithAlt" }],
    }),
    defineField({
      name: "cancellationPolicy",
      title: "Cancellation / Refund Policy",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "registrationLink",
      title: "Registration Link",
      type: "url",
      group: "content",
      description: "Optional. If empty, the Register button goes to Contact.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      endDate: "endDate",
      media: "image",
      published: "published",
    },
    prepare: ({ title, date, endDate, media, published }) => {
      const end = endDate ?? date;
      const isPast = end ? new Date(end).getTime() < Date.now() : false;
      const status = published ? (isPast ? "Past retreat" : "Upcoming retreat") : "Hidden";
      const startLabel = date ? new Date(date).toLocaleDateString("en-GB") : null;
      const endLabel = endDate ? new Date(endDate).toLocaleDateString("en-GB") : null;
      const range =
        startLabel && endLabel && endLabel !== startLabel
          ? `${startLabel} – ${endLabel}`
          : startLabel;

      return {
        title,
        subtitle: [status, range].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
