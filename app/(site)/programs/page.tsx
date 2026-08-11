import type { Metadata } from "next";

import { FreeOfferingsSection } from "@/components/content/FreeOfferingsSection";
import { PrivateSessionsSection } from "@/components/content/PrivateSessionsSection";
import { ProgramsListing } from "@/components/programs/ProgramsListing";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/ui/PageHero";
import { partitionProgramsByCategory } from "@/lib/constants";
import { placeholderHomePage, placeholderProgramsPage } from "@/lib/placeholders";
import { buildMetadata } from "@/lib/seo";
import { PHASE1_PROGRAMS_PAGE_SEO } from "@/lib/seo-phase1";
import { getHomePage, getPrograms, getProgramsPage } from "@/sanity/lib/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getProgramsPage();
  return buildMetadata({
    title: PHASE1_PROGRAMS_PAGE_SEO.title,
    description: PHASE1_PROGRAMS_PAGE_SEO.description,
    seo: page.seo,
    path: "/programs",
  });
}

export default async function ProgramsPage() {
  const [programs, page, home] = await Promise.all([
    getPrograms(),
    getProgramsPage(),
    getHomePage(),
  ]);
  const { main, special } = partitionProgramsByCategory(programs);
  const free = page.freeOfferings ?? placeholderProgramsPage.freeOfferings;
  const privateSessions =
    home.privateCorporate ?? placeholderHomePage.privateCorporate;

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow?.trim() || placeholderProgramsPage.heroEyebrow}
        title={
          page.heroTitle?.trim() ||
          placeholderProgramsPage.heroTitle ||
          PHASE1_PROGRAMS_PAGE_SEO.heroTitle
        }
        description={
          page.heroDescription?.trim() ||
          placeholderProgramsPage.heroDescription ||
          PHASE1_PROGRAMS_PAGE_SEO.heroDescription
        }
      />

      <Section tone="cream">
        <Container>
          <ProgramsListing mainPrograms={main} specialPrograms={special} />
        </Container>
      </Section>

      <FreeOfferingsSection
        eyebrow={free?.eyebrow}
        lead={free?.lead}
        items={free?.items}
      />

      <PrivateSessionsSection
        heading={privateSessions?.heading}
        lead={privateSessions?.lead}
        offerings={privateSessions?.offerings}
        cta={privateSessions?.cta}
      />
    </>
  );
}
