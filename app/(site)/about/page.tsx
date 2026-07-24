import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AboutHighlightCards } from "@/components/content/AboutHighlightCards";
import { AboutSectionBlock } from "@/components/content/AboutSectionBlock";
import { PageHero } from "@/components/ui/PageHero";
import { ABOUT_PAGE_HERO_TITLE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
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
  const teacherStory = resolveTeacherStory(about.teacherStory);

  return (
    <>
      <PageHero
        eyebrow="About"
        title={<AboutPageHeroTitle title={about.title} />}
        description="Know more about the teacher, Isha Hatha Yoga teacher training, Isha Yoga Center, Isha Foundation, and Sadhguru."
      />

      <AboutHighlightCards teacherStory={teacherStory} />

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
