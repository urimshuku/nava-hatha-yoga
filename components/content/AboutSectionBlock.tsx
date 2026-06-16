import type { PortableTextBlock } from "@portabletext/types";

import { CMSRichText } from "@/components/content/CMSRichText";
import { AboutSectionImage } from "@/components/ui/AboutSectionImage";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Ornament } from "@/components/ui/Ornament";
import { cn } from "@/lib/utils";
import type { CtaLink, SanityImage as SanityImageType } from "@/sanity/lib/types";

type AboutSectionBlockProps = {
  title: string;
  body?: PortableTextBlock[];
  image?: SanityImageType;
  cta?: CtaLink;
  index: number;
  tone?: "cream" | "ivory";
};

export function AboutSectionBlock({
  title,
  body,
  image,
  cta,
  index,
  tone = "cream",
}: AboutSectionBlockProps) {
  const imageFirst = index % 2 === 1;
  const hasBody = Boolean(body && body.length > 0);

  return (
    <article
      className={cn(
        "border-y border-border py-section-sm",
        tone === "cream" ? "bg-cream" : "bg-ivory",
      )}
    >
      <div className="mx-auto grid max-w-container items-center gap-10 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <MotionReveal
          className={cn(imageFirst && "lg:order-2")}
          delay={imageFirst ? 0.08 : 0}
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-ivory shadow-soft">
            <div className="aspect-[4/3] sm:aspect-[5/4]">
              <AboutSectionImage
                title={title}
                image={image}
                width={760}
                height={608}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full"
              />
            </div>
          </div>
        </MotionReveal>

        <MotionReveal
          className={cn(imageFirst && "lg:order-1")}
          delay={imageFirst ? 0 : 0.08}
        >
          <p className="eyebrow mb-4">About</p>
          <h2 className="text-display-sm text-balance">{title}</h2>
          <Ornament className="mt-6" width="w-14" />
          {hasBody ? (
            <div className="mt-8 text-lg [&_p]:leading-relaxed [&_p]:text-charcoal/90">
              <CMSRichText value={body} />
            </div>
          ) : (
            <p className="mt-8 text-base leading-relaxed text-brown">
              Content for this section will be added soon.
            </p>
          )}
          {cta?.href && cta.label ? (
            <div className="mt-8">
              <Button href={cta.href} variant="secondary">
                {cta.label}
              </Button>
            </div>
          ) : null}
        </MotionReveal>
      </div>
    </article>
  );
}
