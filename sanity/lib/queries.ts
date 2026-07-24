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
    medicalNotice,
    ${seoFields}
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    hero{
      headline,
      supportingText,
      primaryCta{ label, href },
      secondaryCta{ label, href },
      image${imageFields}
    },
    intro{ eyebrow, heading, body, videoUrl },
    featuredPrograms[]->{
      _id,
      title,
      "slug": slug.current,
      shortIntro,
      category,
      image${imageFields}
    },
    privateCorporate{ heading, body },
    aboutIntro{ eyebrow, heading, body, image${imageFields} },
    finalCta{ heading, body, cta{ label, href } },
    ${seoFields}
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    title,
    intro,
    teacherStory{
      nameLine,
      photo${imageFields},
      teaser,
      storyTitle,
      story
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
    image${imageFields}
  }
`;

export const featuredProgramsFallbackQuery = groq`
  *[_type == "program" && published == true] | order(orderRank asc, title asc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    shortIntro,
    category,
    image${imageFields}
  }
`;

export const programSlugsQuery = groq`
  *[_type == "program" && published == true && defined(slug.current)].slug.current
`;

export const programBySlugQuery = groq`
  *[_type == "program" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    shortIntro,
    category,
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

export const allEventsQuery = groq`
  *[_type == "event" && published == true] | order(date asc){
    _id,
    title,
    date,
    endDate,
    time,
    location,
    priceLabel,
    paymentNote,
    teacher,
    ageRequirement,
    category,
    relatedProgram->{ title, "slug": slug.current },
    description,
    notes,
    image${imageFields},
    registrationLink,
    whatsappEnabled
  }
`;

export const upcomingEventsQuery = groq`
  *[_type == "event" && published == true && dateTime(coalesce(endDate, date)) >= dateTime(now())]
    | order(date asc){
    _id,
    title,
    date,
    endDate,
    time,
    location,
    priceLabel,
    paymentNote,
    teacher,
    ageRequirement,
    category,
    relatedProgram->{ title, "slug": slug.current },
    description,
    notes,
    image${imageFields},
    registrationLink,
    whatsappEnabled
  }
`;

export const upcomingEventsByProgramQuery = groq`
  *[_type == "event" && published == true
    && dateTime(coalesce(endDate, date)) >= dateTime(now())
    && relatedProgram->slug.current == $slug]
    | order(date asc){
    _id,
    title,
    date,
    endDate,
    time,
    location,
    priceLabel,
    paymentNote,
    teacher,
    ageRequirement,
    category,
    relatedProgram->{ title, "slug": slug.current },
    description,
    notes,
    image${imageFields},
    registrationLink,
    whatsappEnabled
  }
`;

export const pastEventsQuery = groq`
  *[_type == "event" && published == true && dateTime(coalesce(endDate, date)) < dateTime(now())]
    | order(date desc){
    _id,
    title,
    date,
    endDate,
    time,
    location,
    category,
    relatedProgram->{ title, "slug": slug.current }
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
  *[_type == "retreat" && published == true && defined(slug.current)].slug.current
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
    ${seoFields}
  }
`;

export const retreatsPageQuery = groq`
  *[_type == "retreatsPage"][0]{
    heroTitle,
    heroDescription,
    comingSoonHeading,
    comingSoonBody,
    expectationsHeading,
    expectations[]{ title, body },
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
