import type { PortableTextBlock } from "@portabletext/types";

import type { LegalPage } from "@/lib/cms/content-types";

import legalData from "./legal-content.json";

type LegalSection = {
  type: "h2" | "p";
  text: string;
};

type LegalPageContent = {
  title: string;
  slug: string;
  sections: LegalSection[];
};

function sectionToBlock(section: LegalSection, index: number): PortableTextBlock {
  return {
    _type: "block",
    _key: `legal-${index}`,
    style: section.type === "h2" ? "h2" : "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `legal-${index}-span`,
        text: section.text,
        marks: [],
      },
    ],
  };
}

export function sectionsToBlocks(sections: LegalSection[]): PortableTextBlock[] {
  return sections.map(sectionToBlock);
}

export function getPlaceholderLegalPages(): Record<string, LegalPage> {
  const pages = legalData as Record<string, LegalPageContent>;

  return Object.fromEntries(
    Object.entries(pages).map(([slug, page]) => [
      slug,
      {
        title: page.title,
        slug: page.slug,
        body: sectionsToBlocks(page.sections),
      },
    ]),
  );
}
