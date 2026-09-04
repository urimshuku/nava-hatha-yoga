import { EVENT_TIMEZONE, zonedLocalToUtcMs } from "@/lib/event-boundary";
import { slugifySegment } from "@/lib/utils";
import type { SanityImage } from "@/lib/cms/content-types";
import type { DocumentSchema } from "@/lib/cms/schema";

/** Shared helpers for reading the editor's forms. */

export function text(
  formData: FormData,
  name: string,
  keepEmpty = false,
): string | undefined {
  const value = formData.get(name);
  if (typeof value !== "string") return keepEmpty ? "" : undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : keepEmpty ? "" : undefined;
}

export function checkbox(formData: FormData, name: string): boolean {
  return formData.get(name) != null;
}

/** True when the Publish button submitted the form, rather than Save. */
export function isPublishIntent(formData: FormData): boolean {
  return formData.get("intent") === "publish";
}

/**
 * An image field's value. It travels as JSON so an existing image survives an
 * edit untouched, rather than being rebuilt from separate inputs.
 * Returns null when the image was removed, so the caller can tell "cleared" from
 * "not in this form".
 */
export function imageValue(
  formData: FormData,
  name: string,
): SanityImage | null | undefined {
  const raw = formData.get(`${name}__json`);
  if (typeof raw !== "string") return undefined;
  if (!raw.trim()) return null;

  try {
    return JSON.parse(raw) as SanityImage;
  } catch {
    return undefined;
  }
}

/** Repeated fields of the same name, empty rows discarded. */
export function textList(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .flatMap((value) => (typeof value === "string" ? [value.trim()] : []))
    .filter(Boolean);
}

/** Pairs two repeated fields into rows, dropping rows missing either half. */
export function pairedList(
  formData: FormData,
  firstName: string,
  secondName: string,
): { first: string; second: string }[] {
  const firsts = formData.getAll(firstName);
  const seconds = formData.getAll(secondName);
  const rows: { first: string; second: string }[] = [];

  for (let index = 0; index < Math.max(firsts.length, seconds.length); index += 1) {
    const first = String(firsts[index] ?? "").trim();
    const second = String(seconds[index] ?? "").trim();
    if (!first || !second) continue;
    rows.push({ first, second });
  }

  return rows;
}

/**
 * A date input gives "YYYY-MM-DD". Events are stored as timestamps, so the date
 * is anchored to Albania local time: the start of the day, or the end of it for
 * an end date, which keeps events out of the archive until the day is over.
 */
export function dateToTimestamp(
  value: string | undefined,
  boundary: "start" | "end",
): string | undefined {
  if (!value) return undefined;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;

  const [, year, month, day] = match;
  const hour = boundary === "start" ? 0 : 23;
  const minute = boundary === "start" ? 0 : 59;

  return new Date(
    zonedLocalToUtcMs(
      Number(year),
      Number(month),
      Number(day),
      hour,
      minute,
      EVENT_TIMEZONE,
    ),
  ).toISOString();
}

/** Drop a leftover end date that is earlier than the start (common after duplicate). */
export function omitEndDateBeforeStart(
  start?: string,
  end?: string,
): string | undefined {
  if (!end) return undefined;
  if (!start) return end;
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return end;
  return endMs < startMs ? undefined : end;
}

/** "archive" is the past-events page, so it can never be a document slug. */
const RESERVED_SLUGS = new Set(["archive", "new"]);

export function resolveSlug(
  requested: string | undefined,
  fallbackParts: (string | undefined)[],
): string | undefined {
  const candidate =
    slugifySegment(requested ?? "") ||
    slugifySegment(fallbackParts.filter(Boolean).join(" "));

  if (!candidate || RESERVED_SLUGS.has(candidate)) return undefined;

  return candidate;
}

/** Keep stored SEO when the editor no longer shows sharing fields. */
export function preserveSeo<T extends { seo?: unknown }>(
  data: T,
  existing?: T | null,
): T {
  if (data.seo !== undefined || existing?.seo === undefined) return data;
  return { ...data, seo: existing.seo };
}

/** Keep values from sections hidden in the editor so a save does not wipe them. */
export function preserveArchivedSections(
  schema: DocumentSchema,
  data: Record<string, unknown>,
  existing?: Record<string, unknown> | null,
): Record<string, unknown> {
  if (!existing) return data;
  const next = { ...data };
  for (const section of schema.sections) {
    if (!section.archived) continue;
    for (const field of section.fields) {
      if (next[field.name] === undefined && existing[field.name] !== undefined) {
        next[field.name] = existing[field.name];
      }
    }
  }
  return next;
}
