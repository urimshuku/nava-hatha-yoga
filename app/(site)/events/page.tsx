import type { Metadata } from "next";

import { EventCard } from "@/components/cards/EventCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ContactSection } from "@/components/ui/ContactSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getPrograms, getSiteSettings, getUpcomingEvents } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildMetadata({
  title: "Upcoming Events",
  description:
    "Upcoming Classical Hatha Yoga workshops, free sessions, and gatherings at Nava Hatha Yoga in Saranda, Albania.",
  path: "/events",
});

export default async function EventsPage() {
  const [events, settings, programs] = await Promise.all([
    getUpcomingEvents(),
    getSiteSettings(),
    getPrograms(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming events"
        description="Explore the sessions below and discover a practice that can bring greater clarity, vitality, and steadiness into everyday life."
      />

      <Section tone="cream">
        <Container>
          {events.length > 0 ? (
            <MotionStagger className="mx-auto flex max-w-4xl flex-col gap-6">
              {events.map((event) => (
                <MotionItem key={event._id} className="h-full">
                  <EventCard event={event} whatsappNumber={settings.whatsapp} />
                </MotionItem>
              ))}
            </MotionStagger>
          ) : (
            <EmptyState
              title="New events are being scheduled"
              description="There are no upcoming events listed right now. Please check back soon, or get in touch to register your interest and be notified."
            >
              <Button href="/contact">Register your interest</Button>
            </EmptyState>
          )}

          <div className="mt-12 text-center">
            <Button href="/events/archive" variant="ghost">
              View past events &rarr;
            </Button>
          </div>
        </Container>
      </Section>

      <ContactSection
        programs={programs.map((program) => program.title)}
        email={settings.email}
        heading="Have a question about an event?"
        description="Reach out and we'll be glad to help you find the right session and answer any questions. Please leave a message below."
      />
    </>
  );
}
