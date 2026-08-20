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
import { urlForImage } from "@/sanity/lib/image";
import {
  getEventBySlug,
  getEventSlugs,
  getSiteSettings,
} from "@/sanity/lib/fetch";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return buildMetadata({ title: "Session", path: `/events/${slug}` });
  }

  const description =
    event.description?.trim() || formatRegistrationEventLabel(event);
  const sanityOg = urlForImage(event.image)?.width(1200).height(630).fit("crop").url();
  const localOg = event.relatedProgram?.slug
    ? programImageSrc(event.relatedProgram.slug)
    : undefined;

  return buildMetadata({
    title: event.title,
    description,
    path: `/events/${event.slug}`,
    image: sanityOg
      ? { url: sanityOg, width: 1200, height: 630, alt: event.title }
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
              whatsappNumber={settings.whatsapp}
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
