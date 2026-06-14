import type { Metadata } from "next";

import { ArchiveList } from "@/components/ArchiveList";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getPastEvents } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildMetadata({
  title: "Past Events",
  description:
    "An archive of past Classical Hatha Yoga events and gatherings at Ananta Hatha Yoga.",
  path: "/events/archive",
});

export default async function EventsArchivePage() {
  const events = await getPastEvents();

  return (
    <>
      <PageHero
        eyebrow="Archive"
        title="Past events"
        description="A record of gatherings and sessions that have taken place."
      />

      <Section tone="cream">
        <Container>
          {events.length > 0 ? (
            <ArchiveList events={events} />
          ) : (
            <EmptyState
              title="No past events yet"
              description="Once events have taken place, they will appear here."
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
