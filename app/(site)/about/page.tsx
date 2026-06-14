import type { Metadata } from "next";

import { AboutSectionBlock } from "@/components/content/AboutSectionBlock";
import { CMSRichText } from "@/components/content/CMSRichText";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CTASection } from "@/components/ui/CTASection";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { PageHero } from "@/components/ui/PageHero";
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
  const sections = about.sections ?? [];

  return (
    <>
      <PageHero
        eyebrow="About"
        title={about.title ?? "About Ananta Hatha Yoga"}
        description="A space dedicated to Classical Hatha Yoga, offered in its original form with care for the tradition and for those who come to practice."
      />

      {hasIntro ? (
        <Section tone="cream">
          <Container size="narrow">
            <MotionReveal className="text-center text-lg [&_p]:leading-relaxed [&_p]:text-charcoal/90">
              <CMSRichText value={about.intro} />
            </MotionReveal>
          </Container>
        </Section>
      ) : null}

      {sections.map((section, index) => (
        <AboutSectionBlock
          key={`${section.title ?? "section"}-${index}`}
          title={section.title ?? "Untitled section"}
          body={section.body}
          image={section.image}
          index={index}
          tone={index % 2 === 0 ? "cream" : "ivory"}
        />
      ))}

      <CTASection
        heading="Come and practice"
        body="Classes are held in person in Saranda, Albania. Reach out to learn more or register your interest."
        ctaLabel="Get in Touch"
        ctaHref="/contact"
      />
    </>
  );
}
