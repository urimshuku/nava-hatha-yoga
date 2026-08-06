import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { IconWhatsApp } from "@/components/ui/BrandIcons";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Ornament } from "@/components/ui/Ornament";
import { whatsappLink } from "@/lib/constants";

const WA_PREFILL =
  "Hello, I'd like to explore a Partner Program collaboration with NAVA.";

type PartnerProgramsSectionProps = {
  whatsappNumber?: string;
};

export function PartnerProgramsSection({
  whatsappNumber,
}: PartnerProgramsSectionProps) {
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WA_PREFILL)}`
    : whatsappLink(WA_PREFILL);

  return (
    <Section tone="sand" className="border-t border-border">
      <Container>
        <MotionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-sm text-balance">Partner Programs</h2>
          <Ornament className="mt-8" />

          <div className="mt-8 space-y-5 text-left leading-relaxed text-brown sm:mt-10 sm:space-y-6 sm:text-lg">
            <p>
              NAVA collaborates with hotels, guesthouses, retreat venues and other
              welcoming spaces to enrich the experience of their guests through
              Classical Hatha Yoga.
            </p>
            <p>
              These programs offer people an opportunity to pause, reconnect and
              experience greater balance during their stay. They may include an
              introductory session, a workshop or a series of practices shaped
              around the place, its atmosphere and the needs of the guests.
            </p>
            <p>
              Each collaboration is created with care, supporting rest, renewal and
              a deeper connection with oneself and the surrounding environment.
            </p>
          </div>

          <h3 className="mt-12 font-heading text-2xl text-charcoal text-balance sm:mt-14 sm:text-3xl">
            Two Ways to Collaborate
          </h3>

          <div className="mt-6 space-y-5 text-left leading-relaxed text-brown sm:mt-8 sm:space-y-6 sm:text-lg">
            <ul className="list-disc space-y-3 pl-5 marker:text-gold">
              <li>Partners can introduce their guests to existing NAVA programs.</li>
              <li>
                Partners can host a specially arranged yoga experience at their own
                venue.
              </li>
            </ul>
            <p>
              Each collaboration is thoughtfully planned to suit the setting and
              enrich the guests&apos; stay.
            </p>
            <p>
              Contact NAVA to explore which option would best suit your guests and
              your space.
            </p>
          </div>

          <div className="mt-8 flex justify-center sm:mt-10">
            <Button href={waHref} size="lg">
              <IconWhatsApp className="h-5 w-5 text-[#25D366]" />
              Message on WhatsApp
            </Button>
          </div>
        </MotionReveal>
      </Container>
    </Section>
  );
}
