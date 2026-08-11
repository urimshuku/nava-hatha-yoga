import type { Metadata } from "next";

import { RetreatCard } from "@/components/cards/RetreatCard";
import { PartnerProgramsSection } from "@/components/content/PartnerProgramsSection";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/ui/CTASection";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Ornament } from "@/components/ui/Ornament";
import { PageHero } from "@/components/ui/PageHero";
import { placeholderRetreatsPage } from "@/lib/placeholders";
import { buildMetadata } from "@/lib/seo";
import { PHASE1_RETREATS_SEO } from "@/lib/seo-phase1";
import { getRetreats, getRetreatsPage, getSiteSettings } from "@/sanity/lib/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getRetreatsPage();
  return buildMetadata({
    title: PHASE1_RETREATS_SEO.title,
    description: PHASE1_RETREATS_SEO.description,
    seo: page.seo,
    path: "/retreats",
  });
}

export default async function RetreatsPage() {
  const [retreats, page, settings] = await Promise.all([
    getRetreats(),
    getRetreatsPage(),
    getSiteSettings(),
  ]);
  const hasRetreats = retreats.length > 0;

  const expectations =
    page.expectations?.filter((item) => item.title?.trim()) ??
    placeholderRetreatsPage.expectations ??
    [];

  const listingCta = page.listingCta ?? placeholderRetreatsPage.listingCta;

  return (
    <>
      <PageHero
        eyebrow={
          page.heroEyebrow?.trim() || placeholderRetreatsPage.heroEyebrow
        }
        title={
          page.heroTitle?.trim() ||
          placeholderRetreatsPage.heroTitle ||
          PHASE1_RETREATS_SEO.heroTitle
        }
        description={
          page.heroDescription?.trim() ||
          placeholderRetreatsPage.heroDescription ||
          PHASE1_RETREATS_SEO.heroDescription
        }
      />

      {hasRetreats ? (
        <>
          <Section tone="cream">
            <Container>
              <MotionStagger className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {retreats.map((retreat) => (
                  <MotionItem key={retreat._id} className="h-full">
                    <RetreatCard retreat={retreat} headingLevel={2} />
                  </MotionItem>
                ))}
              </MotionStagger>
            </Container>
          </Section>
          <CTASection
            heading={
              listingCta?.heading ?? "Questions about a retreat?"
            }
            body={
              listingCta?.body ??
              "Reach out and we'll be glad to share more details and help you decide if it's right for you."
            }
            ctaLabel={listingCta?.cta?.label ?? "Contact us"}
            ctaHref={listingCta?.cta?.href ?? "/contact"}
          />
        </>
      ) : (
        <>
          <Section tone="cream">
            <Container>
              <MotionReveal className="mx-auto max-w-2xl rounded-2xl border border-border bg-ivory px-8 py-16 text-center shadow-soft sm:py-20">
                <p className="eyebrow">Coming Soon</p>
                <h2 className="mt-4 text-display-sm text-balance">
                  {page.comingSoonHeading?.trim() ||
                    placeholderRetreatsPage.comingSoonHeading}
                </h2>
                <p className="section-lead mx-auto mt-4 max-w-md sm:mt-5">
                  {page.comingSoonBody?.trim() ||
                    placeholderRetreatsPage.comingSoonBody}
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button href="/contact">Register your interest</Button>
                  <Button href="/programs" variant="secondary">
                    Explore programs
                  </Button>
                </div>
              </MotionReveal>
            </Container>
          </Section>

          <Section tone="ivory" className="border-t border-border">
            <Container>
              <MotionReveal className="text-center">
                <p className="eyebrow mb-4">What to expect</p>
                <h2 className="text-display-sm text-balance">
                  {page.expectationsHeading?.trim() ||
                    placeholderRetreatsPage.expectationsHeading}
                </h2>
                <Ornament className="mt-8" />
              </MotionReveal>
              <MotionStagger className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
                {expectations.map((item) => (
                  <MotionItem key={item.title} className="h-full">
                    <div className="h-full rounded-xl border border-border bg-cream p-5 text-center sm:p-8">
                      <h3 className="font-heading text-xl text-charcoal sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-brown sm:mt-3">
                        {item.body}
                      </p>
                    </div>
                  </MotionItem>
                ))}
              </MotionStagger>
            </Container>
          </Section>
        </>
      )}

      <PartnerProgramsSection
        whatsappNumber={settings.whatsapp}
        content={page.partnerPrograms}
      />
    </>
  );
}
