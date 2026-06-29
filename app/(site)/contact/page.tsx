import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/ui/PageHero";
import { SocialIconLinks } from "@/components/ui/SocialIconLinks";
import { instagramLink, whatsappLink } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getPrograms, getSiteSettings } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Nava Hatha Yoga in Saranda, Albania. Classes are in-person and registration is handled personally.",
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
        description="For questions regarding upcoming programs, private instruction, or general inquiries, please leave a message below."
      />

      <Section tone="cream">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div className="rounded-2xl border border-border bg-ivory p-3 shadow-soft sm:p-8">
              <h2 className="mb-3 font-heading text-lg text-charcoal sm:mb-6 sm:text-2xl">
                Send a message
              </h2>
              <ContactForm programs={programs.map((p) => p.title)} />
            </div>

            <aside className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="eyebrow mb-4">Contact details</h2>
                <ul className="space-y-3 text-charcoal/90">
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
                  {settings.whatsapp ? (
                    <li>
                      <a
                        href={waHref}
                        className="hover:text-saffron"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {settings.phone ?? "WhatsApp"}
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
                <SocialIconLinks
                  whatsappHref={settings.whatsapp ? waHref : undefined}
                  instagramHref={instagramLink()}
                />
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
