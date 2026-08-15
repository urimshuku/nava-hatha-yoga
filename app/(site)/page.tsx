import type { Metadata } from "next";

import { PrivateSessionsSection } from "@/components/content/PrivateSessionsSection";
import { EventCard } from "@/components/cards/EventCard";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { CMSRichText } from "@/components/content/CMSRichText";
import { YouTubeEmbed } from "@/components/content/YouTubeEmbed";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ContactSection } from "@/components/ui/ContactSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeroHighlights } from "@/components/ui/HeroHighlights";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getFeaturedPrograms,
  getHomePage,
  getPrograms,
  getSiteSettings,
  getUpcomingEvents,
} from "@/sanity/lib/fetch";
import { SITE_NAME, SPECIAL_PROGRAM_SLUGS } from "@/lib/constants";
import { placeholderHomePage } from "@/lib/placeholders";
import { buildMetadata } from "@/lib/seo";
import { PHASE1_HOME_SEO } from "@/lib/seo-phase1";
import { buildEventsJsonLd } from "@/lib/structured-data";
import { getYouTubeVideoId } from "@/lib/youtube";

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()]);
  const brandName = settings.brandName?.trim() || SITE_NAME;
  const cmsTitle = home.seo?.title?.trim() || settings.seo?.title?.trim();
  const absoluteTitle = cmsTitle
    ? cmsTitle.includes(brandName)
      ? cmsTitle
      : `${cmsTitle} · ${brandName}`
    : `${PHASE1_HOME_SEO.title} · ${brandName}`;

  const metadata = buildMetadata({
    title: PHASE1_HOME_SEO.title,
    description: PHASE1_HOME_SEO.description,
    seo: {
      title: home.seo?.title ?? settings.seo?.title,
      description: home.seo?.description ?? settings.seo?.description,
    },
    path: "/",
    siteName: brandName,
  });

  // Absolute title avoids OpenNext dropping an empty/undefined <title> and
  // matches the intended SERP/document title exactly.
  return {
    ...metadata,
    title: { absolute: absoluteTitle },
    openGraph: {
      ...metadata.openGraph,
      title: absoluteTitle,
    },
    twitter: {
      ...metadata.twitter,
      title: absoluteTitle,
    },
  };
}

const HERO_GLOW = {
  backgroundImage:
    "radial-gradient(60% 55% at 50% 0%, rgba(201,168,106,0.18) 0%, rgba(201,168,106,0) 70%)",
};

const DEFAULT_INTRO_HEADING = "What is Classical Hatha Yoga?";
const DEFAULT_INTRO_VIDEO_TITLE = "The Incredible Power of Classical Hatha Yoga";

export const revalidate = 60;

function IntroHeading({ heading }: { heading?: string }) {
  const text = heading ?? DEFAULT_INTRO_HEADING;
  const breakAt = text.indexOf("Hatha Yoga");

  if (breakAt > 0) {
    return (
      <>
        {text.slice(0, breakAt).trimEnd()}
        <br />
        {text.slice(breakAt)}
      </>
    );
  }

  return text;
}

