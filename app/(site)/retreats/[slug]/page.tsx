import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CMSRichText } from "@/components/content/CMSRichText";
import { Gallery } from "@/components/content/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SanityImage } from "@/components/ui/SanityImage";
import { isPastEvent } from "@/lib/event-boundary";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildRetreatEventJsonLd,
} from "@/lib/structured-data";
import {
  formatDateRange,
  retreatRegisterHref,
} from "@/lib/utils";
import { urlForImage } from "@/lib/cms/image-url";
import { getRetreatBySlug, getSiteSettings } from "@/lib/cms/site-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Retreats can be added and edited in the built-in CMS at any time, so these
// pages are rendered on request rather than fixed at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const retreat = await getRetreatBySlug(slug);
  if (!retreat) return buildMetadata({ title: "Retreat", path: `/retreats/${slug}` });

  const ogUrl = urlForImage(retreat.image)?.width(1200).height(630).fit("crop").url();

  return buildMetadata({
    title: retreat.title,
    description: retreat.description,
    seo: retreat.seo,
    path: `/retreats/${retreat.slug}`,
    image: ogUrl
      ? { url: ogUrl, width: 1200, height: 630, alt: retreat.title }
      : undefined,
  });
}

export default async function RetreatDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [retreat, settings] = await Promise.all([
    getRetreatBySlug(slug),
    getSiteSettings(),
  ]);

  if (!retreat) notFound();

  const past = isPastEvent({
    date: retreat.date ?? "",
    endDate: retreat.endDate,
  });
  const dateLabel = formatDateRange(retreat.date, retreat.endDate);
  const cityLabel = retreat.cityCountry?.trim();
  const addressLabel = retreat.location?.trim();
  const meta = [dateLabel, cityLabel].filter(Boolean).join(" · ");
  const priceLabel = retreat.priceLabel?.trim();
  const showPrice =
    Boolean(priceLabel) && !/^contact for details$/i.test(priceLabel ?? "");

  const retreatEvent = buildRetreatEventJsonLd(retreat, settings);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Retreats", path: "/retreats" },
            { name: retreat.title, path: `/retreats/${retreat.slug}` },
          ]),
          ...(retreatEvent ? [retreatEvent] : []),
        ]}
      />
      <section className="border-b border-border bg-ivory pb-10 pt-10 sm:pb-section-sm sm:pt-16 md:pt-40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-display text-balance">{retreat.title}</h1>
            {meta ? <p className="section-lead mt-4 sm:mt-5">{meta}</p> : null}
            {past ? (
              <p className="mt-4 text-sm text-brown sm:mt-5">
                This retreat has taken place.{" "}
                <Link
                  href="/retreats/archive"
                  className="text-charcoal underline decoration-border-strong underline-offset-4 transition-colors hover:text-saffron"
                >
                  View past retreats
                </Link>
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div>
              {retreat.description ? (
                <p className="section-lead mb-6 sm:mb-8">
                  {retreat.description}
                </p>
              ) : null}
              <CMSRichText value={retreat.body} />

              {retreat.gallery && retreat.gallery.length > 0 ? (
                <div className="mt-12 border-t border-border pt-10">
                  <h2 className="mb-5 font-heading text-2xl text-charcoal">Gallery</h2>
                  <Gallery images={retreat.gallery} title={retreat.title} />
                </div>
              ) : null}

              {retreat.cancellationPolicy && retreat.cancellationPolicy.length > 0 ? (
                <div className="mt-12 rounded-xl border border-border bg-ivory p-6">
                  <h2 className="font-heading text-xl text-charcoal">
                    Cancellation &amp; refund policy
                  </h2>
                  <div className="mt-3 text-sm">
                    <CMSRichText value={retreat.cancellationPolicy} />
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="overflow-hidden rounded-xl border border-border bg-ivory shadow-soft">
                <div className="aspect-[4/5]">
                  <SanityImage
                    image={retreat.image}
                    alt={retreat.title}
                    width={600}
                    height={750}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-4 p-6">
                  <dl className="space-y-3 text-sm">
                    {dateLabel ? (
                      <div className="flex justify-between gap-4 border-b border-border pb-3">
                        <dt className="text-brown">Dates</dt>
                        <dd className="text-right font-medium text-charcoal">
                          {dateLabel}
                        </dd>
                      </div>
                    ) : null}
                    {cityLabel ? (
                      <div className="flex justify-between gap-4 border-b border-border pb-3">
                        <dt className="text-brown">City, country</dt>
                        <dd className="text-right font-medium text-charcoal">
                          {cityLabel}
                        </dd>
                      </div>
                    ) : null}
                    {addressLabel ? (
                      <div className="flex justify-between gap-4 border-b border-border pb-3">
                        <dt className="text-brown">Address</dt>
                        <dd className="text-right font-medium text-charcoal">
                          {addressLabel}
                        </dd>
                      </div>
                    ) : null}
                    {showPrice ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-brown">Price</dt>
                        <dd className="text-right font-medium text-charcoal">
                          {priceLabel}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  {!past ? (
                    <Button
                      href={retreatRegisterHref(retreat)}
                      className="w-full"
                    >
                      Register
                    </Button>
                  ) : null}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-12 text-center sm:mt-16">
            <Button href="/contact" variant="ghost">
              Questions? Get in touch
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
