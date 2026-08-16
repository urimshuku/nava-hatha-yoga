import { groq } from "next-sanity";

import { imageFields, seoFields } from "./fragments";

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
    contextLine,
    relatedPrograms[]{ label, href },
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
