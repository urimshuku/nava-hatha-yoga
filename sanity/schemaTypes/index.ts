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

import { siteSettings } from "./siteSettings";
import { homePage } from "./homePage";
import { aboutPage } from "./aboutPage";
import { contactPage } from "./contactPage";
import { registerPage } from "./registerPage";
import { programsPage } from "./programsPage";
import { eventsPage } from "./eventsPage";
import { retreatsPage } from "./retreatsPage";
import { program } from "./program";
import { event } from "./event";
import { retreat } from "./retreat";
import { legalPage } from "./legalPage";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
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
  // Documents
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
