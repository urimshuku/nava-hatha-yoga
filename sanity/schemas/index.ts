import type { SchemaTypeDefinition } from "sanity";

import { aboutSection } from "./objects/aboutSection";
import { blockContent } from "./objects/blockContent";
import { ctaLink } from "./objects/ctaLink";
import {
  disclaimerItem,
  disclaimerSection,
} from "./objects/disclaimerContent";
import {
  guidelineBlock,
  guidelineList,
  guidelineSection,
} from "./objects/guidelineContent";
import { imageWithAlt } from "./objects/imageWithAlt";
import { seo } from "./objects/seo";

import { aboutPage } from "./documents/aboutPage";
import { contactPage } from "./documents/contactPage";
import { event } from "./documents/event";
import { eventsPage } from "./documents/eventsPage";
import { homePage } from "./documents/homePage";
import { legalPage } from "./documents/legalPage";
import { program } from "./documents/program";
import { programsPage } from "./documents/programsPage";
import { registerPage } from "./documents/registerPage";
import { retreat } from "./documents/retreat";
import { retreatsPage } from "./documents/retreatsPage";
import { siteSettings } from "./documents/siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  aboutSection,
  blockContent,
  ctaLink,
  disclaimerItem,
  disclaimerSection,
  guidelineBlock,
  guidelineList,
  guidelineSection,
  imageWithAlt,
  seo,
  siteSettings,
  homePage,
  aboutPage,
  contactPage,
  registerPage,
  programsPage,
  eventsPage,
  retreatsPage,
  program,
  event,
  retreat,
  legalPage,
];
