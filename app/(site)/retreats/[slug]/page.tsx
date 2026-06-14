import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CMSRichText } from "@/components/content/CMSRichText";
import { Gallery } from "@/components/content/Gallery";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SanityImage } from "@/components/ui/SanityImage";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { getRetreatBySlug, getRetreatSlugs } from "@/sanity/lib/fetch";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getRetreatSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const retreat = await getRetreatBySlug(slug);
  if (!retreat) return buildMetadata({ title: "Retreat", path: `/retreats/${slug}` });
  return buildMetadata({
    title: retreat.title,
    description: retreat.description,
    seo: retreat.seo,
    path: `/retreats/${retreat.slug}`,
  });
}

export default async function RetreatDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const retreat = await getRetreatBySlug(slug);

  if (!retreat) notFound();

  const meta = [formatDate(retreat.date), retreat.location, retreat.priceLabel]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <section className="bg-ivory pt-32 pb-section-sm sm:pt-40 border-b border-border">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-5">Retreat</p>
            <h1 className="text-display text-balance">{retreat.title}</h1>
            {meta ? <p className="mt-5 text-brown">{meta}</p> : null}
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div>
              {retreat.description ? (
                <p className="mb-8 text-lg leading-relaxed text-brown">
                  {retreat.description}
                </p>
              ) : null}
              <CMSRichText value={retreat.body} />

              {retreat.gallery && retreat.gallery.length > 0 ? (
                <div className="mt-12 border-t border-border pt-10">
                  <h2 className="mb-5 font-heading text-2xl text-charcoal">Gallery</h2>
                  <Gallery images={retreat.gallery} />
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
                    {retreat.date ? (
                      <div className="flex justify-between gap-4 border-b border-border pb-3">
                        <dt className="text-brown">Dates</dt>
                        <dd className="text-right font-medium text-charcoal">
                          {formatDate(retreat.date)}
                        </dd>
                      </div>
                    ) : null}
                    {retreat.location ? (
                      <div className="flex justify-between gap-4 border-b border-border pb-3">
                        <dt className="text-brown">Location</dt>
                        <dd className="text-right font-medium text-charcoal">
                          {retreat.location}
                        </dd>
                      </div>
                    ) : null}
                    {retreat.priceLabel ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-brown">Price</dt>
                        <dd className="text-right font-medium text-charcoal">
                          {retreat.priceLabel}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  {retreat.registrationLink ? (
                    <Button href={retreat.registrationLink} className="w-full">
                      Register
                    </Button>
                  ) : null}
                  <Button href="/contact" variant="secondary" className="w-full">
                    Enquire
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
