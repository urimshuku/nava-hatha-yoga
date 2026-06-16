import { CMSRichText } from "@/components/content/CMSRichText";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/ui/PageHero";
import type { LegalPage } from "@/sanity/lib/types";

export function LegalPageView({
  page,
  fallbackTitle,
}: {
  page?: LegalPage;
  fallbackTitle: string;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={page?.title ?? fallbackTitle} />
      <Section tone="cream">
        <Container size="narrow">
          <article className="prose prose-nava">
            <CMSRichText value={page?.body} />
          </article>
        </Container>
      </Section>
    </>
  );
}
