import type { Metadata } from "next";

import { AboutHighlightCards } from "@/components/content/AboutHighlightCards";
import { AboutSectionBlock } from "@/components/content/AboutSectionBlock";
import { CTASection } from "@/components/ui/CTASection";
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
  const sections = about.sections ?? [];

  return (
    <>
      <PageHero
        eyebrow="About"
        title={about.title ?? "About Ananta Hatha Yoga"}
        description="A space dedicated to Classical Hatha Yoga, offered in its original form with care for the tradition and for those who come to practice."
      />

      <AboutHighlightCards
        teacherBody={
          <div className="space-y-6 font-heading">
            <div className="space-y-4 italic">
              <p>My name is Linda.</p>
              <p>
                What began as a personal journey, over 10 years of lived experience and teaching
                at Isha Yoga Center in India, has naturally become a longing to share across the
                world Classical Hatha Yoga in its purest form.
              </p>
            </div>
          </div>
        }
      />

      {sections.map((section, index) => (
        <AboutSectionBlock
          key={`${section.title ?? "section"}-${index}`}
          title={section.title ?? "Untitled section"}
          body={section.body}
          image={section.image}
          cta={section.cta}
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
