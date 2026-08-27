import { groq } from "next-sanity";

import { imageFields } from "./fragments";

const eventSessionFields = `
  sessions[]{ day, hours },
  sessionNote,
  time,
`;

export const allEventsQuery = groq`
  *[_type == "event" && published == true] | order(date asc){
    _id,
    title,
    "slug": slug.current,
    "_updatedAt": _updatedAt,
    date,
    endDate,
    ${eventSessionFields}
    location,
    priceLabel,
    paymentNote,
    ageRequirement,
    category,
    relatedProgram->{ title, "slug": slug.current, intensity },
    description,
    notes,
    image${imageFields}
  }
`;
