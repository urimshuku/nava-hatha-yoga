import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";

import { EventCard } from "@/components/cards/EventCard";
import { ProgramWatchButton } from "@/components/content/ProgramYouTubeSection";
import { CMSRichText } from "@/components/content/CMSRichText";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { LocalProgramSymbol } from "@/components/ui/LocalProgramSymbol";
import { ProgramImage } from "@/components/ui/ProgramImage";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildEventsJsonLd,
} from "@/lib/structured-data";
import { ensureTrailingPeriod } from "@/lib/utils";
import { programImageSrc } from "@/lib/local-images";
import { urlForImage } from "@/sanity/lib/image";
import {
  PROGRAM_AFTER_PROGRAM_TITLE,
  PROGRAM_BONUS_ITEMS,
  PROGRAM_BONUS_TITLE,
  PROGRAM_DISCOUNT_NOTE,
  PROGRAM_MEDICAL_NOTICE,
  PROGRAM_MEDICAL_NOTICE_TITLE,
  getBeforeProgramNotes,
  getBeforeProgramTitle,
  getProgramIntensity,
  getProgramPriceLabel,
  getProgramVideoLink,
  getProgramVideoUrl,
  programWhatIsSectionTitle,
  programAfterProgramText,
  programSidebarCtaText,
  SHOW_PROGRAM_SIDEBAR_PRICE,
} from "@/lib/constants";
import {
  getProgramBySlug,
  getProgramSlugs,
  getSiteSettings,
  getUpcomingEventsByProgram,
} from "@/sanity/lib/fetch";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

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
      <div className="prose-body mt-4 text-[#3a322a] sm:mt-5">{children}</div>
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

  const sanityOg = urlForImage(program.image)?.width(1200).height(630).fit("crop").url();
  const localOg = programImageSrc(program.slug);

  return buildMetadata({
    title: program.title,
    description: program.shortIntro,
    seo: program.seo,
    path: `/programs/${program.slug}`,
    image: sanityOg
      ? { url: sanityOg, width: 1200, height: 630, alt: program.title }
      : localOg
        ? { url: localOg, width: 1200, height: 630, alt: program.title }
        : undefined,
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

  const videoUrl = getProgramVideoUrl(program.slug, program.videoUrl);
  const videoTitle =
    program.videoTitle?.trim() ||
    (videoUrl ? getProgramVideoLink(program.slug, program.title).title : null);
  const priceLabel = SHOW_PROGRAM_SIDEBAR_PRICE
    ? getProgramPriceLabel(program.slug, program.priceLabel)
    : null;

  const beforeProgramTitle =
    program.beforeProgramTitle?.trim() || getBeforeProgramTitle(program.slug);
  const beforeProgramNotes =
    program.beforeProgramNotes?.length
      ? program.beforeProgramNotes
      : settings.beforeProgramNotes?.length
        ? settings.beforeProgramNotes
        : getBeforeProgramNotes(program.slug);
  const medicalNoticeTitle =
    settings.medicalNoticeTitle?.trim() || PROGRAM_MEDICAL_NOTICE_TITLE;
  const medicalNotice = settings.medicalNotice?.trim() || PROGRAM_MEDICAL_NOTICE;
  const bonusTitle = settings.bonusTitle?.trim() || PROGRAM_BONUS_TITLE;
  const bonusItems =
    settings.bonusItems?.filter((item) => item.trim()).length
      ? settings.bonusItems.filter((item) => item.trim())
      : [...PROGRAM_BONUS_ITEMS];
  const discountNote = settings.discountNote?.trim() || PROGRAM_DISCOUNT_NOTE;
  const intensity =
    program.intensity ?? getProgramIntensity(program.slug);
  const hasAfterProgram = hasRichText(program.practiceIndependently);
  const hasSidebarSessions = hasRichText(program.privateAndGroupSessions);

  return (
    <>
      <JsonLd
        data={[
          buildCourseJsonLd(program, settings),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Programs", path: "/programs" },
            { name: program.title, path: `/programs/${program.slug}` },
          ]),
          ...buildEventsJsonLd(relatedEvents.slice(0, 3), settings),
        ]}
      />
      <section className="border-b border-border bg-ivory pb-10 pt-10 sm:pb-section-sm sm:pt-16 md:pt-40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Link
              href="/programs"
              className="mb-4 inline-flex text-sm font-medium text-brown transition-colors hover:text-saffron sm:mb-6"
            >
              &larr; All programs
            </Link>
            <LocalProgramSymbol slug={program.slug} />
            <h1 className="text-display text-balance">{program.title}</h1>
            {program.shortIntro ? (
              <p className="hero-subtitle mt-4 sm:mt-6">{program.shortIntro}</p>
            ) : null}
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div className="order-2 lg:order-1">
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
                title={beforeProgramTitle}
                first={
                  !hasRichText(program.whatIs) &&
                  !hasRichText(program.aboutThePractice) &&
                  !(program.benefits && program.benefits.length > 0)
                }
              >
                <div className="space-y-4 leading-relaxed text-[#3a322a]">
                  {beforeProgramNotes.map((note) => {
                    const isExperienceNote =
                      note === "This practice does not require prior yoga experience.";
                    return (
                      <p key={note}>
                        {isExperienceNote ? (
                          <mark className="rounded-sm bg-[#FBF6F0] px-1 py-0.5 text-inherit underline">
                            {note}
                          </mark>
                        ) : (
                          note
                        )}
                      </p>
                    );
                  })}
                </div>
              </ProgramSection>

              <ProgramSection title={PROGRAM_AFTER_PROGRAM_TITLE}>
                {hasAfterProgram ? (
                  <CMSRichText value={program.practiceIndependently} />
                ) : (
                  <div className="space-y-4 leading-relaxed text-[#3a322a]">
                    {programAfterProgramText(program.title).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </ProgramSection>

              <div className="mt-12 space-y-6 border-t border-border pt-10">
                <div className="rounded-2xl border border-border bg-ivory p-6 shadow-soft sm:p-8">
                  <h2 className="font-heading text-2xl text-charcoal">
                    {bonusTitle}
                  </h2>
                  <ul className="prose-body mt-4 list-disc space-y-2 pl-5 text-[#3a322a]">
                    {bonusItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="prose-body mt-4 text-[#3a322a]">{discountNote}</p>
                </div>
                <div className="rounded-2xl border border-border bg-[#F4F8F3] p-6 shadow-soft sm:p-8">
                  <h2 className="font-heading text-2xl text-charcoal">
                    {medicalNoticeTitle}
                  </h2>
                  <p className="prose-body mt-4 text-[#3a322a]">{medicalNotice}</p>
                </div>
              </div>
            </div>

            <aside className="order-1 lg:sticky lg:top-28 lg:order-2 lg:self-start">
              <div className="overflow-hidden rounded-xl border border-border bg-ivory shadow-soft">
                <div className="overflow-hidden">
                  <ProgramImage
                    slug={program.slug}
                    image={program.image}
                    alt={program.title}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="h-auto w-full"
                  />
                </div>
                {videoUrl && videoTitle ? (
                  <ProgramWatchButton
                    href={videoUrl}
                    ariaLabel={`Watch: ${videoTitle}`}
                  />
                ) : null}
                {intensity ? (
                  <div className="flex h-14 items-center justify-center border-b border-border px-6">
                    <p className="text-center text-sm text-charcoal">
                      <span className="text-brown">Intensity:</span>{" "}
                      <span className="font-medium">{intensity}</span>
                    </p>
                  </div>
                ) : null}
                {SHOW_PROGRAM_SIDEBAR_PRICE && priceLabel ? (
                <div className="flex h-14 items-center justify-center border-b border-border px-6">
                  <p className="text-sm text-charcoal">
                    <span className="text-brown">Price:</span>{" "}
                    <span className="font-heading text-xl leading-none">{priceLabel}</span>
                  </p>
                </div>
                ) : null}
                <div className="space-y-4 p-6">
                  {hasSidebarSessions ? (
                    <CMSRichText
                      value={program.privateAndGroupSessions}
                      className="text-sm leading-relaxed text-brown"
                    />
                  ) : (
                    programSidebarCtaText(program.title).map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-relaxed text-brown">
                        {paragraph}
                      </p>
                    ))
                  )}

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
            </div>
            <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-6">
              {relatedEvents.slice(0, 3).map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  whatsappNumber={settings.whatsapp}
                  experienceNote={settings.eventExperienceNote}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
