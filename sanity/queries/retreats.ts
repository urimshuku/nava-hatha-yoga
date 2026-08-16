import { groq } from "next-sanity";

import { imageFields, seoFields } from "./fragments";

export const retreatsQuery = groq`
  *[_type == "retreat" && published == true && !(_id in ["retreat-test-preview", "drafts.retreat-test-preview"])] | order(date asc){
    _id,
    title,
    "slug": slug.current,
    date,
    endDate,
    location,
    priceLabel,
    description,
    image${imageFields}
  }
`;

export const retreatSlugsQuery = groq`
  *[_type == "retreat" && published == true && defined(slug.current) && !(_id in ["retreat-test-preview", "drafts.retreat-test-preview"])]{
    "slug": slug.current,
    "_updatedAt": _updatedAt
  }
`;

export const retreatBySlugQuery = groq`
  *[_type == "retreat" && published == true && slug.current == $slug && !(_id in ["retreat-test-preview", "drafts.retreat-test-preview"])][0]{
    _id,
    title,
    "slug": slug.current,
    date,
    endDate,
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
