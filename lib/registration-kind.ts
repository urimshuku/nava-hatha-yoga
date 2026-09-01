/**
 * Which registration form to show: workshops, modules and retreats use the
 * full 5-step form (with independent CMS copy); free offerings use the first
 * page only.
 */

export const REGISTRATION_KINDS = ["workshop", "free", "module", "retreat"] as const;
export type RegistrationKind = (typeof REGISTRATION_KINDS)[number];

export const FREE_SESSION_CATEGORY = "Free Session";

/**
 * CMS document slugs under type `registerPage`. Workshop keeps `default` so
 * existing published registration copy is unchanged.
 */
export const REGISTER_DOCUMENT_SLUG: Record<RegistrationKind, string> = {
  workshop: "default",
  free: "free-offering",
  module: "module",
  retreat: "retreat",
};

export function isFreeSessionCategory(category?: string | null): boolean {
  return (category ?? "").trim().toLowerCase() === FREE_SESSION_CATEGORY.toLowerCase();
}

export function parseRegistrationKind(
  value?: string | null,
): RegistrationKind | undefined {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized === "workshop" ||
    normalized === "free" ||
    normalized === "module" ||
    normalized === "retreat"
  ) {
    return normalized;
  }
  return undefined;
}

export function registrationKindFromCategory(
  category?: string | null,
): RegistrationKind | undefined {
  const value = (category ?? "").trim().toLowerCase();
  if (value === "free session") return "free";
  if (value === "retreat") return "retreat";
  if (value === "workshop") return "workshop";
  return undefined;
}

export function registrationKindFromDocumentSlug(
  slug: string,
): RegistrationKind {
  if (slug === REGISTER_DOCUMENT_SLUG.free) return "free";
  if (slug === REGISTER_DOCUMENT_SLUG.module) return "module";
  if (slug === REGISTER_DOCUMENT_SLUG.retreat) return "retreat";
  return "workshop";
}

/** Module and retreat forms start as a copy of workshop until saved on their own. */
export function registerPageCopiesWorkshop(slug: string): boolean {
  return (
    slug === REGISTER_DOCUMENT_SLUG.module ||
    slug === REGISTER_DOCUMENT_SLUG.retreat
  );
}

/** Older intro-session links that predate the Free Session event type. */
function isLegacyFreeOfferingLabel(event?: string | null): boolean {
  return /free\s+introduction\s+to\s+hatha\s+yoga/i.test(event ?? "");
}

export function resolveRegistrationKind(input: {
  kind?: string | null;
  category?: string | null;
  isRetreat?: boolean;
  eventLabel?: string | null;
}): RegistrationKind {
  if (input.isRetreat) return "retreat";
  const fromCategory = registrationKindFromCategory(input.category);
  if (fromCategory) return fromCategory;
  const fromParam = parseRegistrationKind(input.kind);
  if (fromParam) return fromParam;
  if (isLegacyFreeOfferingLabel(input.eventLabel)) return "free";
  return "workshop";
}

export function isSimplifiedRegistrationKind(kind: RegistrationKind): boolean {
  return kind === "free";
}
