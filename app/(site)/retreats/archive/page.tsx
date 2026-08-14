import type { Metadata } from "next";

import { RetreatArchiveList } from "@/components/RetreatArchiveList";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getPastRetreats } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildMetadata({
  title: "Past Retreats",
  description:
    "An archive of past Classical Hatha Yoga retreats from Nava Hatha Yoga.",
  path: "/retreats/archive",
});

export const revalidate = 60;

export default async function RetreatsArchivePage() {
  const retreats = await getPastRetreats();

  return (
    <>
      <PageHero
        eyebrow="Archive"
        title="Past retreats"
        description="A record of immersive retreats that have taken place."
      />

      <Section tone="cream">
        <Container>
          {retreats.length > 0 ? (
            <RetreatArchiveList retreats={retreats} />
          ) : (
            <EmptyState
              title="No past retreats yet"
              description="Once retreats have taken place, they will appear here."
            >
              <Button href="/retreats" variant="secondary">
                View upcoming retreats
              </Button>
            </EmptyState>
          )}

          <div className="mt-12">
            <Button href="/retreats" variant="ghost">
              &larr; Back to upcoming retreats
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
