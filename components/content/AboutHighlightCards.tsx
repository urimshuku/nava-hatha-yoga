import type { ReactNode } from "react";

import { FooterCertificationLogo } from "@/components/layout/FooterCertificationLogo";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TeacherStoryTeaser } from "@/components/content/TeacherStoryTeaser";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { placeholderAboutPage } from "@/lib/placeholders";
import type { ResolvedTeacherStory } from "@/lib/teacher-story";
import { cn } from "@/lib/utils";
import type { AboutHighlightCard } from "@/sanity/lib/types";

function HighlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "h-full rounded-2xl border border-border bg-ivory px-6 py-7 font-heading not-italic shadow-soft sm:px-7 sm:py-8",
        className,
      )}
    >
      {children}
    </article>
  );
}

type AboutHighlightCardsProps = {
  teacherStory?: ResolvedTeacherStory;
  cards?: AboutHighlightCard[];
};

export function AboutHighlightCards({
  teacherStory,
  cards,
}: AboutHighlightCardsProps) {
  const resolved =
    cards?.filter((card) => card.title?.trim() || card.body?.trim()).length
      ? cards.filter((card) => card.title?.trim() || card.body?.trim())
      : (placeholderAboutPage.highlightCards ?? []);

  return (
    <Section tone="cream" size="small" className="border-b border-border">
      <Container>
        <MotionReveal className="text-center">
          <h2 className="text-display-sm text-balance">About the Teacher</h2>
          <TeacherStoryTeaser story={teacherStory} />
        </MotionReveal>

        <MotionStagger className="mt-10 grid gap-3 sm:grid-cols-2">
          {resolved.map((card) => (
            <MotionItem key={`${card.eyebrow}-${card.title}`} className="h-full">
              <HighlightCard>
                {card.eyebrow ? <p className="eyebrow">{card.eyebrow}</p> : null}
                {card.title ? (
                  <p className="mt-2 text-lg text-charcoal sm:text-xl">{card.title}</p>
                ) : null}
                {card.stat ? (
                  <p className="mt-2 font-heading text-3xl leading-none text-charcoal sm:text-4xl">
                    {card.stat}
                  </p>
                ) : null}
                {card.showCertificationLogo ? (
                  <div className="mt-6">
                    <FooterCertificationLogo className="max-w-[170px]" />
                  </div>
                ) : null}
                {card.body ? (
                  <p
                    className={cn(
                      "text-base leading-relaxed text-brown sm:text-[1.05rem]",
                      card.showCertificationLogo || card.stat ? "mt-6" : "mt-4",
                      card.stat && !card.showCertificationLogo ? "mt-4" : undefined,
                    )}
                  >
                    {card.body}
                  </p>
                ) : null}
              </HighlightCard>
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </Section>
  );
}
