import type { Metadata } from "next";

import { RetreatCard } from "@/components/cards/RetreatCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/ui/CTASection";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Ornament } from "@/components/ui/Ornament";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getRetreats } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildMetadata({
  title: "Retreats",
  description:
    "Immersive Classical Hatha Yoga retreats from Nava Hatha Yoga — coming soon.",
  path: "/retreats",
});

const EXPECTATIONS = [
  {
    title: "Immersive practice",
    body: "Extended, unhurried time with the practices, away from the demands of everyday life.",
  },
  {
    title: "Calm surroundings",
    body: "A quiet, supportive setting designed to help the body and mind settle.",
  },
  {
    title: "Guided learning",
    body: "Careful, attentive guidance in the Classical Hatha Yoga practices, in their original form.",
  },
];

export default async function RetreatsPage() {
  const retreats = await getRetreats();
  const hasRetreats = retreats.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Retreats"
        title="Immersive retreats"
        description="Immersive weekends in quiet settings — devoted to Classical Hatha Yoga, sattvic meals and time in nature."
      />

      {hasRetreats ? (
        <>
          <Section tone="cream">
            <Container>
              <MotionStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {retreats.map((retreat) => (
                  <MotionItem key={retreat._id} className="h-full">
                    <RetreatCard retreat={retreat} />
                  </MotionItem>
                ))}
              </MotionStagger>
            </Container>
          </Section>
          <CTASection
            heading="Questions about a retreat?"
            body="Reach out and we'll be glad to share more details and help you decide if it's right for you."
            ctaLabel="Contact us"
            ctaHref="/contact"
          />
        </>
      ) : (
        <>
          {/* Premium "Coming Soon" state */}
          <Section tone="cream">
            <Container>
              <MotionReveal className="mx-auto max-w-2xl rounded-2xl border border-border bg-ivory px-8 py-16 text-center shadow-soft sm:py-20">
                <Ornament className="mx-auto" width="w-64" />
                <p className="eyebrow mt-6">Coming Soon</p>
                <h2 className="mt-4 text-display-sm text-balance">
                  Retreats are on their way
                </h2>
                <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-brown">
                  We are carefully preparing immersive Classical Hatha Yoga retreats. If you
                  would like to be among the first to hear when dates are announced, please
                  register your interest.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button href="/contact">Register your interest</Button>
                  <Button href="/programs" variant="secondary">
                    Explore programs
                  </Button>
                </div>
              </MotionReveal>
            </Container>
          </Section>

          {/* What to expect — keeps the page considered, not empty */}
          <Section tone="ivory" className="border-t border-border">
            <Container>
              <MotionReveal className="text-center">
                <p className="eyebrow mb-4">What to expect</p>
                <h2 className="text-display-sm text-balance">
                  An invitation to go deeper
                </h2>
                <Ornament className="mt-8" width="w-80" />
              </MotionReveal>
              <MotionStagger className="mt-12 grid gap-6 md:grid-cols-3">
                {EXPECTATIONS.map((item) => (
                  <MotionItem key={item.title} className="h-full">
                    <div className="h-full rounded-xl border border-border bg-cream p-8 text-center">
                      <h3 className="font-heading text-2xl text-charcoal">
                        {item.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-brown">{item.body}</p>
                    </div>
                  </MotionItem>
                ))}
              </MotionStagger>
            </Container>
          </Section>
        </>
      )}
    </>
  );
}
