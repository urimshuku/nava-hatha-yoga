import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Thank You",
  description: "Thank you for getting in touch with Ananta Hatha Yoga.",
  path: "/thank-you",
  noIndex: true,
});

export default function ThankYouPage() {
  return (
    <Section tone="cream" className="pt-40">
      <Container size="narrow">
        <div className="text-center">
          <span className="font-heading text-5xl text-clay/80" aria-hidden="true">
            ॐ
          </span>
          <h1 className="mt-6 text-display text-balance">Thank you</h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-brown">
            Your message has been received. We will get back to you personally as soon as
            we can. In the meantime, feel free to explore the practices we offer.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/programs">Explore programs</Button>
            <Button href="/" variant="secondary">
              Back to home
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
