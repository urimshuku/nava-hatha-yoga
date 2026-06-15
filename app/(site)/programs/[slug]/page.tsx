import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";

import { EventCard } from "@/components/cards/EventCard";
import { ProgramWatchButton } from "@/components/content/ProgramYouTubeSection";
import { CMSRichText } from "@/components/content/CMSRichText";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { LocalProgramImage } from "@/components/ui/LocalProgramImage";
import { LocalProgramSymbol } from "@/components/ui/LocalProgramSymbol";
import { Ornament } from "@/components/ui/Ornament";
import { buildMetadata } from "@/lib/seo";
import { ensureTrailingPeriod, cn } from "@/lib/utils";
import {
  PROGRAM_AFTER_PROGRAM_TITLE,
  PROGRAM_MEDICAL_NOTICE,
  PROGRAM_MEDICAL_NOTICE_TITLE,
  getBeforeProgramNotes,
  getBeforeProgramTitle,
  getProgramPriceLabel,
  getProgramVideoLink,
  programWhatIsSectionTitle,
  programAfterProgramText,
  programSidebarCtaText,
} from "@/lib/constants";
import { programSidebarImageAspectClass } from "@/lib/local-images";
import {
  getProgramBySlug,
  getProgramSlugs,
  getSiteSettings,
  getUpcomingEventsByProgram,
} from "@/sanity/lib/fetch";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function ProgramSection({
  title,
  children,
  first = false,
}: {
  title: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <div className={first ? undefined : "mt-12 border-t border-border pt-10"}>
      <h2 className="font-heading text-2xl text-charcoal">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function hasRichText(value?: PortableTextBlock[]) {
  return Boolean(value && value.length > 0);
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

  const videoLink = program.videoUrl ? getProgramVideoLink(program.slug, program.title) : null;
  const priceLabel = getProgramPriceLabel(program.slug, program.priceLabel);

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
            <LocalProgramSymbol slug={program.slug} />
            <h1 className="text-display text-balance">{program.title}</h1>
            {program.shortIntro ? (
              <p className="hero-subtitle mt-6">{program.shortIntro}</p>
            ) : null}
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div>
              {hasRichText(program.whatIs) ? (
                <ProgramSection title={programWhatIsSectionTitle(program.title)} first>
                  <CMSRichText value={program.whatIs} />
                </ProgramSection>
              ) : null}

              {hasRichText(program.aboutThePractice) ? (
                <ProgramSection
                  title="About the Practice"
                  first={!hasRichText(program.whatIs)}
                >
                  <CMSRichText value={program.aboutThePractice} />
                </ProgramSection>
              ) : null}

              {program.benefits && program.benefits.length > 0 ? (
                <ProgramSection
                  title="Benefits"
                  first={
                    !hasRichText(program.whatIs) && !hasRichText(program.aboutThePractice)
                  }
                >
                  <ul className="space-y-3">
                    {program.benefits.map((item, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed text-[#3a322a]">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                        />
                        <span>{ensureTrailingPeriod(item)}</span>
                      </li>
                    ))}
                  </ul>
                </ProgramSection>
              ) : null}

              <ProgramSection
                title={getBeforeProgramTitle(program.slug)}
                first={
                  !hasRichText(program.whatIs) &&
                  !hasRichText(program.aboutThePractice) &&
                  !(program.benefits && program.benefits.length > 0)
                }
              >
                <div className="space-y-4 leading-relaxed text-[#3a322a]">
                  {getBeforeProgramNotes(program.slug).map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              </ProgramSection>

              <ProgramSection title={PROGRAM_AFTER_PROGRAM_TITLE}>
                <div className="space-y-4 leading-relaxed text-[#3a322a]">
                  {programAfterProgramText(program.title).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </ProgramSection>

              <div className="mt-12 border-t border-border pt-10">
                <div className="rounded-2xl border border-border bg-ivory p-6 shadow-soft sm:p-8">
                  <h2 className="font-heading text-2xl text-charcoal">{PROGRAM_MEDICAL_NOTICE_TITLE}</h2>
                  <p className="mt-4 leading-relaxed text-[#3a322a]">{PROGRAM_MEDICAL_NOTICE}</p>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="overflow-hidden rounded-xl border border-border bg-ivory shadow-soft">
                <div className={cn("relative", programSidebarImageAspectClass(program.slug))}>
                  <LocalProgramImage
                    slug={program.slug}
                    alt={program.title}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                {program.videoUrl && videoLink ? (
                  <ProgramWatchButton
                    href={program.videoUrl}
                    ariaLabel={`Watch: ${videoLink.title}`}
                  />
                ) : null}
                <div className="flex h-14 items-center justify-center border-b border-border px-6">
                  <p className="text-sm text-charcoal">
                    <span className="text-brown">Price:</span>{" "}
                    <span className="font-heading text-xl leading-none">{priceLabel}</span>
                  </p>
                </div>
                <div className="space-y-4 p-6">
                  {programSidebarCtaText(program.title).map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-brown">
                      {paragraph}
                    </p>
                  ))}

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
