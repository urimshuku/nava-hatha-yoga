import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AboutHighlightCards } from "@/components/content/AboutHighlightCards";
import { AboutSectionBlock } from "@/components/content/AboutSectionBlock";
import { CMSRichText } from "@/components/content/CMSRichText";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { ABOUT_PAGE_HERO_TITLE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { PHASE1_ABOUT_SEO } from "@/lib/seo-phase1";
import {
  DEFAULT_TEACHER_STORY,
  type ResolvedTeacherStory,
} from "@/lib/teacher-story";
import { getAboutPage } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import type { TeacherStory } from "@/sanity/lib/types";

function resolveTeacherStory(story?: TeacherStory): ResolvedTeacherStory {
  const photo = urlForImage(story?.photo);
  return {
    nameLine: story?.nameLine?.trim() || DEFAULT_TEACHER_STORY.nameLine,
    photoSrc: photo
      ? photo.width(512).height(640).url()
      : DEFAULT_TEACHER_STORY.photoSrc,
    photoAlt: story?.photo?.alt || DEFAULT_TEACHER_STORY.photoAlt,
    teaser: story?.teaser?.length ? story.teaser : DEFAULT_TEACHER_STORY.teaser,
    storyTitle: story?.storyTitle?.trim() || DEFAULT_TEACHER_STORY.storyTitle,
    story: story?.story?.length ? story.story : DEFAULT_TEACHER_STORY.story,
  };
}

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

function resolveAboutHeroDescription(cms?: string): string {
  const trimmed = cms?.trim();
  if (
    !trimmed ||
    (/based in Saranda/i.test(trimmed) && !/Tirana/i.test(trimmed))
  ) {
    return PHASE1_ABOUT_SEO.heroDescription;
  }
  return trimmed;
}

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  return buildMetadata({
    title: PHASE1_ABOUT_SEO.title,
    description: PHASE1_ABOUT_SEO.description,
    seo: about.seo,
    path: "/about",
  });
}

export default async function AboutPage() {
  const about = await getAboutPage();
  const sections = about.sections ?? [];
  const teacherStory = resolveTeacherStory(about.teacherStory);
  const heroDescription = resolveAboutHeroDescription(about.heroDescription);
  const hasIntro = Boolean(about.intro && about.intro.length > 0);

  return (
    <>
      <PageHero
        eyebrow="About"
        title={<AboutPageHeroTitle title={about.title} />}
        description={heroDescription}
      />

      {hasIntro ? (
        <Section tone="ivory" size="small" className="border-b border-border">
          <Container>
            <div className="mx-auto max-w-2xl">
              <CMSRichText value={about.intro} className="sm:text-lg" />
            </div>
          </Container>
        </Section>
      ) : null}

      <AboutHighlightCards
        teacherStory={teacherStory}
        cards={about.highlightCards}
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
        heading="Explore the practices"
        body="Discover Classical Hatha Yoga programs taught as intended, or register your interest for upcoming sessions in Albania."
        ctaLabel="View programs"
        ctaHref="/programs"
      />
    </>
  );
}
