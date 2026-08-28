import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { IconWhatsApp } from "@/components/ui/BrandIcons";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Ornament } from "@/components/ui/Ornament";
import { whatsappLink } from "@/lib/constants";
import { placeholderRetreatsPage } from "@/lib/placeholders";
import type { RetreatsPage } from "@/lib/cms/content-types";

type PartnerProgramsSectionProps = {
  whatsappNumber?: string;
  content?: RetreatsPage["partnerPrograms"];
};

export function PartnerProgramsSection({
  whatsappNumber,
  content,
}: PartnerProgramsSectionProps) {
  const fallback = placeholderRetreatsPage.partnerPrograms;
  const heading = content?.heading?.trim() || fallback?.heading || "Partner Programs";
  const intro =
    content?.intro?.filter((p) => p.trim()).length
      ? content.intro.filter((p) => p.trim())
      : (fallback?.intro ?? []);
  const collaborateHeading =
    content?.collaborateHeading?.trim() ||
    fallback?.collaborateHeading ||
    "Two Ways to Collaborate";
  const collaborateItems =
    content?.collaborateItems?.filter((item) => item.trim()).length
      ? content.collaborateItems.filter((item) => item.trim())
      : (fallback?.collaborateItems ?? []);
  const closing =
    content?.closing?.filter((p) => p.trim()).length
      ? content.closing.filter((p) => p.trim())
      : (fallback?.closing ?? []);
  const prefill =
    content?.whatsappPrefill?.trim() ||
    fallback?.whatsappPrefill ||
    "Hello, I'd like to explore a Partner Program collaboration with NAVA.";

  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefill)}`
    : whatsappLink(prefill);

  return (
    <Section tone="sand" className="border-t border-border">
      <Container>
        <MotionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-sm text-balance">{heading}</h2>
          <Ornament className="mt-8" />

          <div className="mt-8 space-y-5 text-left leading-relaxed text-brown sm:mt-10 sm:space-y-6 sm:text-lg">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h3 className="mt-12 font-heading text-2xl text-charcoal text-balance sm:mt-14 sm:text-3xl">
            {collaborateHeading}
          </h3>

          <div className="mt-6 space-y-5 text-left leading-relaxed text-brown sm:mt-8 sm:space-y-6 sm:text-lg">
            {collaborateItems.length > 0 ? (
              <ul className="list-disc space-y-3 pl-5 marker:text-gold">
                {collaborateItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {closing.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
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
