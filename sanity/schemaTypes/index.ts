import type { SchemaTypeDefinition } from "sanity";

import { blockContent } from "./objects/blockContent";
import { ctaLink } from "./objects/ctaLink";
import { imageWithAlt } from "./objects/imageWithAlt";
import { seo } from "./objects/seo";

import { siteSettings } from "./siteSettings";
import { homePage } from "./homePage";
import { aboutPage } from "./aboutPage";
import { program } from "./program";
import { event } from "./event";
import { retreat } from "./retreat";
import { legalPage } from "./legalPage";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  blockContent,
  ctaLink,
  imageWithAlt,
  seo,
  // Documents
  siteSettings,
  homePage,
  aboutPage,
  program,
  event,
  retreat,
  legalPage,
];
