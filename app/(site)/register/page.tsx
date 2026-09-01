import type { Metadata } from "next";

import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/ui/PageHero";
import { findEventForRegistration, getRegisterPage } from "@/lib/cms/site-content";
import { resolveRegisterContent } from "@/lib/register-config";
import { isSimplifiedRegistration } from "@/lib/register-content";
import { buildMetadata } from "@/lib/seo";
import { formatRegistrationEventLabel, splitRegistrationEventTitle } from "@/lib/utils";

// Rendered per request so edits made in /admin are live the moment they are saved.
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Register",
  description: "Register for a Hatha Yoga program in Saranda & Tirana, Albania.",
  path: "/register",
  noIndex: true,
});

interface RegisterPageProps {
  searchParams: Promise<{ event?: string; slug?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const [{ event, slug }, registerPage] = await Promise.all([
    searchParams,
    getRegisterPage(),
  ]);
  const matched = await findEventForRegistration({
    slug,
    label: event,
  });
  const eventName =
    event?.trim() ||
    (matched ? formatRegistrationEventLabel(matched) : undefined);
  const eventTitle = eventName
    ? splitRegistrationEventTitle(eventName)
    : undefined;
  const content = resolveRegisterContent(registerPage);
  const simplified = isSimplifiedRegistration(eventName, matched?.category);

  return (
    <>
      <PageHero
        eyebrow={registerPage?.heroEyebrow?.trim() || "Registration"}
        title={
          eventTitle ? (
            <>
              {eventTitle.heading}
              {eventTitle.dates ? (
                <>
                  <br />
                  {eventTitle.dates}
                </>
              ) : null}
            </>
          ) : (
            registerPage?.heroTitle?.trim() || "Program registration"
          )
        }
        description={
          registerPage?.heroDescription?.trim() ||
          "Please complete the form below. Your information is confidential and is used only to prepare for your participation."
        }
      />

      <Section tone="cream">
        <Container size="narrow">
          <div className="rounded-2xl border border-border bg-ivory p-3 shadow-soft sm:p-8">
            <RegistrationForm
              event={eventName}
              eventSlug={matched?.slug ?? slug}
              simplified={simplified}
              content={content}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
