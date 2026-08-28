/** Tiny className combiner (no external dependency needed). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Ensure list-style copy ends with a sentence period. */
export function ensureTrailingPeriod(text: string): string {
  const trimmed = text.trimEnd();
  if (!trimmed) return text;
  if (/[.!?…]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
}

/** Format an ISO date string into a calm, readable label. */
export function formatDate(
  dateString?: string | null,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  },
): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: EVENT_TIMEZONE,
    ...options,
  }).format(date);
}

export function formatShortDate(dateString?: string | null): string {
  return formatDate(dateString, { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Format a date range into a compact, readable label, collapsing shared
 * month/year parts (e.g. "27-29 June 2026" or "27 June - 2 July 2026").
 * Falls back to a single formatted date when there is no valid end date.
 */
export function formatDateRange(
  startString?: string | null,
  endString?: string | null,
): string {
  const start = startString ? parseEventDate(startString) : null;
  const end = endString ? parseEventDate(endString) : null;

  if (!start) return formatDate(startString);
  if (!end || end.getTime() <= start.getTime() || isSameZonedDay(start, end)) {
    return formatDate(startString);
  }

  const startParts = zonedDateParts(start);
  const endParts = zonedDateParts(end);
  const sameYear = startParts.year === endParts.year;
  const sameMonth = sameYear && startParts.month === endParts.month;

  const formatZoned = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: EVENT_TIMEZONE,
      ...options,
    }).format(date);

  if (sameMonth) {
    const startDay = formatZoned(start, { day: "numeric" });
    const endPart = formatZoned(end, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${startDay}\u2013${endPart}`;
  }

  if (sameYear) {
    const startPart = formatZoned(start, { day: "numeric", month: "long" });
    const endPart = formatZoned(end, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${startPart} \u2013 ${endPart}`;
  }

  return `${formatDate(startString)} \u2013 ${formatDate(endString)}`;
}

const EVENT_TIMEZONE = "Europe/Tirane";

function parseEventDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date;
}

function zonedDateParts(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: EVENT_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const value = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day") };
}

function isSameZonedDay(start: Date, end: Date): boolean {
  const a = zonedDateParts(start);
  const b = zonedDateParts(end);
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * The Albania calendar day for a stored timestamp, as YYYY-MM-DD for date
 * inputs. Slicing the UTC ISO string would show the previous day.
 */
export function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const date = parseEventDate(trimmed);
  if (!date) return "";
  const { year, month, day } = zonedDateParts(date);
  if (!year || !month || !day) return "";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Compact day + month badge for the top-right of event cards (e.g. 27–29 / JUN 2026). */
export function formatEventDateBadge(
  startString?: string | null,
  endString?: string | null,
): { days: string; monthYear: string } | null {
  const start = startString ? parseEventDate(startString) : null;
  if (!start) return null;

  const end = endString ? parseEventDate(endString) : null;
  const monthYear = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: EVENT_TIMEZONE,
  })
    .format(start)
    .toUpperCase();

  if (end && end.getTime() > start.getTime() && !isSameZonedDay(start, end)) {
    const startParts = zonedDateParts(start);
    const endParts = zonedDateParts(end);
    const sameMonth =
      startParts.month === endParts.month && startParts.year === endParts.year;

    if (sameMonth) {
      return { days: `${startParts.day}\u2013${endParts.day}`, monthYear };
    }
  }

  const days = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    timeZone: EVENT_TIMEZONE,
  }).format(start);

  return { days, monthYear };
}

/** Calendar line with weekdays when the event spans multiple days. */
export function formatEventCalendarLine(
  startString?: string | null,
  endString?: string | null,
): string {
  const start = startString ? parseEventDate(startString) : null;
  if (!start) return "";

  const end = endString ? parseEventDate(endString) : null;
  const weekday = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      timeZone: EVENT_TIMEZONE,
    }).format(date);

  if (end && end.getTime() > start.getTime() && !isSameZonedDay(start, end)) {
    const startParts = zonedDateParts(start);
    const endParts = zonedDateParts(end);
    const sameMonth =
      startParts.month === endParts.month && startParts.year === endParts.year;

    if (sameMonth) {
      const monthYear = new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
        timeZone: EVENT_TIMEZONE,
      }).format(end);

      const weekdays =
        weekday(start) === weekday(end) ? weekday(start) : `${weekday(start)}\u2013${weekday(end)}`;

      return `${weekdays}, ${startParts.day}\u2013${endParts.day} ${monthYear}`;
    }
  }

  return formatDate(startString, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: EVENT_TIMEZONE,
  });
}

