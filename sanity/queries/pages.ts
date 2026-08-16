import { groq } from "next-sanity";

import { imageFields, seoFields } from "./fragments";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    brandName,
    tagline,
    description,
    email,
    phone,
    whatsapp,
    location,
    social[]{ label, url },
    beforeProgramNotes,
    bonusTitle,
    bonusItems,
    discountNote,
    medicalNoticeTitle,
    medicalNotice,
    eventExperienceNote,
    ${seoFields}
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    hero{
      headline,
      subtitle,
      supportingText,
      primaryCta{ label, href },
      secondaryCta{ label, href }
    },
    highlights{
      items[]{ text, lines },
      closingQuote
    },
    intro{ eyebrow, heading, body, videoUrl, videoTitle },
    featuredProgramsSection{ eyebrow, title, description, ctaLabel },
    featuredPrograms[]->{
      _id,
      title,
      "slug": slug.current,
      shortIntro,
      category,
      intensity,
      image${imageFields}
    },
    upcomingEventsSection{
      eyebrow,
      title,
      description,
      emptyTitle,
      emptyDescription,
      ctaLabel
    },
    privateCorporate{
      heading,
      lead,
      offerings[]{ title, body },
      cta{ label, href }
    },
    finalCta{ heading, body, cta{ label, href } },
    ${seoFields}
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    title,
    heroEyebrow,
    heroDescription,
    intro,
    teacherSectionTitle,
    teacherStory{
      nameLine,
      photo${imageFields},
      teaser,
      storyTitle,
      story
    },
    highlightCards[]{
      title
    },
    sections[]{
      title,
      body,
      image${imageFields},
      cta{ label, href }
    },
    finalCta{ heading, body, cta{ label, href } },
    ${seoFields}
  }
`;

export const contactPageQuery = groq`
  *[_type == "contactPage"][0]{
    heroEyebrow,
    heroTitle,
    heroDescription,
    formHeading,
    quickMessageBody,
    whatsappPrefill,
    teachingLocations{
      mainHeading,
      mainLocations,
      otherHeading,
      otherLocations
    },
    ${seoFields}
  }
`;

export const programsPageQuery = groq`
  *[_type == "programsPage"][0]{
    heroEyebrow,
    heroTitle,
    heroDescription,
    mainProgramsHeading,
    specialProgramsHeading,
    specialProgramsLead,
    freeOfferings{
      eyebrow,
      lead,
      items[]{ title, description }
    },
    ${seoFields}
  }
`;

export const eventsPageQuery = groq`
  *[_type == "eventsPage"][0]{
    heroEyebrow,
    heroTitle,
    heroDescription,
    emptyTitle,
    emptyDescription,
    contactHeading,
    contactDescription,
    archiveEyebrow,
    archiveTitle,
    archiveDescription,
    archiveEmptyTitle,
    archiveEmptyDescription,
    ${seoFields}
  }
`;

export const retreatsPageQuery = groq`
  *[_type == "retreatsPage"][0]{
    heroEyebrow,
    heroTitle,
    heroDescription,
    comingSoonEyebrow,
    comingSoonHeading,
    comingSoonBody,
    expectationsEyebrow,
    expectationsHeading,
    expectations[]{ title, body },
    listingCta{ heading, body, cta{ label, href } },
    partnerPrograms{
      heading,
      intro,
      collaborateHeading,
      collaborateItems,
      closing,
      whatsappPrefill
    },
    archiveEyebrow,
    archiveTitle,
    archiveDescription,
    archiveEmptyTitle,
    archiveEmptyDescription,
    ${seoFields}
  }
`;

export const registerPageQuery = groq`
  *[_type == "registerPage"][0]{
    heroEyebrow,
    heroTitle,
    heroDescription,
    healthIntro,
    healthConditions,
    healthDetailsLabel,
    majorSurgeryQuestion,
    majorSurgeryHint,
    pregnancyLabel,
    disclaimerTitle,
    disclaimerDocument[]{
      title,
      intro,
      items[]{ title, lead, points, contactName, contactEmail }
    },
    disclaimerBullets,
    disclaimerConsentLabel,
    refundPolicyBullets,
    refundPolicyConsentLabel,
    agreementTitle,
    agreementBullets,
    agreementConsentLabel,
    beforeSessionBlocks[]{
      heading,
      paragraphs,
      lists[]{ label, items }
    },
    guidelinesTitle,
    guidelinesDocument[]{
      title,
      blocks[]{
        heading,
        paragraphs,
        lists[]{ label, items }
      }
    }
  }
`;

export const legalPageQuery = groq`
  *[_type == "legalPage" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    body,
    ${seoFields}
  }
`;
