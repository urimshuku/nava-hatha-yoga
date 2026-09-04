import type { Metadata } from "next";

import { RetreatArchiveList } from "@/components/RetreatArchiveList";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getPastRetreats, getRetreatsPage } from "@/lib/cms/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Past Retreats",
  description:
    "An archive of past Classical Hatha Yoga retreats from Nava Hatha Yoga.",
  path: "/retreats/archive",
});

// Rendered per request so edits made in /admin are live the moment they are saved.
export const dynamic = "force-dynamic";

export default async function RetreatsArchivePage() {
  const [retreats, page] = await Promise.all([
    getPastRetreats(),
    getRetreatsPage(),
  ]);

  return (
    <>
      <PageHero
        title={page.archiveTitle?.trim() || "Past retreats"}
        description={
          page.archiveDescription?.trim() ||
          "A record of immersive retreats that have taken place."
        }
      />

      <Section tone="cream">
        <Container>
          {retreats.length > 0 ? (
            <RetreatArchiveList retreats={retreats} />
          ) : (
            <EmptyState
              title={page.archiveEmptyTitle?.trim() || "No past retreats yet"}
              description={
                page.archiveEmptyDescription?.trim() ||
                "Once retreats have taken place, they will appear here."
              }
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
