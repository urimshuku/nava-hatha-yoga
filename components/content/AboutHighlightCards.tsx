import type { ReactNode } from "react";

import { FooterCertificationLogo } from "@/components/layout/FooterCertificationLogo";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { cn } from "@/lib/utils";

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
        "rounded-2xl border border-border bg-ivory px-6 py-7 font-heading not-italic shadow-soft sm:px-7 sm:py-8",
        className,
      )}
    >
      {children}
    </article>
  );
}

type AboutHighlightCardsProps = {
  teacherBody?: ReactNode;
};

export function AboutHighlightCards({ teacherBody }: AboutHighlightCardsProps) {
  return (
    <Section tone="cream" size="small" className="border-b border-border">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <MotionReveal>
            <h2 className="text-display-sm text-balance">About the Teacher</h2>
            <div className="mt-8 min-h-[6rem] text-lg leading-relaxed text-brown">
              {teacherBody}
            </div>
          </MotionReveal>

          <MotionStagger className="flex flex-col gap-3">
            <MotionItem>
              <HighlightCard>
                <p className="eyebrow">Teacher training</p>
                <p className="mt-2 text-lg text-charcoal sm:text-xl">
                  21 weeks teacher training
                </p>
                <p className="mt-2 font-heading text-3xl leading-none text-charcoal sm:text-4xl">
                  1750+ hrs
                </p>
                <p className="mt-4 text-base leading-relaxed text-brown sm:text-[1.05rem]">
                  Undergone more than 1750 hours of intense, rigorously structured, classical
                  Hatha Yoga teacher training, and is equipped to guide participants safely
                  and precisely, adapting each practice to individual needs.
                </p>
              </HighlightCard>
            </MotionItem>

            <MotionItem>
              <HighlightCard>
                <p className="eyebrow">Certification</p>
                <p className="mt-2 text-lg text-charcoal sm:text-xl">
                  Certified by Sadhguru Gurukulam
                </p>

                <div className="mt-6">
                  <FooterCertificationLogo className="max-w-[170px]" />
                </div>

                <p className="mt-6 text-base leading-relaxed text-brown sm:text-[1.05rem]">
                  Drawing from this age-old tradition, Sadhguru Gurukulam is an initiative that
                  is firmly rooted in timeless Yogic wisdom. Designed by Sadhguru, each program
                  is delivered with the same precision and devotion that this tradition has
                  preserved for millennia.
                </p>
              </HighlightCard>
            </MotionItem>
          </MotionStagger>
        </div>
      </Container>
    </Section>
  );
}
