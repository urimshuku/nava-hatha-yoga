import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/ui/PageHero";
import { SocialIconLinks } from "@/components/ui/SocialIconLinks";
import { resolveInstagramHref, whatsappLink } from "@/lib/constants";
import { placeholderContactPage } from "@/lib/placeholders";
import { buildMetadata } from "@/lib/seo";
import { PHASE1_CONTACT_SEO } from "@/lib/seo-phase1";
import { getContactPage, getPrograms, getSiteSettings } from "@/sanity/lib/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  return buildMetadata({
    title: PHASE1_CONTACT_SEO.title,
    description: PHASE1_CONTACT_SEO.description,
    seo: page.seo,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [settings, programs, page] = await Promise.all([
    getSiteSettings(),
    getPrograms(),
    getContactPage(),
  ]);

  const waMessage =
    page.whatsappPrefill?.trim() ||
    placeholderContactPage.whatsappPrefill ||
    "";
  const waHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(waMessage)}`
    : whatsappLink(waMessage);

  const locations =
    page.teachingLocations ?? placeholderContactPage.teachingLocations;

  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow?.trim() || placeholderContactPage.heroEyebrow || "Contact"}
        title={page.heroTitle?.trim() || placeholderContactPage.heroTitle}
        description={
          page.heroDescription?.trim() ||
          placeholderContactPage.heroDescription ||
          PHASE1_CONTACT_SEO.heroDescription
        }
      />

      <Section tone="cream">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div className="rounded-2xl border border-border bg-ivory p-3 shadow-soft sm:p-8">
              <h2 className="mb-3 font-heading text-lg text-charcoal sm:mb-6 sm:text-2xl">
                {page.formHeading?.trim() || placeholderContactPage.formHeading}
              </h2>
              <ContactForm programs={programs.map((p) => p.title)} />
            </div>

            <aside className="space-y-10 sm:space-y-12">
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
                <h2 className="eyebrow mb-4">Teaching locations</h2>
                <div className="space-y-4 text-sm leading-relaxed text-brown">
                  <div>
                    <p className="mb-1 font-medium text-charcoal">
                      {locations?.mainHeading || "Main teaching locations"}
                    </p>
                    <p>
                      {locations?.mainLocations || "Tirana, Saranda."}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-charcoal">
                      {locations?.otherHeading ||
                        "Other teaching locations upon request"}
                    </p>
                    <p>
                      {locations?.otherLocations ||
                        "Vlorë, Gjirokastër, Korçë, Corfu, Prishtina."}
                    </p>
                  </div>
                  <p className="pt-2">
                    <Link
                      href="/programs"
                      className="font-medium text-saffron underline underline-offset-2 hover:text-saffron-hover"
                    >
                      Explore programs
                    </Link>
                    {" · "}
                    <Link
                      href="/events"
                      className="font-medium text-saffron underline underline-offset-2 hover:text-saffron-hover"
                    >
                      See upcoming events
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div>
                <h2 className="eyebrow mb-4">Quick message</h2>
                <p className="mb-4 text-sm leading-relaxed text-brown">
                  {page.quickMessageBody?.trim() ||
                    placeholderContactPage.quickMessageBody}
                </p>
                <SocialIconLinks
                  whatsappHref={settings.whatsapp ? waHref : undefined}
                  instagramHref={resolveInstagramHref(settings.social)}
                />
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
