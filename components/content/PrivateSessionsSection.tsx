import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";

const ONLINE_OFFERING = {
  title: "Online Session",
  body: "Live instruction from wherever you are. Classical Hatha Yoga practices can be offered online in a focused, one-on-one or small-group setting when in-person attendance is not possible.",
} as const;

const IN_PERSON_OFFERINGS = [
  {
    title: "One-on-One Session",
    body: "Highly personalized instruction tailored to your specific physical capabilities and wellbeing goals. Ideal for those seeking deeper refinement or specific health support.",
  },
  {
    title: "Small-Group Session",
    body: "Gather friends, family, or colleagues for a private session. A focused environment that balances personalized attention with shared experience.",
  },
] as const;

const SPECIAL_OFFERINGS = [
  {
    title: "Yoga for Children",
    body: "Age-appropriate Classical Hatha Yoga practices offered in a calm, supportive setting. Designed to support children's physical wellbeing, focus, and inner balance.",
  },
  {
    title: "Corporate Session",
    body: "Bring ancient tools for clarity and balance into the workplace. Designed to combat stress and foster a vibrant, focused professional environment.",
  },
] as const;

function OfferingGroup({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong/60 bg-cream/70 shadow-soft">
      {title ? (
        <div className="border-b border-border-strong/40 px-5 py-4 sm:px-8 sm:py-5">
          <h3 className="font-heading text-xl text-charcoal sm:text-2xl">{title}</h3>
        </div>
      ) : null}
      <div className="divide-y divide-border-strong/40">{children}</div>
    </div>
  );
}

function OfferingItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-5 py-5 sm:px-8 sm:py-7">
      <h4 className="font-heading text-xl text-charcoal sm:text-2xl">{title}</h4>
      <p className="mt-3 leading-relaxed text-brown sm:mt-4">{body}</p>
    </div>
  );
}

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
            <MotionItem>
              <OfferingGroup title="Online and In-Person Session">
                <OfferingItem
                  title={ONLINE_OFFERING.title}
                  body={ONLINE_OFFERING.body}
                />
                <OfferingItem
                  title={IN_PERSON_OFFERINGS[0].title}
                  body={IN_PERSON_OFFERINGS[0].body}
                />
                <OfferingItem
                  title={IN_PERSON_OFFERINGS[1].title}
                  body={IN_PERSON_OFFERINGS[1].body}
                />
              </OfferingGroup>
            </MotionItem>

            <MotionItem>
              <OfferingGroup title="Special Offerings">
                {SPECIAL_OFFERINGS.map((offering) => (
                  <OfferingItem
                    key={offering.title}
                    title={offering.title}
                    body={offering.body}
                  />
                ))}
              </OfferingGroup>
            </MotionItem>
          </MotionStagger>
        </div>
      </Container>
    </Section>
  );
}
