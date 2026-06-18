import { PrivateSessionsSection } from "@/components/content/PrivateSessionsSection";
import { EventCard } from "@/components/cards/EventCard";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { CMSRichText } from "@/components/content/CMSRichText";
import { YouTubeEmbed } from "@/components/content/YouTubeEmbed";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ContactSection } from "@/components/ui/ContactSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Ornament } from "@/components/ui/Ornament";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getFeaturedPrograms,
  getHomePage,
  getPrograms,
  getSiteSettings,
  getUpcomingEvents,
} from "@/sanity/lib/fetch";
import { SPECIAL_PROGRAM_SLUGS } from "@/lib/constants";
import { getYouTubeVideoId } from "@/lib/youtube";

const HERO_GLOW = {
  backgroundImage:
    "radial-gradient(60% 55% at 50% 0%, rgba(201,168,106,0.18) 0%, rgba(201,168,106,0) 70%)",
};

const DEFAULT_INTRO_HEADING = "What is Classical Hatha Yoga?";

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
  const introVideoId = home.intro?.videoUrl
    ? getYouTubeVideoId(home.intro.videoUrl)
    : null;

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-cream pb-12 pt-10 sm:pb-section sm:pt-20 md:pt-44">
        <div
          className="pointer-events-none absolute inset-0"
          style={HERO_GLOW}
          aria-hidden="true"
        />
        <Container className="relative">
          <MotionReveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-4 sm:mb-6">{settings.brandName}</p>
            <h1 className="text-display text-balance">
              {hero?.headline ?? "Classical Hatha Yoga"}
            </h1>
            {hero?.supportingText ? (
              <p className="hero-subtitle mt-5 sm:mt-7">{hero.supportingText}</p>
            ) : null}
            <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-10 sm:flex-row sm:gap-3">
              <Button href={hero?.primaryCta?.href ?? "/events"} size="lg">
                {hero?.primaryCta?.label ?? "View Upcoming Events"}
              </Button>
              <Button
                href={hero?.secondaryCta?.href ?? "/programs"}
                variant="secondary"
                size="lg"
              >
                {hero?.secondaryCta?.label ?? "Explore Programs"}
              </Button>
            </div>

            <Ornament className="mt-8 sm:mt-14" />
          </MotionReveal>
        </Container>
      </section>

      {/* 2. What is Classical Hatha Yoga? */}
      <Section tone="ivory" className="border-y border-border">
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
              <CMSRichText value={home.intro?.body} className="sm:text-lg" />
            </MotionReveal>
          </div>
          {introVideoId ? (
            <MotionReveal delay={0.15} className="mt-8 sm:mt-12">
              <YouTubeEmbed
                videoId={introVideoId}
                title={home.intro?.heading ?? DEFAULT_INTRO_HEADING}
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
              eyebrow="Programs"
              title="Practices offered in their traditional form"
              description="Each program is a complete practice within the Classical Hatha Yoga system."
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
              View all programs
            </Button>
          </div>
        </Container>
      </Section>

      {/* 4. Upcoming Events */}
      <Section tone="ivory" className="border-t border-border">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="Events"
              title="Upcoming events"
              description="All classes are currently held in person in Saranda, Albania."
            />
          </MotionReveal>
          <div className="mt-8 sm:mt-12">
            {events.length > 0 ? (
              <>
                <MotionStagger className="mx-auto flex max-w-4xl flex-col gap-4 sm:gap-6">
                  {events.slice(0, 3).map((event) => (
                    <MotionItem key={event._id} className="h-full">
                      <EventCard event={event} whatsappNumber={settings.whatsapp} />
                    </MotionItem>
                  ))}
                </MotionStagger>
                <div className="mt-6 sm:mt-10">
                  <Button href="/events" variant="secondary">
                    See all upcoming events
                  </Button>
                </div>
              </>
            ) : (
              <EmptyState
                title="New events are being scheduled"
                description="There are no events listed right now. Please check back soon or get in touch to register your interest."
              >
                <Button href="/contact">Register your interest</Button>
              </EmptyState>
            )}
          </div>
        </Container>
      </Section>

      <PrivateSessionsSection />

      {/* 6. Contact */}
      <ContactSection
        programs={programs.map((program) => program.title)}
        email={settings.email}
      />
    </>
  );
}
