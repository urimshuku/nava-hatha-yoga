import type { Metadata } from "next";

import { EventCard } from "@/components/cards/EventCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ContactSection } from "@/components/ui/ContactSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { PageHero } from "@/components/ui/PageHero";
import { placeholderEventsPage } from "@/lib/placeholders";
import { buildMetadata } from "@/lib/seo";
import {
  getEventsPage,
  getPrograms,
  getSiteSettings,
  getUpcomingEvents,
} from "@/sanity/lib/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getEventsPage();
  return buildMetadata({
    title: "Upcoming Events",
    description:
      page.heroDescription?.trim() ||
      "Upcoming Classical Hatha Yoga workshops, free sessions, and gatherings at Nava Hatha Yoga in Saranda, Albania.",
    seo: page.seo,
    path: "/events",
  });
}

export const revalidate = 60;

export default async function EventsPage() {
  const [events, settings, programs, page] = await Promise.all([
    getUpcomingEvents(),
    getSiteSettings(),
    getPrograms(),
    getEventsPage(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow?.trim() || placeholderEventsPage.heroEyebrow}
        title={page.heroTitle?.trim() || placeholderEventsPage.heroTitle || ""}
        description={
          page.heroDescription?.trim() || placeholderEventsPage.heroDescription
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
                    whatsappNumber={settings.whatsapp}
                    experienceNote={settings.eventExperienceNote}
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

          <div className="mt-8 text-center sm:mt-12">
            <Button href="/events/archive" variant="ghost">
              View past events &rarr;
            </Button>
          </div>
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
