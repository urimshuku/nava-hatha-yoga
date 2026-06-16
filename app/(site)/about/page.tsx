import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AboutHighlightCards } from "@/components/content/AboutHighlightCards";
import { AboutSectionBlock } from "@/components/content/AboutSectionBlock";
import { PageHero } from "@/components/ui/PageHero";
import { ABOUT_PAGE_HERO_TITLE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getAboutPage } from "@/sanity/lib/fetch";

function AboutPageHeroTitle({ title }: { title?: string }): ReactNode {
  const normalized = title?.trim();
  const text =
    !normalized ||
    normalized === "About Nava Hatha Yoga" ||
    normalized === "Classical Hatha Yoga, taught with care and precision."
      ? ABOUT_PAGE_HERO_TITLE
      : normalized;

  if (text.startsWith("Classical Hatha Yoga,")) {
    const rest = text.slice("Classical Hatha Yoga,".length).trim();
    return (
      <>
        Classical Hatha Yoga,
        <br />
        {rest}
      </>
    );
  }

  return text;
}

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  return buildMetadata({
    title: "About",
    description:
      "About Nava Hatha Yoga — Classical Hatha Yoga taught in its original form in Saranda, Albania.",
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
        title={<AboutPageHeroTitle title={about.title} />}
        description="Know more about the teacher, Isha Hatha Yoga teacher training, Isha Yoga Center, Isha Foundation, and Sadhguru."
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
    </>
  );
}
