import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";

const PRIVATE_OFFERINGS = [
  {
    title: "One-on-One Session",
    body: "Highly personalized instruction tailored to your specific physical capabilities and wellbeing goals. Ideal for those seeking deeper refinement or specific health support.",
  },
  {
    title: "Small-Group Session",
    body: "Gather friends, family, or colleagues for a private session. A focused environment that balances personalized attention with shared experience.",
  },
  {
    title: "Corporate Session",
    body: "Bring ancient tools for clarity and balance into the workplace. Designed to combat stress and foster a vibrant, focused professional environment.",
  },
] as const;

export function PrivateSessionsSection() {
  return (
    <Section tone="sand" size="small">
      <Container>
        <div className="grid items-center gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <MotionReveal>
            <h2 className="text-display-sm text-balance">Private Sessions</h2>
            <p className="section-lead mt-4 max-w-md sm:mt-6">
              Private sessions are available upon request. Depending on the needs of the
              individual, group, or organization, selected Classical Hatha Yoga practices can be
              offered in a focused setting.
            </p>
            <div className="mt-5 sm:mt-8">
              <Button href="/contact" variant="secondary">
                Request a private session
              </Button>
            </div>
          </MotionReveal>

          <MotionStagger className="grid gap-3 sm:gap-5">
            {PRIVATE_OFFERINGS.map((offering) => (
              <MotionItem key={offering.title}>
                <article className="rounded-2xl border border-border-strong/60 bg-cream/70 px-5 py-5 shadow-soft sm:px-8 sm:py-7">
                  <h3 className="font-heading text-xl text-charcoal sm:text-2xl">
                    {offering.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-brown sm:mt-4">{offering.body}</p>
                </article>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </Container>
    </Section>
  );
}
