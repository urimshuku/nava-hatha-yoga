import type { Metadata } from "next";

import { ProgramCard } from "@/components/cards/ProgramCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/ui/CTASection";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getPrograms } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildMetadata({
  title: "Programs",
  description:
    "Explore the Classical Hatha Yoga programs offered at Ananta Hatha Yoga, each taught in its original, traditional form.",
  path: "/programs",
});

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Classical Hatha Yoga practices"
        description="Each program below is a complete practice within the Classical Hatha Yoga system, taught with care for correct technique and the right understanding."
      />

      <Section tone="cream">
        <Container>
          <MotionStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <MotionItem key={program._id} className="h-full">
                <ProgramCard program={program} />
              </MotionItem>
            ))}
          </MotionStagger>
        </Container>
      </Section>

      {/* Private & corporate sessions */}
      <Section tone="sand" size="small">
        <Container>
          <MotionReveal className="mx-auto max-w-2xl rounded-2xl border border-border-strong/60 bg-cream/60 px-8 py-12 text-center sm:px-12">
            <p className="eyebrow mb-4">Tailored Sessions</p>
            <h2 className="text-display-sm">Private &amp; Corporate Sessions</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brown">
              Private and corporate sessions are available upon request. Depending on the
              needs of the individual, group, or organization, selected Classical Hatha
              Yoga practices can be offered in a focused setting.
            </p>
            <div className="mt-7">
              <Button href="/contact" variant="secondary">
                Enquire about private sessions
              </Button>
            </div>
          </MotionReveal>
        </Container>
      </Section>

      <CTASection
        heading="Not sure where to begin?"
        body="Reach out and we'll help you understand which practice may suit you, and when the next sessions are held."
        ctaLabel="Contact us"
        ctaHref="/contact"
      />
    </>
  );
}
