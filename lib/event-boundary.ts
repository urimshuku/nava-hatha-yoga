import { normalizeEventSessionSchedule } from "@/lib/utils";

/** Event archive boundaries use Albania local time (where sessions take place). */
export const EVENT_TIMEZONE = "Europe/Tirane";

const MONTH_TO_INDEX: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const SESSION_LINE_RE =
  /^(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+(\d{4}))?\s*:\s*(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/i;

export type EventBoundaryInput = {
  date: string;
  endDate?: string;
  time?: string;
};

function dateTimeValue(value?: string): number | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function parseIsoYear(iso?: string): number | null {
  if (!iso) return null;
  const year = new Date(iso).getUTCFullYear();
  return Number.isFinite(year) ? year : null;
}

/** Prefer the start year when a leftover end date is earlier than the start. */
function sessionDefaultYear(date?: string, endDate?: string): number | null {
  const startMs = dateTimeValue(date);
  const endMs = dateTimeValue(endDate);
  if (startMs != null && endMs != null && endMs < startMs) {
    return parseIsoYear(date);
  }
  return parseIsoYear(endDate) ?? parseIsoYear(date);
}

/** Convert a wall-clock time in `timeZone` to UTC milliseconds. */
export function zonedLocalToUtcMs(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string = EVENT_TIMEZONE,
): number {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    dtf
      .formatToParts(new Date(utcGuess))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  const reconstructed = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second ?? "0"),
  );

  return utcGuess - (reconstructed - utcGuess);
}

function parseSessionLine(
  match: RegExpMatchArray,
  defaultYear: number,
): {
  year: number;
  month: number;
  day: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
} {
  const month = MONTH_TO_INDEX[match[2].toLowerCase()] + 1;
  return {
    year: match[3] ? Number(match[3]) : defaultYear,
    month,
    day: Number(match[1]),
    startHour: Number(match[4]),
    startMinute: Number(match[5]),
    endHour: Number(match[6]),
    endMinute: Number(match[7]),
  };
}

/** Derive ISO start/end from the session lines stored in the event `time` field. */
export function sessionBoundaryFromSchedule(
  time: string,
  defaultYear: number,
): { date: string; endDate: string } | null {
  let first: ReturnType<typeof parseSessionLine> | null = null;
  let last: ReturnType<typeof parseSessionLine> | null = null;

  for (const rawLine of normalizeEventSessionSchedule(time).split("\n")) {
    const match = rawLine.trim().match(SESSION_LINE_RE);
    if (!match) continue;

    const parsed = parseSessionLine(match, defaultYear);
    if (!first) first = parsed;
    last = parsed;
  }

  if (!first || !last) return null;

  return {
    date: new Date(
      zonedLocalToUtcMs(
        first.year,
        first.month,
        first.day,
        first.startHour,
        first.startMinute,
      ),
    ).toISOString(),
    endDate: new Date(
      zonedLocalToUtcMs(last.year, last.month, last.day, last.endHour, last.endMinute),
    ).toISOString(),
  };
}

function lastSessionEndFromTimeField(
  time?: string,
  date?: string,
  endDate?: string,
): number | null {
  if (!time) return null;

  const defaultYear = sessionDefaultYear(date, endDate);
  if (defaultYear == null) return null;

  let lastEnd: number | null = null;

  for (const rawLine of normalizeEventSessionSchedule(time).split("\n")) {
    const match = rawLine.trim().match(SESSION_LINE_RE);
    if (!match) continue;

    const parsed = parseSessionLine(match, defaultYear);
    lastEnd = zonedLocalToUtcMs(
      parsed.year,
      parsed.month,
      parsed.day,
      parsed.endHour,
      parsed.endMinute,
    );
  }

  return lastEnd;
}

export function eventStartTimestamp(event: EventBoundaryInput): number {
  return dateTimeValue(event.date) ?? Number.POSITIVE_INFINITY;
}

/** When session timings are present, the last session end is the archive boundary. */
export function eventEndTimestamp(event: EventBoundaryInput): number {
  const fromSchedule = lastSessionEndFromTimeField(event.time, event.date, event.endDate);
  if (fromSchedule != null) return fromSchedule;

  const fromEndDate = dateTimeValue(event.endDate);
  const fromDate = dateTimeValue(event.date);
  if (fromEndDate != null && (fromDate == null || fromEndDate >= fromDate)) {
    return fromEndDate;
  }

  return fromDate ?? Number.POSITIVE_INFINITY;
}

export function isPastEvent(event: EventBoundaryInput, now = Date.now()): boolean {
  return eventEndTimestamp(event) < now;
}

export function isUpcomingEvent(event: EventBoundaryInput, now = Date.now()): boolean {
  return eventEndTimestamp(event) >= now;
}
