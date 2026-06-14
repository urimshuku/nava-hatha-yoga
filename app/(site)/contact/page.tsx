import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { whatsappLink } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getPrograms, getSiteSettings } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Ananta Hatha Yoga in Saranda, Albania. Classes are in-person and registration is handled personally.",
  path: "/contact",
});

export default async function ContactPage() {
  const [settings, programs] = await Promise.all([
    getSiteSettings(),
    getPrograms(),
  ]);

  const waMessage = "Hello, I'd like to know more about your classes.";
  const waHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(waMessage)}`
    : whatsappLink(waMessage);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Classes are held in person in Saranda, Albania, and registration is handled personally. Send a message and we'll get back to you."
      />

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div className="rounded-2xl border border-border bg-ivory p-6 shadow-soft sm:p-8">
              <h2 className="mb-6 font-heading text-2xl text-charcoal">
                Send a message
              </h2>
              <ContactForm programs={programs.map((p) => p.title)} />
            </div>

            <aside className="space-y-8">
              <div>
                <h2 className="eyebrow mb-4">Contact details</h2>
                <ul className="space-y-3 text-charcoal/90">
                  {settings.location ? <li>{settings.location}</li> : null}
                  {settings.email ? (
                    <li>
                      <a
                        href={`mailto:${settings.email}`}
                        className="hover:text-saffron"
                      >
                        {settings.email}
                      </a>
                    </li>
                  ) : null}
                  {settings.phone ? (
                    <li>
                      <a
                        href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                        className="hover:text-saffron"
                      >
                        {settings.phone}
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>

              <div>
                <h2 className="eyebrow mb-4">Quick message</h2>
                <p className="mb-4 text-sm leading-relaxed text-brown">
                  Prefer WhatsApp? Reach out directly and we&apos;ll reply as soon as we
                  can.
                </p>
                <Button href={waHref} variant="secondary">
                  Message on WhatsApp
                </Button>
              </div>

              <div className="rounded-xl border border-border bg-sand/50 p-5 text-sm leading-relaxed text-brown">
                Please note: there are no online payments. Registration and payment are
                handled manually or in person.
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
