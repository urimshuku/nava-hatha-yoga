import { TeacherStoryTeaser } from "@/components/content/TeacherStoryTeaser";
import { InfiniteCardCarousel } from "@/components/content/InfiniteCardCarousel";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { placeholderAboutPage } from "@/lib/placeholders";
import type { ResolvedTeacherStory } from "@/lib/teacher-story";
import type { AboutHighlightCard } from "@/sanity/lib/types";

const DEFAULT_RIBBON_TITLES = [
  "1750+ hours of teacher training (Sadhguru Gurukulam India)",
  "10 years of living/volunteering/teaching in the ashram",
  "6000+ participants supported",
];

function ribbonTitlesFrom(cards?: AboutHighlightCard[]) {
  const fromCms = cards
    ?.map((card) => card.title?.trim())
    .filter((title): title is string => Boolean(title));
  if (fromCms && fromCms.length >= 3) return fromCms;

  const fromPlaceholders = placeholderAboutPage.highlightCards
    ?.map((card) => card.title?.trim())
    .filter((title): title is string => Boolean(title));

  return fromPlaceholders?.length
    ? fromPlaceholders
    : DEFAULT_RIBBON_TITLES;
}

type AboutHighlightCardsProps = {
  teacherStory?: ResolvedTeacherStory;
  cards?: AboutHighlightCard[];
  heading?: string;
};

export function AboutHighlightCards({
  teacherStory,
  cards,
  heading,
}: AboutHighlightCardsProps) {
  const titles = ribbonTitlesFrom(cards);

  return (
    <Section tone="cream" size="small" className="border-b border-border">
      <Container>
        <MotionReveal className="text-center">
          <h2 className="text-display-sm text-balance">
            {heading?.trim() || "About the Teacher"}
          </h2>
          <TeacherStoryTeaser story={teacherStory} />
        </MotionReveal>
      </Container>

      <InfiniteCardCarousel
        className="mt-10"
        label="Teacher training and experience"
        items={titles}
      />
    </Section>
  );
}
