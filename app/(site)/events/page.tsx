import type { Metadata } from "next";

import { ArchiveList } from "@/components/ArchiveList";
import { CollapsibleArchive } from "@/components/CollapsibleArchive";
import { EventCard } from "@/components/cards/EventCard";
import { EventHashScroll } from "@/components/cards/EventHashScroll";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ContactSection } from "@/components/ui/ContactSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { PageHero } from "@/components/ui/PageHero";
import { placeholderEventsPage } from "@/lib/placeholders";
import { buildMetadata } from "@/lib/seo";
import { PHASE1_EVENTS_SEO } from "@/lib/seo-phase1";
import { buildEventsJsonLd } from "@/lib/structured-data";
import {
  getEventsPage,
  getPastListings,
  getPrograms,
  getSiteSettings,
  getUpcomingListings,
} from "@/lib/cms/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getEventsPage();
  return buildMetadata({
    title: PHASE1_EVENTS_SEO.title,
    description: PHASE1_EVENTS_SEO.description,
    seo: page.seo,
    path: "/events",
  });
}

// Rendered per request so edits made in /admin are live the moment they are saved.
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [events, pastEvents, settings, programs, page] = await Promise.all([
    getUpcomingListings(),
    getPastListings(),
    getSiteSettings(),
    getPrograms(),
    getEventsPage(),
  ]);

  return (
    <>
      <EventHashScroll />
      <JsonLd data={buildEventsJsonLd(events, settings)} />
      <PageHero
        title={page.heroTitle?.trim() || placeholderEventsPage.heroTitle || ""}
        description={
          page.heroDescription?.trim() ||
          placeholderEventsPage.heroDescription ||
          PHASE1_EVENTS_SEO.heroDescription
        }
      />

      <Section tone="cream">
        <Container>
          {events.length > 0 ? (
            <MotionStagger className="mx-auto flex max-w-4xl flex-col gap-4 sm:gap-6">
              {events.map((event) => (
                <MotionItem key={event._id} className="h-full">
                  <EventCard
                    event={event}
                    experienceNote={settings.eventExperienceNote}
                    headingLevel={2}
                  />
                </MotionItem>
              ))}
            </MotionStagger>
          ) : (
            <EmptyState
              title={
                page.emptyTitle?.trim() ||
                placeholderEventsPage.emptyTitle ||
                "New events are being scheduled"
              }
              description={
                page.emptyDescription?.trim() ||
                placeholderEventsPage.emptyDescription
              }
            >
              <Button href="/contact">Register your interest</Button>
            </EmptyState>
          )}

          <CollapsibleArchive
            id="past-events"
            className="mx-auto max-w-4xl"
            title={page.archiveTitle?.trim() || "Past events"}
            count={pastEvents.length}
          >
            <ArchiveList events={pastEvents} headingLevel={3} />
          </CollapsibleArchive>
        </Container>
      </Section>

      <ContactSection
        programs={programs.map((program) => program.title)}
        email={settings.email}
        heading={
          page.contactHeading?.trim() || placeholderEventsPage.contactHeading
        }
        description={
          page.contactDescription?.trim() ||
          placeholderEventsPage.contactDescription
        }
      />
    </>
  );
}
