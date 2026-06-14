import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

interface CTASectionProps {
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function CTASection({
  heading = "Begin your practice",
  body = "Reach out to learn more, register your interest, or ask any questions.",
  ctaLabel = "Get in Touch",
  ctaHref = "/contact",
}: CTASectionProps) {
  return (
    <section className="bg-sand py-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-sm text-balance">{heading}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brown">
            {body}
          </p>
          <div className="mt-8 flex justify-center">
            <Button href={ctaHref} size="lg">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
