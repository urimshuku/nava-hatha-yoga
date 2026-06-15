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
      shortIntro
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
    sections[]{
      title,
      body,
      image${imageFields}
    },
    ${seoFields}
  }
`;

export const programsQuery = groq`
  *[_type == "program" && published == true] | order(orderRank asc, title asc){
    _id,
    title,
    "slug": slug.current,
    shortIntro
  }
`;

export const featuredProgramsFallbackQuery = groq`
  *[_type == "program" && published == true] | order(orderRank asc, title asc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    shortIntro
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
    whatIs,
    aboutThePractice,
    benefits,
    practiceIndependently,
    privateAndGroupSessions,
    videoUrl,
    priceLabel,
    ${seoFields}
  }
`;

export const upcomingEventsQuery = groq`
  *[_type == "event" && published == true && dateTime(date) >= dateTime(now())]
    | order(date asc){
    _id,
    title,
    date,
    time,
    location,
    priceLabel,
    teacher,
    category,
    relatedProgram->{ title, "slug": slug.current },
    description,
    image${imageFields},
    registrationLink,
    whatsappEnabled
  }
`;

export const upcomingEventsByProgramQuery = groq`
  *[_type == "event" && published == true
    && dateTime(date) >= dateTime(now())
    && relatedProgram->slug.current == $slug]
    | order(date asc){
    _id,
    title,
    date,
    time,
    location,
    priceLabel,
    teacher,
    category,
    relatedProgram->{ title, "slug": slug.current },
    description,
    image${imageFields},
    registrationLink,
    whatsappEnabled
  }
`;

export const pastEventsQuery = groq`
  *[_type == "event" && published == true && dateTime(date) < dateTime(now())]
    | order(date desc){
    _id,
    title,
    date,
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
