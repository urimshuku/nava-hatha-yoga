import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function IconSun() {
  return (
    <svg {...iconProps} className="h-7 w-7">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4" />
    </svg>
  );
}

function IconGift() {
  return (
    <svg {...iconProps} className="h-7 w-7">
      <rect x="4" y="10" width="16" height="10" rx="1.2" />
      <path d="M4 14h16M12 10v10" />
      <path d="M12 10c-1.8-2.8-4.5-3.2-5.5-1.8S7.5 11.5 12 10Z" />
      <path d="M12 10c1.8-2.8 4.5-3.2 5.5-1.8S16.5 11.5 12 10Z" />
    </svg>
  );
}

const FREE_OFFERINGS: {
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    title: "Learn About Classical Hatha Yoga",
    description:
      "Discover what Classical Hatha Yoga is, how it works with the body and energy system, and why it is offered in its traditional form.",
    icon: <IconSun />,
  },
  {
    title: "Online Resources",
    description:
      "Explore free resources to deepen your understanding of the practices and the wider Classical Hatha Yoga tradition.",
    icon: <IconGift />,
  },
];

function FreeOfferingCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center overflow-hidden rounded-xl border border-border bg-ivory px-5 py-7 text-center shadow-soft sm:px-6 sm:py-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-cream/80 text-saffron">
        {icon}
      </span>
      <h3 className="mt-5 font-heading text-xl text-charcoal sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brown sm:mt-3">
        {description}
      </p>
    </div>
  );
}

export function FreeOfferingsSection() {
  return (
    <Section tone="cream" size="small">
      <Container>
        <MotionReveal className="mb-8 text-center sm:mb-10">
          <p className="eyebrow mb-3">Free offerings</p>
          <p className="section-lead mx-auto max-w-xl">
            Open resources to begin exploring Classical Hatha Yoga.
          </p>
        </MotionReveal>
        <MotionStagger className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {FREE_OFFERINGS.map((offering) => (
            <MotionItem key={offering.title}>
              <FreeOfferingCard {...offering} />
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </Section>
  );
}