/** Short city/region label for the event card badge. */
export function eventLocationBadge(location?: string | null): string {
  if (!location) return "";

  if (/saranda/i.test(location)) return "SARANDA, ALBANIA";
  if (/tiran/i.test(location)) return "TIRANË, ALBANIA";

  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/^\d+$/.test(part));

  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`.toUpperCase();
  }

  return (parts[parts.length - 1] ?? location).toUpperCase();
}

/** Short city label for registration emails (e.g. Saranda, Tiranë). */
export function eventLocationShort(location?: string | null): string {
  if (!location) return "";

  if (/saranda/i.test(location)) return "Saranda";
  if (/tiran/i.test(location)) return "Tiranë";

  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/^\d+$/.test(part) && !/^[A-Z0-9+]+$/i.test(part));

  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }

  return parts[parts.length - 1] ?? location;
}

/** Compact date range for registration (e.g. 29-30 June). */
export function formatRegistrationEventDates(
  startString?: string | null,
  endString?: string | null,
): string {
  const start = startString ? parseEventDate(startString) : null;
  if (!start) return "";

  const end = endString ? parseEventDate(endString) : null;
  const monthName = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      month: "long",
      timeZone: EVENT_TIMEZONE,
    }).format(date);
  const day = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      timeZone: EVENT_TIMEZONE,
    }).format(date);

  if (end && end.getTime() > start.getTime() && !isSameZonedDay(start, end)) {
    const startParts = zonedDateParts(start);
    const endParts = zonedDateParts(end);
    const sameMonth =
      startParts.month === endParts.month && startParts.year === endParts.year;

    if (sameMonth) {
      return `${day(start)}-${day(end)} ${monthName(start)}`;
    }

    return `${day(start)} ${monthName(start)} - ${day(end)} ${monthName(end)}`;
  }

  return `${day(start)} ${monthName(start)}`;
}

/** Full event label for registration links and notification emails. */
export function formatRegistrationEventLabel(event: {
  title: string;
  location?: string | null;
  date?: string | null;
  endDate?: string | null;
}): string {
  const title = event.title.trim();
  const location = eventLocationShort(event.location);
  const dates = formatRegistrationEventDates(event.date, event.endDate);

  if (location && dates) return `${title}, ${location} (${dates})`;
  if (location) return `${title}, ${location}`;
  if (dates) return `${title} (${dates})`;
  return title;
}

/** Split a registration label into the heading and a second-line date. */
export function splitRegistrationEventTitle(label: string): {
  heading: string;
  dates?: string;
} {
  const match = label.trim().match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  if (!match) return { heading: label.trim() };
  return { heading: match[1].trim(), dates: `(${match[2].trim()})` };
}

/** Stable page-anchor for an event card, used for in-page links. */
export function eventAnchorId(eventId: string): string {
  return `event-${eventId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

const RESERVED_EVENT_SLUGS = new Set(["archive"]);

export function slugifySegment(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Public session URL slug. Uses the CMS slug when set, otherwise title + place + date. */
export function deriveEventSlug(event: {
  _id: string;
  title: string;
  slug?: string | null;
  date?: string | null;
  location?: string | null;
}): string {
  const stored = event.slug?.trim();
  if (stored && !RESERVED_EVENT_SLUGS.has(stored)) return stored;

  const date = event.date ? toDateInputValue(event.date) : "";
  const location = eventLocationShort(event.location);
  const derived = slugifySegment([event.title, location, date].filter(Boolean).join(" "));
  if (derived && !RESERVED_EVENT_SLUGS.has(derived)) return derived;

  return slugifySegment(event._id.replace(/^drafts\./, "")) || eventAnchorId(event._id);
}

/** Short card copy: intro only, capped at a few sentences. */
export function eventCardSummary(description?: string | null, maxSentences = 3): string {
  if (!description) return "";

  const intro = description.split(/\n\nBenefits:/i)[0]?.trim() ?? description;
  const text = intro.replace(/\n+/g, " ").trim();
  const sentences =
    text.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [text];

  return sentences.slice(0, maxSentences).join(" ");
}

const SESSION_MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";

/** Convert 12-hour session times (e.g. 5.30 pm) to 24-hour format (17:30). */
export function formatSessionTimingsTo24Hour(text: string): string {
  return text.replace(
    /\b(\d{1,2})[.:](\d{2})\s*(am|pm)\b/gi,
    (_, hourText, minutes, period) => {
      let hour = Number.parseInt(hourText, 10);
      const isPm = period.toLowerCase() === "pm";

      if (isPm && hour !== 12) hour += 12;
      if (!isPm && hour === 12) hour = 0;

      return `${hour.toString().padStart(2, "0")}:${minutes}`;
    },
  );
}

/**
 * Normalize CMS session schedules so each date/time is on its own line.
 * Handles pasted single-line values where newlines were stripped
 * (e.g. "19:306 September" → "19:30\\n6 September").
 */
export function normalizeEventSessionSchedule(text: string): string {
  let normalized = formatSessionTimingsTo24Hour(text).replace(/\r\n?/g, "\n").trim();

  normalized = normalized.replace(
    new RegExp(`(?<=\\d{2})\\s*(?=\\d{1,2}\\s+(?:${SESSION_MONTHS})\\b)`, "gi"),
    "\n",
  );

  normalized = normalized.replace(/(?<=\S)\s*(?=All\s+\d+\s+sessions\b)/gi, "\n\n");

  return normalized.replace(/\n{3,}/g, "\n\n").trim();
}

export type EventSessionInput = {
  day?: string | null;
  hours?: string | null;
};

/** Build the display schedule from structured CMS session rows (preferred). */
export function composeEventTimeLabel(input: {
  sessions?: EventSessionInput[] | null;
  sessionNote?: string | null;
  time?: string | null;
}): string | undefined {
  const hasStructuredSessions = Array.isArray(input.sessions);
  const sessionLines = (input.sessions ?? [])
    .map((session) => {
      const day = session.day?.trim();
      const hours = session.hours?.trim();
      if (!day || !hours) return null;
      return `${day}: ${hours}`;
    })
    .filter((line): line is string => Boolean(line));

  if (sessionLines.length > 0) {
    const note = input.sessionNote?.trim();
    return note ? [...sessionLines, "", note].join("\n") : sessionLines.join("\n");
  }

  // Empty Session Schedule is intentional — do not revive the hidden legacy `time` field.
  if (hasStructuredSessions) {
    return input.sessionNote?.trim() || undefined;
  }

  const legacy = input.time?.trim();
  return legacy || undefined;
}

