import type { Metadata } from "next";

import { FreeOfferingsSection } from "@/components/content/FreeOfferingsSection";
import { PrivateSessionsSection } from "@/components/content/PrivateSessionsSection";
import { ProgramsListing } from "@/components/programs/ProgramsListing";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/ui/PageHero";
import { partitionProgramsByCategory } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getPrograms } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildMetadata({
  title: "Programs & Offerings",
  description:
    "Explore the Classical Hatha Yoga programs and offerings at Nava Hatha Yoga, each taught in its original, traditional form.",
  path: "/programs",
});

export default async function ProgramsPage() {
  const programs = await getPrograms();
  const { main, special } = partitionProgramsByCategory(programs);

  return (
    <>
      <PageHero
        eyebrow="Programs & Offerings"
        title="Classical Hatha Yoga practices"
        description="Core programs form the foundation of the practice. Special programs address specific needs and can be explored alongside them."
      />

      <Section tone="cream">
        <Container>
          <ProgramsListing mainPrograms={main} specialPrograms={special} />
        </Container>
      </Section>

      <FreeOfferingsSection />

      <PrivateSessionsSection />
    </>
  );
}
