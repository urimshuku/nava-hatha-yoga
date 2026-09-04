import type { Metadata } from "next";

import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/ui/PageHero";
import {
  findEventForRegistration,
  getRegisterPage,
  getRetreatBySlug,
} from "@/lib/cms/site-content";
import { resolveRegisterContent } from "@/lib/register-config";
import {
  isSimplifiedRegistrationKind,
  parseRegistrationKind,
  resolveRegistrationKind,
} from "@/lib/registration-kind";
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
  searchParams: Promise<{ event?: string; slug?: string; kind?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { event, slug, kind: kindParam } = await searchParams;
  const requestedKind = parseRegistrationKind(kindParam);

  const [matchedEvent, retreatBySlug] = await Promise.all([
    requestedKind === "retreat"
      ? Promise.resolve(undefined)
      : findEventForRegistration({
          slug,
          label: event,
        }),
    slug ? getRetreatBySlug(slug) : Promise.resolve(undefined),
  ]);

  const matchedRetreat =
    requestedKind === "retreat" || !matchedEvent ? retreatBySlug : undefined;

  const kind = resolveRegistrationKind({
    kind: kindParam,
    category: matchedEvent?.category,
    isRetreat: Boolean(matchedRetreat),
    eventLabel: event,
  });

  const registerPage = await getRegisterPage(kind);
  const eventName =
    event?.trim() ||
    (matchedRetreat
      ? formatRegistrationEventLabel(matchedRetreat)
      : matchedEvent
        ? formatRegistrationEventLabel(matchedEvent)
        : undefined);
  const eventTitle = eventName
    ? splitRegistrationEventTitle(eventName)
    : undefined;
  const content = resolveRegisterContent(registerPage, kind);
  const simplified = isSimplifiedRegistrationKind(kind);
  const defaultTitle =
    kind === "free"
      ? "Free offering registration"
      : kind === "module"
        ? "Module registration"
        : kind === "retreat"
          ? "Retreat registration"
          : "Program registration";

  return (
    <>
      <PageHero
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
            registerPage?.heroTitle?.trim() || defaultTitle
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
              eventSlug={matchedRetreat?.slug ?? matchedEvent?.slug ?? slug}
              kind={kind}
              simplified={simplified}
              content={content}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