export default async function HomePage() {
  const [home, settings, events, programs] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getUpcomingEvents(),
    getPrograms(),
  ]);

  const specialProgramSlugs = new Set<string>(SPECIAL_PROGRAM_SLUGS);
  const rawFeatured = home.featuredPrograms?.length
    ? home.featuredPrograms
    : await getFeaturedPrograms();
  const featured = rawFeatured.filter((program) => !specialProgramSlugs.has(program.slug));

  const hero = home.hero;
  const featuredSection =
    home.featuredProgramsSection ?? placeholderHomePage.featuredProgramsSection;
  const eventsSection =
    home.upcomingEventsSection ?? placeholderHomePage.upcomingEventsSection;
  const introVideoId = home.intro?.videoUrl
    ? getYouTubeVideoId(home.intro.videoUrl)
    : null;

  const contactHeading =
    home.finalCta?.heading?.trim() || placeholderHomePage.finalCta?.heading;
  const contactBody =
    home.finalCta?.body?.trim() || placeholderHomePage.finalCta?.body;

  return (
    <>
      <JsonLd data={buildEventsJsonLd(events.slice(0, 3), settings)} />
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-cream pb-24 pt-20 sm:pb-32 sm:pt-36 md:pb-section md:pt-44">
        <div
          className="pointer-events-none absolute inset-0"
          style={HERO_GLOW}
          aria-hidden="true"
        />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-[1.75rem] leading-[1.1] tracking-tight sm:text-display">
              {hero?.headline?.trim() ||
                placeholderHomePage.hero?.headline ||
                "Nava Classical Hatha Yoga"}
            </h1>
            {hero?.subtitle?.trim() || placeholderHomePage.hero?.subtitle?.trim() ? (
              <p className="mt-3 text-sm font-normal not-italic text-brown sm:mt-4 sm:text-xl">
                {hero?.subtitle?.trim() || placeholderHomePage.hero?.subtitle}
              </p>
            ) : null}
            {hero?.supportingText?.trim() ? (
              <p className="hero-subtitle mt-5 sm:mt-7">{hero.supportingText}</p>
            ) : (
              <p className="hero-subtitle mt-5 sm:mt-7">
                {placeholderHomePage.hero?.supportingText}
              </p>
            )}
            <div className="mt-6 flex justify-center sm:mt-10">
              <div className="grid w-max max-w-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                <Button
                  href={hero?.primaryCta?.href ?? "/events"}
                  size="lg"
                  className="w-full whitespace-nowrap px-5 sm:px-6"
                >
                  {hero?.primaryCta?.label ?? "View Upcoming Events"}
                </Button>
                <Button
                  href={hero?.secondaryCta?.href ?? "/programs"}
                  variant="secondary"
                  size="lg"
                  className="w-full whitespace-nowrap px-5 sm:px-6"
                >
                  {hero?.secondaryCta?.label ?? "Explore Programs"}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <Section tone="ivory" className="border-y border-border">
        <Container>
          <MotionReveal>
            <HeroHighlights
              items={home.highlights?.items}
              closingQuote={home.highlights?.closingQuote}
            />
          </MotionReveal>
        </Container>
      </Section>

      {/* 2. What is Classical Hatha Yoga? */}
      <Section
        id="what-is-classical-hatha-yoga"
        tone="cream"
        className="border-y border-border"
      >
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <MotionReveal>
              {home.intro?.eyebrow ? (
                <p className="eyebrow mb-4">{home.intro.eyebrow}</p>
              ) : null}
              <h2 className="text-display-sm leading-[1.05]">
                <IntroHeading heading={home.intro?.heading} />
              </h2>
            </MotionReveal>
            <MotionReveal delay={0.1} className="max-w-prose">
              <CMSRichText
                value={
                  home.intro?.body?.length
                    ? home.intro.body
                    : placeholderHomePage.intro?.body
                }
                className="sm:text-lg"
              />
            </MotionReveal>
          </div>
          {introVideoId ? (
            <MotionReveal delay={0.15} className="mt-8 sm:mt-12">
              <YouTubeEmbed
                videoId={introVideoId}
                title={
                  home.intro?.videoTitle?.trim() || DEFAULT_INTRO_VIDEO_TITLE
                }
                className="mx-auto max-w-3xl"
              />
            </MotionReveal>
          ) : null}
        </Container>
      </Section>

      {/* 3. Featured Programs */}
      <Section tone="cream">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow={featuredSection?.eyebrow ?? "Programs"}
              title={
                featuredSection?.title ??
                "Practices offered in their traditional form"
              }
              description={
                featuredSection?.description ??
                "Each program is a complete practice within the Classical Hatha Yoga system, taught as intended. Explore a practice and register your interest for upcoming sessions."
              }
            />
          </MotionReveal>
          <MotionStagger className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {featured.slice(0, 6).map((program) => (
              <MotionItem key={program._id} className="h-full">
                <ProgramCard program={program} />
              </MotionItem>
            ))}
          </MotionStagger>
          <div className="mt-6 sm:mt-10">
            <Button href="/programs" variant="secondary">
              {featuredSection?.ctaLabel ?? "View all programs"}
            </Button>
          </div>
        </Container>
      </Section>

      {/* 4. Upcoming Events */}
      <Section tone="ivory" className="border-t border-border">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow={eventsSection?.eyebrow ?? "Events"}
              title={eventsSection?.title ?? "Upcoming events"}
              description={
                eventsSection?.description ??
                "Classes are held in person in Saranda and Tirana, Albania."
              }
            />
          </MotionReveal>
          <div className="mt-8 sm:mt-12">
            {events.length > 0 ? (
              <>
                <MotionStagger className="mx-auto flex max-w-4xl flex-col gap-4 sm:gap-6">
                  {events.slice(0, 3).map((event) => (
                    <MotionItem key={event._id} className="h-full">
                      <EventCard
                        event={event}
                        whatsappNumber={settings.whatsapp}
                        experienceNote={settings.eventExperienceNote}
                      />
                    </MotionItem>
                  ))}
                </MotionStagger>
                <div className="mt-6 sm:mt-10">
                  <Button href="/events" variant="secondary">
                    {eventsSection?.ctaLabel ?? "See all upcoming events"}
                  </Button>
                </div>
              </>
            ) : (
              <EmptyState
                title={
                  eventsSection?.emptyTitle ?? "New events are being scheduled"
                }
                description={
                  eventsSection?.emptyDescription ??
                  "There are no events listed right now. Please check back soon or get in touch to register your interest."
                }
              >
                <Button href="/contact">Register your interest</Button>
              </EmptyState>
            )}
          </div>
        </Container>
      </Section>

      <PrivateSessionsSection
        heading={home.privateCorporate?.heading}
        lead={home.privateCorporate?.lead}
        offerings={home.privateCorporate?.offerings}
        cta={home.privateCorporate?.cta}
      />

      {/* 6. Contact */}
      <ContactSection
        programs={programs.map((program) => program.title)}
        email={settings.email}
        heading={contactHeading}
        description={
          contactBody ? (
            <>
              {contactBody}
              {settings.email ? (
                <>
                  {" "}
                  Or email us at{" "}
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-saffron underline underline-offset-2 hover:text-saffron-hover"
                  >
                    {settings.email}
                  </a>
                  .
                </>
              ) : null}
            </>
          ) : undefined
        }
      />
    </>
  );
}
