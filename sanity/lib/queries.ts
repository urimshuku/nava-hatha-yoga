import { groq } from "next-sanity";

const seoFields = `seo{ title, description }`;
const imageFields = `{ ..., "alt": alt }`;

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
      secondaryCta{ label, href },
      image${imageFields}
    },
    highlights{
      items[]{ text, lines },
      closingQuote
    },
    intro{ eyebrow, heading, body, videoUrl },
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
    heroDescription,
    intro,
    teacherStory{
      nameLine,
      photo${imageFields},
      teaser,
      storyTitle,
      story
    },
    highlightCards[]{
      eyebrow,
      title,
      stat,
      body,
      showCertificationLogo
    },
    sections[]{
      title,
      body,
      image${imageFields},
      cta{ label, href }
    },
    ${seoFields}
  }
`;

export const programsQuery = groq`
  *[_type == "program" && published == true] | order(orderRank asc, title asc){
    _id,
    title,
    "slug": slug.current,
    shortIntro,
    category,
    intensity,
    image${imageFields}
  }
`;

export const programSlugsQuery = groq`
  *[_type == "program" && published == true && defined(slug.current)]{
    "slug": slug.current,
    "_updatedAt": _updatedAt
  }
`;

export const programBySlugQuery = groq`
  *[_type == "program" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    shortIntro,
    category,
    intensity,
    image${imageFields},
    whatIs,
    aboutThePractice,
    benefits,
    beforeProgramTitle,
    beforeProgramNotes,
    practiceIndependently,
    privateAndGroupSessions,
    videoUrl,
    videoTitle,
    priceLabel,
    ${seoFields}
  }
`;

const eventSessionFields = `
  sessions[]{ day, hours },
  sessionNote,
  time,
`;

export const allEventsQuery = groq`
  *[_type == "event" && published == true] | order(date asc){
    _id,
    title,
    date,
    endDate,
    ${eventSessionFields}
    location,
    priceLabel,
    paymentNote,
    teacher,
    ageRequirement,
    category,
    relatedProgram->{ title, "slug": slug.current, intensity },
    description,
    notes,
    image${imageFields},
    registrationLink,
    whatsappEnabled
  }
`;

export const retreatsQuery = groq`
  *[_type == "retreat" && published == true] | order(date asc){
    _id,
    title,
    "slug": slug.current,
    date,
    location,
    priceLabel,
    description,
    image${imageFields}
  }
`;

export const retreatSlugsQuery = groq`
  *[_type == "retreat" && published == true && defined(slug.current)]{
    "slug": slug.current,
    "_updatedAt": _updatedAt
  }
`;

export const retreatBySlugQuery = groq`
  *[_type == "retreat" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    date,
    location,
    priceLabel,
    description,
    body,
    gallery[]${imageFields},
    image${imageFields},
    registrationLink,
    cancellationPolicy,
    ${seoFields}
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

export const contactPageQuery = groq`
  *[_type == "contactPage"][0]{
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
    ${seoFields}
  }
`;

export const retreatsPageQuery = groq`
  *[_type == "retreatsPage"][0]{
    heroEyebrow,
    heroTitle,
    heroDescription,
    comingSoonHeading,
    comingSoonBody,
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
    ${seoFields}
  }
`;

export const registerPageQuery = groq`
  *[_type == "registerPage"][0]{
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
