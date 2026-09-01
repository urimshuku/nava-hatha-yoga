import type { DocumentSchema, FieldDef, SchemaSection } from "./schema";

/**
 * Every editable page on the website, described as data.
 *
 * The field names match the fields the website already reads, so a saved
 * document can be handed straight to the page that renders it. Hints are written
 * for the person editing, not for developers: each one says where on the website
 * the value shows up.
 */

const ctaGroup = (
  name: string,
  label: string,
  hint?: string,
): FieldDef => ({
  kind: "group",
  name,
  label,
  hint,
  fields: [
    { kind: "text", name: "label", label: "Button text" },
    {
      kind: "text",
      name: "href",
      label: "Where it goes",
      hint: "A path on this site such as /register, or a full web address.",
    },
  ],
});

const heroFields = (pageName: string): FieldDef[] => [
  {
    kind: "text",
    name: "heroEyebrow",
    label: "Small line above the heading",
    hint: "The short line in capitals at the very top.",
  },
  { kind: "text", name: "heroTitle", label: "Heading" },
  {
    kind: "textarea",
    name: "heroDescription",
    label: "Introduction",
    hint: `The paragraph under the heading at the top of the ${pageName} page.`,
    rows: 3,
  },
];

const archiveFields = (what: string): FieldDef[] => [
  { kind: "text", name: "archiveEyebrow", label: "Small line above the heading" },
  { kind: "text", name: "archiveTitle", label: "Heading" },
  {
    kind: "textarea",
    name: "archiveDescription",
    label: "Introduction",
    rows: 2,
  },
  {
    kind: "text",
    name: "archiveEmptyTitle",
    label: `Heading when there are no past ${what}`,
  },
  {
    kind: "textarea",
    name: "archiveEmptyDescription",
    label: `Text when there are no past ${what}`,
    rows: 2,
  },
];

export const siteSettingsSchema: DocumentSchema = {
  title: "Site settings",
  description:
    "Details that appear across the whole website: contact information, and the notes reused on program and event pages.",
  sections: [
    {
      title: "Basic details",
      fields: [
        { kind: "text", name: "brandName", label: "Name of the school" },
        {
          kind: "text",
          name: "tagline",
          label: "Tagline",
          hint: "The short line used beside the name.",
        },
        {
          kind: "textarea",
          name: "description",
          label: "Description of the school",
          hint: "Used in the footer and as the default text for search engines.",
          rows: 3,
        },
      ],
    },
    {
      title: "Contact details",
      description: "Shown in the footer, on the contact page and in the forms.",
      fields: [
        { kind: "text", name: "email", label: "Email address" },
        { kind: "text", name: "phone", label: "Phone number" },
        {
          kind: "text",
          name: "whatsapp",
          label: "WhatsApp number",
          hint: "Digits only, including the country code, for example 38344123456.",
        },
        { kind: "text", name: "location", label: "City or area" },
        {
          kind: "rows",
          name: "social",
          label: "Social media links",
          itemLabel: "link",
          fields: [
            {
              kind: "text",
              name: "label",
              label: "Name",
              hint: "For example Instagram.",
            },
            { kind: "text", name: "url", label: "Web address" },
          ],
        },
      ],
    },
    {
      title: "Notes reused on program pages",
      description:
        "These appear on every program page unless a program sets its own version.",
      fields: [
        {
          kind: "list",
          name: "beforeProgramNotes",
          label: "Before the program",
          hint: "One note per line, for example what to bring or when to eat.",
        },
        { kind: "text", name: "bonusTitle", label: "Heading for the extras" },
        {
          kind: "list",
          name: "bonusItems",
          label: "Extras included",
          hint: "One per line.",
        },
        {
          kind: "textarea",
          name: "discountNote",
          label: "Note about discounts",
          rows: 2,
        },
      ],
    },
    {
      title: "Health and safety notes",
      fields: [
        {
          kind: "text",
          name: "medicalNoticeTitle",
          label: "Heading of the health notice",
        },
        {
          kind: "textarea",
          name: "medicalNotice",
          label: "Health notice",
          hint: "Shown on program and event pages. Please keep the wording careful.",
          rows: 4,
        },
        {
          kind: "textarea",
          name: "eventExperienceNote",
          label: "Note about experience needed",
          hint: "Shown on event pages.",
          rows: 2,
        },
      ],
    },
  ],
};

