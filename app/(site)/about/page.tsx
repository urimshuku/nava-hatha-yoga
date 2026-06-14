import type { Metadata } from "next";

import { CMSRichText } from "@/components/content/CMSRichText";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CTASection } from "@/components/ui/CTASection";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Ornament } from "@/components/ui/Ornament";
import { PageHero } from "@/components/ui/PageHero";
import { SanityImage } from "@/components/ui/SanityImage";
import { buildMetadata } from "@/lib/seo";
import { getAboutPage } from "@/sanity/lib/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  return buildMetadata({
    title: "About",
    description:
      "About Ananta Hatha Yoga — Classical Hatha Yoga taught in its original form in Saranda, Albania.",
    seo: about.seo,
    path: "/about",
  });
}

export default async function AboutPage() {
  const about = await getAboutPage();
  const hasIntro = Boolean(about.intro && about.intro.length > 0);
  const hasStory = Boolean(about.story && about.story.length > 0);
  const hasTraining = Boolean(about.training && about.training.length > 0);

  return (
    <>
      <PageHero
        eyebrow="About"
        title={about.title ?? "About Ananta Hatha Yoga"}
        description="A space dedicated to Classical Hatha Yoga, offered in its original form with care for the tradition and for those who come to practice."
      />

      {/* Intro + portrait */}
      <Section tone="cream">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <MotionReveal>
              {hasIntro ? (
                <div className="[&_p]:text-xl [&_p]:leading-relaxed [&_p]:text-charcoal">
                  <CMSRichText value={about.intro} />
                </div>
              ) : null}
            </MotionReveal>
            <MotionReveal delay={0.1}>
              <div className="overflow-hidden rounded-2xl border border-border bg-ivory shadow-soft">
                <div className="aspect-[4/5]">
                  <SanityImage
                    image={about.image}
                    alt={about.title ?? "Ananta Hatha Yoga"}
                    width={680}
                    height={850}
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </Section>

      {/* Story */}
      {hasStory ? (
        <Section tone="ivory" className="border-y border-border">
          <Container size="narrow">
            <MotionReveal className="text-center">
              <p className="eyebrow mb-4">Our story</p>
              <h2 className="text-display-sm text-balance">
                How Ananta Hatha Yoga came to be
              </h2>
              <Ornament className="mt-7" width="w-16" />
            </MotionReveal>
            <MotionReveal delay={0.1} className="mt-10 text-lg [&_p]:leading-relaxed">
              <CMSRichText value={about.story} />
            </MotionReveal>
          </Container>
        </Section>
      ) : null}

      {/* Training & certification */}
      {hasTraining ? (
        <Section tone="cream">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <MotionReveal>
                <p className="eyebrow mb-4">Training &amp; certification</p>
                <h2 className="text-display-sm text-balance">
                  Taught in the classical tradition
                </h2>
                <div className="mt-8 rounded-2xl border border-border-strong/60 bg-ivory p-6">
                  <p className="font-heading text-xl text-charcoal">In the Isha tradition</p>
                  <p className="mt-2 text-sm leading-relaxed text-brown">
                    Certified through Isha, founded by Sadhguru, to share these Classical
                    Hatha Yoga practices in their original form.
                  </p>
                </div>
              </MotionReveal>
              <MotionReveal delay={0.1} className="text-lg [&_p]:leading-relaxed">
                <CMSRichText value={about.training} />
              </MotionReveal>
            </div>
          </Container>
        </Section>
      ) : null}

      <CTASection
        heading="Come and practice"
        body="Classes are held in person in Saranda, Albania. Reach out to learn more or register your interest."
        ctaLabel="Get in Touch"
        ctaHref="/contact"
      />
    </>
  );
}
