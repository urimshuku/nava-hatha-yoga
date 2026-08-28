import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EventCard } from "@/components/cards/EventCard";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { isPastEvent } from "@/lib/event-boundary";
import { buildMetadata } from "@/lib/seo";
import { programImageSrc } from "@/lib/local-images";
import {
  buildBreadcrumbJsonLd,
  buildEventJsonLd,
} from "@/lib/structured-data";
import { formatRegistrationEventLabel } from "@/lib/utils";
import { urlForImage } from "@/lib/cms/image-url";
import { getEventBySlug, getSiteSettings } from "@/lib/cms/site-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Rendered per request so edits made in /admin are live the moment they are
// saved, which also means there are no params to pre-generate.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return buildMetadata({ title: "Session", path: `/events/${slug}` });
  }

  const description =
    event.description?.trim() || formatRegistrationEventLabel(event);
  const ogImage = urlForImage(event.image)?.width(1200).height(630).fit("crop").url();
  const localOg = event.relatedProgram?.slug
    ? programImageSrc(event.relatedProgram.slug)
    : undefined;

  return buildMetadata({
    title: event.title,
    description,
    path: `/events/${event.slug}`,
    image: ogImage
      ? { url: ogImage, width: 1200, height: 630, alt: event.title }
      : localOg
        ? { url: localOg, width: 1200, height: 630, alt: event.title }
        : undefined,
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([
    getEventBySlug(slug),
    getSiteSettings(),
  ]);

  if (!event) notFound();

  const past = isPastEvent(event);
  const eventJsonLd = buildEventJsonLd(event, settings);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
            { name: event.title, path: `/events/${event.slug}` },
          ]),
          ...(eventJsonLd ? [eventJsonLd] : []),
        ]}
      />

      <Section tone="cream" className="pt-28 sm:pt-32">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Link
              href={past ? "/events/archive" : "/events"}
              className="mb-6 inline-flex text-sm font-medium text-brown transition-colors hover:text-saffron"
            >
              {past ? "← Past events" : "← Upcoming events"}
            </Link>

            {past ? (
              <p className="mb-6 text-sm text-brown">
                This session has taken place.
              </p>
            ) : null}

            <EventCard
              event={event}
              experienceNote={settings.eventExperienceNote}
              headingLevel={1}
              linkTitle={false}
              showRegistration={!past}
            />

            <div className="mt-8 text-center">
              <Button href="/contact" variant="ghost">
                Questions? Get in touch
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