export const homePageSchema: DocumentSchema = {
  title: "Home Page",
  previewPath: "/",
  sections: [
    {
      title: "The top of the page",
      fields: [
        {
          kind: "group",
          name: "hero",
          label: "Opening section",
          fields: [
            { kind: "text", name: "headline", label: "Main heading" },
            { kind: "text", name: "subtitle", label: "Line under the heading" },
            {
              kind: "textarea",
              name: "supportingText",
              label: "Supporting paragraph",
              rows: 3,
            },
            ctaGroup("primaryCta", "Main button"),
            ctaGroup("secondaryCta", "Second button"),
          ],
        },
      ],
    },
    {
      title: "The three highlights",
      description: "The short points shown directly under the opening section.",
      fields: [
        {
          kind: "group",
          name: "highlights",
          label: "Highlights",
          fields: [
            {
              kind: "rows",
              name: "items",
              label: "Points",
              itemLabel: "point",
              fields: [
                { kind: "text", name: "text", label: "Text" },
                {
                  kind: "list",
                  name: "lines",
                  label: "Extra lines",
                  hint: "Optional. Use when the point needs more than one line.",
                },
              ],
            },
            {
              kind: "textarea",
              name: "closingQuote",
              label: "Closing quote",
              rows: 2,
            },
          ],
        },
      ],
    },
    {
      title: "Introduction",
      fields: [
        {
          kind: "group",
          name: "intro",
          label: "Introduction section",
          fields: [
            { kind: "text", name: "eyebrow", label: "Small line above the heading" },
            { kind: "text", name: "heading", label: "Heading" },
            { kind: "richtext", name: "body", label: "Text" },
            {
              kind: "text",
              name: "videoUrl",
              label: "Video link",
              hint: "Optional YouTube address.",
            },
            { kind: "text", name: "videoTitle", label: "Video label" },
          ],
        },
      ],
    },
    {
      title: "Programs section",
      fields: [
        {
          kind: "group",
          name: "featuredProgramsSection",
          label: "Headings",
          fields: [
            { kind: "text", name: "eyebrow", label: "Small line above the heading" },
            { kind: "text", name: "title", label: "Heading" },
            {
              kind: "textarea",
              name: "description",
              label: "Introduction",
              rows: 2,
            },
            { kind: "text", name: "ctaLabel", label: "Text of the link to all programs" },
          ],
        },
        {
          kind: "list",
          name: "featuredProgramSlugs",
          label: "Which programs to show",
          hint: "One web address part per line, for example yogasanas. Leave empty to show the core programs automatically.",
          placeholder: "yogasanas",
        },
      ],
    },
    {
      title: "Events section",
      fields: [
        {
          kind: "group",
          name: "upcomingEventsSection",
          label: "Headings",
          fields: [
            { kind: "text", name: "eyebrow", label: "Small line above the heading" },
            { kind: "text", name: "title", label: "Heading" },
            {
              kind: "textarea",
              name: "description",
              label: "Introduction",
              rows: 2,
            },
            {
              kind: "text",
              name: "emptyTitle",
              label: "Heading when nothing is planned",
            },
            {
              kind: "textarea",
              name: "emptyDescription",
              label: "Text when nothing is planned",
              rows: 2,
            },
            { kind: "text", name: "ctaLabel", label: "Text of the link to all events" },
          ],
        },
      ],
    },
    {
      title: "Private and corporate sessions",
      fields: [
        {
          kind: "group",
          name: "privateCorporate",
          label: "Section",
          fields: [
            { kind: "text", name: "heading", label: "Heading" },
            { kind: "textarea", name: "lead", label: "Introduction", rows: 3 },
            {
              kind: "rows",
              name: "offerings",
              label: "What is offered",
              itemLabel: "offering",
              fields: [
                { kind: "text", name: "title", label: "Title" },
                { kind: "textarea", name: "body", label: "Text", rows: 2 },
              ],
            },
            ctaGroup("cta", "Button"),
          ],
        },
      ],
    },
    {
      title: "Closing section",
      fields: [
        {
          kind: "group",
          name: "finalCta",
          label: "Invitation at the bottom of the page",
          fields: [
            { kind: "text", name: "heading", label: "Heading" },
            { kind: "textarea", name: "body", label: "Text", rows: 2 },
            ctaGroup("cta", "Button"),
          ],
        },
      ],
    },
  ],
};

