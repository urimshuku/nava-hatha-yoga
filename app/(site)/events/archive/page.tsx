import type { Metadata } from "next";

import { ArchiveList } from "@/components/ArchiveList";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getPastEvents, getEventsPage } from "@/lib/cms/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Past Classical Hatha Yoga Events in Albania",
  description:
    "An archive of past Classical Hatha Yoga events and gatherings in Albania.",
  path: "/events/archive",
});

// Rendered per request so edits made in /admin are live the moment they are saved.
export const dynamic = "force-dynamic";

export default async function EventsArchivePage() {
  const [events, page] = await Promise.all([getPastEvents(), getEventsPage()]);

  return (
    <>
      <PageHero
        eyebrow={page.archiveEyebrow?.trim() || "Archive"}
        title={page.archiveTitle?.trim() || "Past events"}
        description={
          page.archiveDescription?.trim() ||
          "A record of gatherings and sessions that have taken place."
        }
      />

      <Section tone="cream">
        <Container>
          {events.length > 0 ? (
            <ArchiveList events={events} />
          ) : (
            <EmptyState
              title={page.archiveEmptyTitle?.trim() || "No past events yet"}
              description={
                page.archiveEmptyDescription?.trim() ||
                "Once events have taken place, they will appear here."
              }
            >
              <Button href="/events" variant="secondary">
                View upcoming events
              </Button>
            </EmptyState>
          )}

          <div className="mt-12">
            <Button href="/events" variant="ghost">
              &larr; Back to upcoming events
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
