import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EventCard } from "@/components/cards/EventCard";
import { CMSRichText } from "@/components/content/CMSRichText";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";
import { SanityImage } from "@/components/ui/SanityImage";
import { urlForImage } from "@/sanity/lib/image";
import { buildMetadata } from "@/lib/seo";
import {
  getProgramBySlug,
  getProgramSlugs,
  getSiteSettings,
  getUpcomingEventsByProgram,
} from "@/sanity/lib/fetch";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return buildMetadata({ title: "Program", path: `/programs/${slug}` });
  return buildMetadata({
    title: program.title,
    description: program.shortIntro,
    seo: program.seo,
    path: `/programs/${program.slug}`,
  });
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) notFound();

  const [settings, relatedEvents] = await Promise.all([
    getSiteSettings(),
    getUpcomingEventsByProgram(program.slug),
  ]);

  const symbolUrl = urlForImage(program.symbol)?.width(120).height(120).url();

  return (
    <>
      <section className="bg-ivory pt-32 pb-section-sm sm:pt-40 border-b border-border">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Link
              href="/programs"
              className="mb-6 inline-flex text-sm font-medium text-brown transition-colors hover:text-saffron"
            >
              &larr; All programs
            </Link>
            {symbolUrl ? (
              <Image
                src={symbolUrl}
                alt=""
                aria-hidden="true"
                width={120}
                height={120}
                className="mx-auto mb-6 h-16 w-16 object-contain opacity-90"
              />
            ) : (
              <p className="eyebrow mb-5">Program</p>
            )}
            <h1 className="text-display text-balance">{program.title}</h1>
            {program.shortIntro ? (
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brown">
                {program.shortIntro}
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div>
              {program.body && program.body.length > 0 ? (
                <CMSRichText value={program.body} />
              ) : null}

              {program.benefits && program.benefits.length > 0 ? (
                <div className="mt-12 border-t border-border pt-10">
                  <h2 className="font-heading text-2xl text-charcoal">Benefits</h2>
                  <ul className="mt-5 space-y-3">
                    {program.benefits.map((item, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed text-[#3a322a]">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {program.experiences && program.experiences.length > 0 ? (
                <div className="mt-12 border-t border-border pt-10">
                  <h2 className="font-heading text-2xl text-charcoal">
                    What you may develop or experience
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {program.experiences.map((item, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed text-[#3a322a]">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-soft"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="overflow-hidden rounded-xl border border-border bg-ivory shadow-soft">
                <div className="aspect-[4/5]">
                  <SanityImage
                    image={program.image}
                    alt={program.title}
                    width={600}
                    height={750}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-sm leading-relaxed text-brown">
                    Interested in this practice? View upcoming sessions or get in touch to
                    register your interest.
                  </p>
                  <Button href="/events" className="w-full">
                    View upcoming events
                  </Button>
                  <Button href="/contact" variant="secondary" className="w-full">
                    Register interest
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Related upcoming events for this practice */}
      {relatedEvents.length > 0 ? (
        <Section tone="ivory" className="border-t border-border">
          <Container>
            <div className="text-center">
              <p className="eyebrow mb-4">Upcoming</p>
              <h2 className="text-display-sm">Sessions for {program.title}</h2>
              <Ornament className="mt-7" width="w-16" />
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.slice(0, 3).map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  whatsappNumber={settings.whatsapp}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