export const aboutPageSchema: DocumentSchema = {
  title: "About Page",
  previewPath: "/about",
  sections: [
    {
      title: "The top of the page",
      fields: [
        { kind: "text", name: "heroEyebrow", label: "Small line above the heading" },
        { kind: "text", name: "title", label: "Heading" },
        {
          kind: "textarea",
          name: "heroDescription",
          label: "Introduction",
          rows: 3,
        },
        { kind: "richtext", name: "intro", label: "Opening text" },
      ],
    },
    {
      title: "The teacher",
      fields: [
        {
          kind: "text",
          name: "teacherSectionTitle",
          label: "Heading of the teacher section",
        },
        {
          kind: "group",
          name: "teacherStory",
          label: "Story",
          fields: [
            {
              kind: "text",
              name: "nameLine",
              label: "Name and role",
              hint: "For example: Linda, founder and teacher.",
            },
            { kind: "image", name: "photo", label: "Photo of the teacher" },
            {
              kind: "list",
              name: "teaser",
              label: "Short introduction",
              hint: "One paragraph per line. Shown before the full story.",
            },
            { kind: "text", name: "storyTitle", label: "Heading of the full story" },
            {
              kind: "list",
              name: "story",
              label: "Full story",
              hint: "One paragraph per line.",
            },
          ],
        },
      ],
    },
    {
      title: "Highlight cards",
      description: "The small cards with numbers and short facts.",
      fields: [
        {
          kind: "rows",
          name: "highlightCards",
          label: "Cards",
          itemLabel: "card",
          fields: [
            { kind: "text", name: "eyebrow", label: "Small line above the title" },
            { kind: "text", name: "title", label: "Title" },
            {
              kind: "text",
              name: "stat",
              label: "Number or fact",
              hint: "For example: 500+ hours.",
            },
            { kind: "textarea", name: "body", label: "Text", rows: 2 },
            {
              kind: "checkbox",
              name: "showCertificationLogo",
              label: "Show the certification logo on this card",
            },
          ],
        },
      ],
    },
    {
      title: "Sections with photos",
      fields: [
        {
          kind: "rows",
          name: "sections",
          label: "Sections",
          itemLabel: "section",
          fields: [
            { kind: "text", name: "title", label: "Heading" },
            { kind: "richtext", name: "body", label: "Text" },
            { kind: "image", name: "image", label: "Photo" },
            ctaGroup("cta", "Button", "Optional."),
          ],
        },
      ],
    },
    {
      title: "Closing section",
      fields: [
        {
          kind: "group",
          name: "finalCta",
          label: "Invitation at the bottom of the page",
          fields: [
            { kind: "text", name: "heading", label: "Heading" },
            { kind: "textarea", name: "body", label: "Text", rows: 2 },
            ctaGroup("cta", "Button"),
          ],
        },
      ],
    },
  ],
};

