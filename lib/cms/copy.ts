import { isUpcomingEvent } from "@/lib/event-boundary";
import { composeEventTimeLabel, toDateInputValue } from "@/lib/utils";

import { dateToTimestamp } from "./form-values";
import { getDocument, type CmsDocumentType } from "./repository";

/** First free slug, trying `preferred` then `preferred-2`, `preferred-3`, … */
export async function nextAvailableSlug(
  type: CmsDocumentType,
  preferred: string,
): Promise<string> {
  if (!(await getDocument(type, preferred))) return preferred;

  for (let n = 2; n < 1000; n += 1) {
    const candidate = `${preferred}-${n}`;
    if (!(await getDocument(type, candidate))) return candidate;
  }

  throw new Error(`Could not find a free web address near "${preferred}".`);
}

/** "Sunrise session" → "Sunrise session (copy)"; a second copy becomes "(copy 2)". */
export function titleForCopy(title: string): string {
  const trimmed = title.trim() || "Untitled";
  const match = /^(.*?)(?: \(copy(?: (\d+))?\))$/.exec(trimmed);
  if (!match) return `${trimmed} (copy)`;

  const base = match[1];
  const next = match[2] ? Number(match[2]) + 1 : 2;
  return `${base} (copy ${next})`;
}

type SchedulableCopy = {
  date?: string;
  endDate?: string;
  sessions?: { day?: string; hours?: string }[];
  time?: string;
  description?: string;
};

function addCalendarYears(ymd: string, years: number): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const next = new Date(Date.UTC(year + years, month - 1, day));
  return [
    next.getUTCFullYear(),
    String(next.getUTCMonth() + 1).padStart(2, "0"),
    String(next.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function addYearsToTimestamp(
  iso: string | undefined,
  years: number,
  boundary: "start" | "end",
): string | undefined {
  if (!iso) return iso;
  const ymd = toDateInputValue(iso);
  if (!ymd) return iso;
  return dateToTimestamp(addCalendarYears(ymd, years), boundary) ?? iso;
}

function bumpYearsInLabel(value: string | undefined, years: number): string | undefined {
  if (!value || years === 0) return value;
  return value.replace(/\b((?:19|20)\d{2})\b/g, (year) =>
    String(Number(year) + years),
  );
}

function shiftScheduleByYears<T extends SchedulableCopy>(data: T, years: number): T {
  if (years === 0) return data;
  return {
    ...data,
    date: addYearsToTimestamp(data.date, years, "start") ?? data.date,
    endDate: addYearsToTimestamp(data.endDate, years, "end") ?? data.endDate,
    sessions: data.sessions?.map((session) => ({
      ...session,
      day: bumpYearsInLabel(session.day, years),
    })),
    time: bumpYearsInLabel(data.time, years),
  };
}

function asBoundary(data: SchedulableCopy) {
  return {
    date: data.date ?? "",
    endDate: data.endDate,
    time: composeEventTimeLabel(data),
  };
}

/**
 * A copy of a past workshop or retreat is rolled forward a year at a time so
 * its next occurrence lands in Upcoming, rather than sitting in Past.
 */
export function ensureUpcomingOccurrence<T extends SchedulableCopy>(
  data: T,
  now = Date.now(),
): T {
  if (!data.date && !data.endDate) return data;

  let next = data;
  for (let step = 0; step < 10; step += 1) {
    if (isUpcomingEvent(asBoundary(next), now)) return next;
    next = shiftScheduleByYears(next, 1);
  }
  return next;
}
