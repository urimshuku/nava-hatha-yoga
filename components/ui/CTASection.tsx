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
          <p className="section-lead mx-auto mt-4 max-w-xl sm:mt-5">
            {body}
          </p>
          <div className="mt-6 flex justify-center sm:mt-8">
            <Button href={ctaHref} size="lg">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
