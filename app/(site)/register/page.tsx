import type { Metadata } from "next";

import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Register",
  description: "Register for an Nava Hatha Yoga program in Saranda, Albania.",
  path: "/register",
  noIndex: true,
});

interface RegisterPageProps {
  searchParams: Promise<{ event?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { event } = await searchParams;
  const eventName = event?.trim() || undefined;

  return (
    <>
      <PageHero
        eyebrow="Registration"
        title={eventName ? `Register for ${eventName}` : "Program registration"}
        description="Please complete the form below. Your information is confidential and is used only to prepare for your participation."
      />

      <Section tone="cream">
        <Container size="narrow">
          <div className="rounded-2xl border border-border bg-ivory p-6 shadow-soft sm:p-8">
            <RegistrationForm event={eventName} />
          </div>
        </Container>
      </Section>
    </>
  );
}
