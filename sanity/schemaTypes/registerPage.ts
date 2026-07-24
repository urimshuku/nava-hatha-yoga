import { defineField, defineType } from "sanity";

export const registerPage = defineType({
  name: "registerPage",
  title: "Register Page",
  type: "document",
  groups: [
    { name: "health", title: "Health step", default: true },
    { name: "disclaimer", title: "Medical disclaimer" },
    { name: "agreement", title: "Agreement step" },
    { name: "guidelines", title: "Guidelines" },
  ],
  fields: [
    // ------------------------------------------------------------------
    // Step 2 — Health-Related Information
    // ------------------------------------------------------------------
    defineField({
      name: "healthIntro",
      title: "Health step introduction",
      type: "array",
      group: "health",
      of: [{ type: "text", rows: 3 }],
      description: "Paragraphs shown at the top of the health step.",
    }),
    defineField({
      name: "healthConditions",
      title: "Health conditions",
      type: "array",
      group: "health",
      of: [{ type: "string" }],
      description:
        "The checkbox options for health conditions. “Other” and “NOT APPLICABLE” are always added automatically.",
    }),
    defineField({
      name: "healthDetailsLabel",
      title: "Health details question",
      type: "text",
      rows: 3,
      group: "health",
    }),
    defineField({
      name: "majorSurgeryQuestion",
      title: "Major surgery question",
      type: "string",
      group: "health",
    }),
    defineField({
      name: "majorSurgeryHint",
      title: "Major surgery hint",
      type: "text",
      rows: 3,
      group: "health",
    }),
    defineField({
      name: "pregnancyLabel",
      title: "Pregnancy question",
      type: "string",
      group: "health",
    }),
    // ------------------------------------------------------------------
    // Medical disclaimer (pop-up + consent)
    // ------------------------------------------------------------------
    defineField({
      name: "disclaimerTitle",
      title: "Disclaimer title",
      type: "string",
      group: "disclaimer",
      description: "Title of the disclaimer pop-up.",
    }),
    defineField({
      name: "disclaimerDocument",
      title: "Disclaimer document",
      type: "array",
      group: "disclaimer",
      of: [{ type: "disclaimerSection" }],
      description: "The full disclaimer shown in the pop-up.",
    }),
    defineField({
      name: "disclaimerBullets",
      title: "Confirmation bullets",
      type: "array",
      group: "disclaimer",
      of: [{ type: "text", rows: 2 }],
      description: "Shown under “By registering for the program, I confirm that:”.",
    }),
    defineField({
      name: "disclaimerConsentLabel",
      title: "Consent checkbox label",
      type: "text",
      rows: 2,
      group: "disclaimer",
    }),
    // ------------------------------------------------------------------
    // Step 4 — Agreement
    // ------------------------------------------------------------------
    defineField({
      name: "refundPolicyBullets",
      title: "Refund policy bullets",
      type: "array",
      group: "agreement",
      of: [{ type: "text", rows: 2 }],
    }),
    defineField({
      name: "refundPolicyConsentLabel",
      title: "Refund policy consent label",
      type: "string",
      group: "agreement",
    }),
    defineField({
      name: "agreementTitle",
      title: "Participant agreement title",
      type: "string",
      group: "agreement",
    }),
    defineField({
      name: "agreementBullets",
      title: "Participant agreement bullets",
      type: "array",
      group: "agreement",
      of: [{ type: "text", rows: 2 }],
    }),
    defineField({
      name: "agreementConsentLabel",
      title: "Agreement consent label",
      type: "string",
      group: "agreement",
    }),
    // ------------------------------------------------------------------
    // Final step + full guidelines document (also used for the PDF)
    // ------------------------------------------------------------------
    defineField({
      name: "beforeSessionBlocks",
      title: "“Before the Start of the Session” blocks",
      type: "array",
      group: "guidelines",
      of: [{ type: "guidelineBlock" }],
      description: "The summary blocks shown on the final step of the form.",
    }),
    defineField({
      name: "guidelinesTitle",
      title: "Full guidelines title",
      type: "string",
      group: "guidelines",
      description: "Title of the full guidelines pop-up and PDF.",
    }),
    defineField({
      name: "guidelinesDocument",
      title: "Full guidelines document",
      type: "array",
      group: "guidelines",
      of: [{ type: "guidelineSection" }],
      description:
        "The full guidelines shown in the pop-up and used to generate the downloadable PDF.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Register Page" }),
  },
});