export const programsPageSchema: DocumentSchema = {
  title: "Programs & Offerings Page",
  description:
    "The wording of the Programs page. The programs themselves are edited under Programs.",
  previewPath: "/programs",
  sections: [
    { title: "The top of the page", fields: heroFields("Programs") },
    {
      title: "Headings of the two lists",
      fields: [
        {
          kind: "text",
          name: "mainProgramsHeading",
          label: "Heading of the core programs",
        },
        {
          kind: "text",
          name: "specialProgramsHeading",
          label: "Heading of the special programs",
        },
        {
          kind: "textarea",
          name: "specialProgramsLead",
          label: "Introduction to the special programs",
          rows: 2,
        },
      ],
    },
    {
      title: "Free offerings",
      fields: [
        {
          kind: "group",
          name: "freeOfferings",
          label: "Section",
          fields: [
            { kind: "text", name: "eyebrow", label: "Small line above the heading" },
            { kind: "textarea", name: "lead", label: "Introduction", rows: 2 },
            {
              kind: "rows",
              name: "items",
              label: "What is offered free",
              itemLabel: "offering",
              fields: [
                { kind: "text", name: "title", label: "Title" },
                { kind: "textarea", name: "description", label: "Text", rows: 2 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const eventsPageSchema: DocumentSchema = {
  title: "Events & Partner Program Page",
  description:
    "The wording of the Events page and its archive. The events themselves are edited under Events.",
  previewPath: "/events",
  sections: [
    { title: "The top of the page", fields: heroFields("Events") },
    {
      title: "When nothing is planned",
      fields: [
        { kind: "text", name: "emptyTitle", label: "Heading" },
        { kind: "textarea", name: "emptyDescription", label: "Text", rows: 2 },
      ],
    },
    {
      title: "Contact section",
      fields: [
        { kind: "text", name: "contactHeading", label: "Heading" },
        { kind: "textarea", name: "contactDescription", label: "Text", rows: 2 },
      ],
    },
    { title: "Past events page", fields: archiveFields("events") },
  ],
};

export const retreatsPageSchema: DocumentSchema = {
  title: "Retreats Page",
  previewPath: "/retreats",
  sections: [
    { title: "The top of the page", fields: heroFields("Retreats") },
    {
      title: "When no retreat is planned",
      fields: [
        {
          kind: "text",
          name: "comingSoonEyebrow",
          label: "Small line above the heading",
        },
        { kind: "text", name: "comingSoonHeading", label: "Heading" },
        { kind: "textarea", name: "comingSoonBody", label: "Text", rows: 3 },
      ],
    },
    {
      title: "What to expect",
      fields: [
        {
          kind: "text",
          name: "expectationsEyebrow",
          label: "Small line above the heading",
        },
        { kind: "text", name: "expectationsHeading", label: "Heading" },
        {
          kind: "rows",
          name: "expectations",
          label: "Points",
          itemLabel: "point",
          fields: [
            { kind: "text", name: "title", label: "Title" },
            { kind: "textarea", name: "body", label: "Text", rows: 2 },
          ],
        },
      ],
    },
    {
      title: "Invitation under the list",
      fields: [
        {
          kind: "group",
          name: "listingCta",
          label: "Invitation",
          fields: [
            { kind: "text", name: "heading", label: "Heading" },
            { kind: "textarea", name: "body", label: "Text", rows: 2 },
            ctaGroup("cta", "Button"),
          ],
        },
      ],
    },
    {
      title: "Working with partners",
      fields: [
        {
          kind: "group",
          name: "partnerPrograms",
          label: "Section",
          fields: [
            { kind: "text", name: "heading", label: "Heading" },
            {
              kind: "list",
              name: "intro",
              label: "Introduction",
              hint: "One paragraph per line.",
            },
            {
              kind: "text",
              name: "collaborateHeading",
              label: "Heading of the list",
            },
            {
              kind: "list",
              name: "collaborateItems",
              label: "Ways of working together",
              hint: "One per line.",
            },
            {
              kind: "list",
              name: "closing",
              label: "Closing paragraphs",
              hint: "One paragraph per line.",
            },
            {
              kind: "textarea",
              name: "whatsappPrefill",
              label: "Ready-made WhatsApp message",
              hint: "The text already filled in when someone writes on WhatsApp from this section.",
              rows: 2,
            },
          ],
        },
      ],
    },
    { title: "Past retreats page", fields: archiveFields("retreats") },
  ],
};

export const contactPageSchema: DocumentSchema = {
  title: "Contact Page",
  previewPath: "/contact",
  sections: [
    {
      title: "The top of the page",
      fields: [
        { kind: "text", name: "heroEyebrow", label: "Small line above the heading" },
        { kind: "text", name: "heroTitle", label: "Heading" },
        {
          kind: "textarea",
          name: "heroDescription",
          label: "Introduction",
          rows: 3,
        },
      ],
    },
    {
      title: "The form",
      fields: [
        { kind: "text", name: "formHeading", label: "Heading above the form" },
        {
          kind: "textarea",
          name: "quickMessageBody",
          label: "Text of the WhatsApp box",
          rows: 2,
        },
        {
          kind: "textarea",
          name: "whatsappPrefill",
          label: "Ready-made WhatsApp message",
          hint: "The text already filled in when someone writes on WhatsApp from this page.",
          rows: 2,
        },
      ],
    },
    {
      title: "Where classes are held",
      fields: [
        {
          kind: "group",
          name: "teachingLocations",
          label: "Locations",
          fields: [
            { kind: "text", name: "mainHeading", label: "Heading of the main places" },
            {
              kind: "textarea",
              name: "mainLocations",
              label: "Main places",
              rows: 2,
            },
            {
              kind: "text",
              name: "otherHeading",
              label: "Heading of the other places",
            },
            {
              kind: "textarea",
              name: "otherLocations",
              label: "Other places",
              rows: 2,
            },
          ],
        },
      ],
    },
  ],
};

function registerFormSections(
  pageName: string,
  fullForm: boolean,
): SchemaSection[] {
  const hero: SchemaSection = {
    title: "The top of the page",
    fields: heroFields(pageName),
  };
  if (!fullForm) return [hero];

  return [
    hero,
    {
      title: "Health questions",
      fields: [
        {
          kind: "list",
          name: "healthIntro",
          label: "Introduction",
          hint: "One paragraph per line.",
        },
        {
          kind: "list",
          name: "healthConditions",
          label: "Conditions people can tick",
          hint: "One condition per line.",
        },
        {
          kind: "text",
          name: "healthDetailsLabel",
          label: "Label of the details box",
        },
        {
          kind: "text",
          name: "majorSurgeryQuestion",
          label: "Question about surgery",
        },
        {
          kind: "textarea",
          name: "majorSurgeryHint",
          label: "Note under the surgery question",
          rows: 2,
        },
        {
          kind: "text",
          name: "pregnancyLabel",
          label: "Question about pregnancy",
        },
      ],
    },
    {
      title: "Health disclaimer",
      fields: [
        { kind: "text", name: "disclaimerTitle", label: "Heading" },
        {
          kind: "rows",
          name: "disclaimerDocument",
          label: "The full disclaimer",
          hint: "Each part appears as a titled block in the document people can open and read.",
          itemLabel: "part",
          fields: [
            { kind: "text", name: "title", label: "Title of this part" },
            { kind: "textarea", name: "intro", label: "Introduction", rows: 2 },
            {
              kind: "rows",
              name: "items",
              label: "Points",
              itemLabel: "point",
              fields: [
                { kind: "text", name: "title", label: "Title" },
                { kind: "textarea", name: "lead", label: "Text", rows: 2 },
                {
                  kind: "list",
                  name: "points",
                  label: "Bullet points",
                  hint: "One per line.",
                },
                { kind: "text", name: "contactName", label: "Contact name" },
                { kind: "text", name: "contactEmail", label: "Contact email" },
              ],
            },
          ],
        },
        {
          kind: "list",
          name: "disclaimerBullets",
          label: "Short summary next to the tick box",
          hint: "One point per line.",
        },
        {
          kind: "textarea",
          name: "disclaimerConsentLabel",
          label: "Wording of the tick box",
          rows: 2,
        },
      ],
    },
    {
      title: "Refund policy",
      fields: [
        {
          kind: "list",
          name: "refundPolicyBullets",
          label: "The policy",
          hint: "One point per line.",
        },
        {
          kind: "textarea",
          name: "refundPolicyConsentLabel",
          label: "Wording of the tick box",
          rows: 2,
        },
      ],
    },
    {
      title: "Agreement",
      fields: [
        { kind: "text", name: "agreementTitle", label: "Heading" },
        {
          kind: "list",
          name: "agreementBullets",
          label: "What people agree to",
          hint: "One point per line.",
        },
        {
          kind: "textarea",
          name: "agreementConsentLabel",
          label: "Wording of the tick box",
          rows: 2,
        },
      ],
    },
    {
      title: "Before your session",
      fields: [
        {
          kind: "rows",
          name: "beforeSessionBlocks",
          label: "Blocks",
          itemLabel: "block",
          fields: [
            { kind: "text", name: "heading", label: "Heading" },
            {
              kind: "list",
              name: "paragraphs",
              label: "Paragraphs",
              hint: "One paragraph per line.",
            },
            {
              kind: "rows",
              name: "lists",
              label: "Lists",
              itemLabel: "list",
              fields: [
                { kind: "text", name: "label", label: "Heading of the list" },
                {
                  kind: "list",
                  name: "items",
                  label: "Items",
                  hint: "One per line.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Full session guidelines",
      fields: [
        { kind: "text", name: "guidelinesTitle", label: "Heading" },
        {
          kind: "rows",
          name: "guidelinesDocument",
          label: "The guidelines",
          itemLabel: "part",
          fields: [
            { kind: "text", name: "title", label: "Title of this part" },
            {
              kind: "rows",
              name: "blocks",
              label: "Blocks",
              itemLabel: "block",
              fields: [
                { kind: "text", name: "heading", label: "Heading" },
                {
                  kind: "list",
                  name: "paragraphs",
                  label: "Paragraphs",
                  hint: "One paragraph per line.",
                },
                {
                  kind: "rows",
                  name: "lists",
                  label: "Lists",
                  itemLabel: "list",
                  fields: [
                    { kind: "text", name: "label", label: "Heading of the list" },
                    {
                      kind: "list",
                      name: "items",
                      label: "Items",
                      hint: "One per line.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

export function createRegisterPageSchema(options: {
  title: string;
  description: string;
  previewPath: string;
  pageName: string;
  fullForm?: boolean;
}): DocumentSchema {
  return {
    title: options.title,
    description: options.description,
    previewPath: options.previewPath,
    sections: registerFormSections(options.pageName, options.fullForm ?? true),
  };
}

export const workshopRegisterPageSchema = createRegisterPageSchema({
  title: "Workshop Registration",
  description:
    "The full five-step workshop form: health questions, the disclaimer and the guidelines. Please change the medical and legal text with care.",
  previewPath: "/register?kind=workshop",
  pageName: "workshop registration",
});

export const freeOfferingRegisterPageSchema = createRegisterPageSchema({
  title: "Free Offering Registration",
  description:
    "The one-page registration form used for free sessions. Only the heading of the page is edited here; people then fill in their personal details.",
  previewPath: "/register?kind=free",
  pageName: "free offering registration",
  fullForm: false,
});

export const moduleRegisterPageSchema = createRegisterPageSchema({
  title: "Module Registration",
  description:
    "The full five-step form for module registration. Starts as a copy of Workshop Registration; change it independently after that.",
  previewPath: "/register?kind=module",
  pageName: "module registration",
});

export const retreatRegisterPageSchema = createRegisterPageSchema({
  title: "Retreat Registration",
  description:
    "The full five-step form people complete when they register for a retreat. Starts as a copy of Workshop Registration; change it independently after that.",
  previewPath: "/register?kind=retreat",
  pageName: "retreat registration",
});

export const legalPageSchema = (previewPath: string): DocumentSchema => ({
  title: "Legal page",
  previewPath,
  sections: [
    {
      title: "The page",
      fields: [
        { kind: "text", name: "title", label: "Heading" },
        {
          kind: "richtext",
          name: "body",
          label: "Text",
          hint: "The full text of the page.",
        },
      ],
    },
  ],
});

export const retreatSchema: DocumentSchema = {
  title: "Retreat",
  sections: [
    {
      title: "Basic details",
      fields: [
        {
          kind: "text",
          name: "title",
          label: "Title",
          required: true,
          hint: "The name shown on the website.",
        },
        {
          kind: "textarea",
          name: "description",
          label: "Short description",
          hint: "Shown on the retreat cards and under the title.",
          rows: 3,
        },
        {
          kind: "date",
          name: "date",
          label: "Start date",
          hint: "The first day of the retreat. Also used in the web address, with the city.",
        },
        {
          kind: "date",
          name: "endDate",
          label: "End date",
          hint: "Leave empty for a single-day retreat.",
        },
        {
          kind: "text",
          name: "cityCountry",
          label: "City, country",
          hint: "The small place label, for example: Saranda, Albania. Also used in the web address, with the start date.",
          placeholder: "Saranda, Albania",
        },
        {
          kind: "text",
          name: "location",
          label: "Address",
          hint: "The street address of the venue.",
          placeholder: "Rruga Skenderbeu 31, 9701, Saranda",
        },
        {
          kind: "text",
          name: "priceLabel",
          label: "Price",
          hint: "For example: 450€",
        },
      ],
    },
    {
      title: "Retreat information",
      fields: [
        { kind: "image", name: "image", label: "Main photo" },
        { kind: "richtext", name: "body", label: "Full description" },
        {
          kind: "gallery",
          name: "gallery",
          label: "Photo gallery",
          hint: "Shown as a gallery on the retreat page.",
        },
        {
          kind: "richtext",
          name: "cancellationPolicy",
          label: "Cancellation policy",
        },
        {
          kind: "text",
          name: "registrationLink",
          label: "Registration link",
          hint: "Leave empty to send people to Retreat Registration on this site.",
        },
      ],
    },
  ],
};
