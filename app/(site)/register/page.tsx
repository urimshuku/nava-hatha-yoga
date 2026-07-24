import type { Metadata } from "next";

import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/ui/PageHero";
import { resolveRegisterContent } from "@/lib/register-config";
import { buildMetadata } from "@/lib/seo";
import { getRegisterPage } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildMetadata({
  title: "Register",
  description: "Register for a Hatha Yoga program in Saranda, Albania.",
  path: "/register",
  noIndex: true,
});

interface RegisterPageProps {
  searchParams: Promise<{ event?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const [{ event }, registerPage] = await Promise.all([
    searchParams,
    getRegisterPage(),
  ]);
  const eventName = event?.trim() || undefined;
  const content = resolveRegisterContent(registerPage);

  return (
    <>
      <PageHero
        eyebrow="Registration"
        title={eventName ? `Register for ${eventName}` : "Program registration"}
        description="Please complete the form below. Your information is confidential and is used only to prepare for your participation."
      />

      <Section tone="cream">
        <Container size="narrow">
          <div className="rounded-2xl border border-border bg-ivory p-3 shadow-soft sm:p-8">
            <RegistrationForm event={eventName} content={content} />
          </div>
        </Container>
      </Section>
    </>
  );
}
