import type { Metadata } from "next";

import { PartnerProgramsSection } from "@/components/content/PartnerProgramsSection";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { MotionItem, MotionStagger } from "@/components/ui/Motion";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Ornament } from "@/components/ui/Ornament";
import { PageHero } from "@/components/ui/PageHero";
import { placeholderRetreatsPage } from "@/lib/placeholders";
import { buildMetadata } from "@/lib/seo";
import { PHASE1_RETREATS_SEO } from "@/lib/seo-phase1";
import { getRetreatsPage, getSiteSettings } from "@/lib/cms/site-content";

const INVITE_HEADING = "Retreats in preparation";
const INVITE_BODY =
  "Check Upcoming Events to see if a retreat is scheduled, or register your interest for a potential retreat in a location of your choice.";

function inviteHeading(value?: string) {
  const text = value?.trim();
  if (
    !text ||
    /^retreats are on their way$/i.test(text) ||
    /^we are carefully preparing upcoming classical hatha yoga retreats\.?$/i.test(
      text,
    )
  ) {
    return INVITE_HEADING;
  }
  return text;
}

function inviteBody(value?: string) {
  const text = value?.trim();
  if (!text || /no retreat is open for booking/i.test(text)) return INVITE_BODY;
  return text;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getRetreatsPage();
  return buildMetadata({
    title: PHASE1_RETREATS_SEO.title,
    description: PHASE1_RETREATS_SEO.description,
    seo: page.seo,
    path: "/retreats",
  });
}

// Rendered per request so edits made in /admin are live the moment they are saved.
export const dynamic = "force-dynamic";

export default async function RetreatsPage() {
  const [page, settings] = await Promise.all([
    getRetreatsPage(),
    getSiteSettings(),
  ]);

  const expectations =
    page.expectations?.filter((item) => item.title?.trim()) ??
    placeholderRetreatsPage.expectations ??
    [];

  return (
    <>
      <PageHero
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

      <Section tone="cream">
        <Container>
          <MotionReveal className="text-center">
            <p className="eyebrow mb-4">
              {page.expectationsEyebrow?.trim() || "What to expect"}
            </p>
            <h2 className="text-display-sm text-balance">
              {page.expectationsHeading?.trim() ||
                placeholderRetreatsPage.expectationsHeading}
            </h2>
            <Ornament className="mt-8" />
          </MotionReveal>
          <MotionStagger className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {expectations.map((item) => (
              <MotionItem key={item.title} className="h-full">
                <div className="h-full rounded-xl border border-border bg-ivory p-5 text-center sm:p-8">
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

      <Section tone="cream">
        <Container>
          <MotionReveal className="mx-auto max-w-2xl rounded-2xl border border-border bg-ivory px-8 py-16 text-center shadow-soft sm:py-20">
            <h2 className="text-display-sm text-balance">
              {inviteHeading(page.comingSoonHeading)}
            </h2>
            <p className="section-lead mx-auto mt-4 max-w-lg sm:mt-5">
              {inviteBody(page.comingSoonBody)}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/events">Upcoming events</Button>
              <Button href="/contact" variant="secondary">
                Register your interest
              </Button>
            </div>
          </MotionReveal>
        </Container>
      </Section>

      <PartnerProgramsSection
        whatsappNumber={settings.whatsapp}
        content={page.partnerPrograms}
      />
    </>
  );
}
