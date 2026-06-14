import type { Metadata } from "next";

import { EventCard } from "@/components/cards/EventCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/ui/CTASection";
import { EmptyState } from "@/components/ui/EmptyState";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings, getUpcomingEvents } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildMetadata({
  title: "Upcoming Events",
  description:
    "Upcoming Classical Hatha Yoga workshops, free sessions, and gatherings at Ananta Hatha Yoga in Saranda, Albania.",
  path: "/events",
});

export default async function EventsPage() {
  const [events, settings] = await Promise.all([
    getUpcomingEvents(),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming events"
        description="All classes are currently held in person in Saranda, Albania. Registration is handled personally — by link or directly over WhatsApp."
      />

      <Section tone="cream">
        <Container>
          {events.length > 0 ? (
            <MotionStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

      <CTASection
        heading="Have a question about an event?"
        body="Reach out and we'll be glad to help you find the right session and answer any questions."
        ctaLabel="Contact us"
        ctaHref="/contact"
      />
    </>
  );
}
