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

    const startMon = new Intl.DateTimeFormat("en-GB", {
      month: "short",
      timeZone: EVENT_TIMEZONE,
    })
      .format(start)
      .toUpperCase();
    const endMon = new Intl.DateTimeFormat("en-GB", {
      month: "short",
      timeZone: EVENT_TIMEZONE,
    })
      .format(end)
      .toUpperCase();

    if (startParts.year === endParts.year) {
      return {
        days: `${startParts.day}\u2013${endParts.day}`,
        monthYear: `${startMon}\u2013${endMon} ${startParts.year}`,
      };
    }

    return {
      days: `${startParts.day}\u2013${endParts.day}`,
      monthYear: `${startMon} ${startParts.year}\u2013${endMon} ${endParts.year}`,
    };
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
    const weekdays =
      weekday(start) === weekday(end)
        ? weekday(start)
        : `${weekday(start)}\u2013${weekday(end)}`;

    if (sameMonth) {
      const monthYear = new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
        timeZone: EVENT_TIMEZONE,
      }).format(end);

      return `${weekdays}, ${startParts.day}\u2013${endParts.day} ${monthYear}`;
    }

    const startPart = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: EVENT_TIMEZONE,
    }).format(start);
    const endPart = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: EVENT_TIMEZONE,
    }).format(end);

    return `${weekdays}, ${startPart} \u2013 ${endPart}`;
  }

  return formatDate(startString, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: EVENT_TIMEZONE,
  });
}

/** City and country for the event card pill, inferred from an address when needed. */
export function cityCountryFromLocation(location?: string | null): string | undefined {
  if (!location?.trim()) return undefined;

  if (/saranda/i.test(location)) return "Saranda, Albania";
  if (/tiran/i.test(location)) return "Tiranë, Albania";

  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/^\d+$/.test(part) && !/^[A-Z0-9+]{4,}$/i.test(part));

  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
  }

  return parts[0];
}

/** Short city/region label for the event card badge. */
export function eventLocationBadge(
  location?: string | null,
  cityCountry?: string | null,
): string {
  const explicit = cityCountry?.trim();
  if (explicit) return explicit.toUpperCase();
  if (!location) return "";

  const inferred = cityCountryFromLocation(location);
  return inferred ? inferred.toUpperCase() : location.toUpperCase();
}

/** Short city label for registration emails (e.g. Saranda, Tiranë). */
export function eventLocationShort(
  location?: string | null,
  cityCountry?: string | null,
): string {
  const source = cityCountry?.trim() || location;
  if (!source) return "";

  if (/saranda/i.test(source)) return "Saranda";
  if (/tiran/i.test(source)) return "Tiranë";

  const parts = source
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/^\d+$/.test(part) && !/^[A-Z0-9+]+$/i.test(part));

  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }

  return parts[parts.length - 1] ?? source;
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
  cityCountry?: string | null;
  date?: string | null;
  endDate?: string | null;
  sessions?: EventSessionInput[] | null;
  time?: string | null;
  description?: string | null;
}): string {
  const title = event.title.trim();
  const location = eventLocationShort(event.location, event.cityCountry);
  const dates = formatRegistrationEventDates(
    event.date,
    resolveEventCardEndDate(event),
  );

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

/**
 * Public /events/ address from the title, city, and start date
 * (e.g. yogasanas-tirane-2026-09-25).
 */
export function eventWebAddress(
  title?: string | null,
  cityCountry?: string | null,
  date?: string | null,
): string {
  const city = eventLocationShort(undefined, cityCountry);
  const day = date
    ? /^\d{4}-\d{2}-\d{2}$/.test(date.trim())
      ? date.trim()
      : toDateInputValue(date)
    : "";
  return slugifySegment([title?.trim(), city, day].filter(Boolean).join(" "));
}

/** Public session URL slug. Uses the CMS slug when set, otherwise title + place + date. */
export function deriveEventSlug(event: {
  _id: string;
  title: string;
  slug?: string | null;
  date?: string | null;
  location?: string | null;
  cityCountry?: string | null;
}): string {
  const stored = event.slug?.trim();
  if (stored && !RESERVED_EVENT_SLUGS.has(stored)) return stored;

  const date = event.date ? toDateInputValue(event.date) : "";
  const location = eventLocationShort(event.location, event.cityCountry);
  const derived = slugifySegment([event.title, location, date].filter(Boolean).join(" "));
  if (derived && !RESERVED_EVENT_SLUGS.has(derived)) return derived;

  return slugifySegment(event._id.replace(/^drafts\./, "")) || eventAnchorId(event._id);
}

/** Intro copy only: drop Benefits, Duration, and session lines pasted into the description. */
export function stripEventDescriptionExtras(description?: string | null): string {
  if (!description) return "";

  let text = description.replace(/\r\n/g, "\n").trim();
  text = text.split(/\n\s*Benefits:\s*/i)[0] ?? text;
  text = text.split(/\n\s*Duration:\s*/i)[0] ?? text;
  return text.trim();
}

/** Short card copy: intro only, capped at a few sentences. */
export function eventCardSummary(description?: string | null, maxSentences = 3): string {
  if (!description) return "";

  const intro = stripEventDescriptionExtras(description);
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

const SESSION_DATE_LINE = new RegExp(
  `^(\\d{1,2}\\s+(?:${SESSION_MONTHS})(?:\\s+\\d{4})?):\\s*(.+)$`,
  "i",
);

/** Session dates and duration copied into the description (legacy / placeholder). */
export function scheduleTextFromDescription(
  description?: string | null,
): string | undefined {
  if (!description) return undefined;

  const lines = description
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter(
      (line) => /^duration:/i.test(line) || SESSION_DATE_LINE.test(line),
    );

  return lines.length > 0 ? lines.join("\n") : undefined;
}

export function sessionsFromDescription(
  description?: string | null,
): EventSessionInput[] {
  if (!description) return [];

  return description
    .split(/\n/)
    .map((line) => line.trim())
    .flatMap((line) => {
      const match = SESSION_DATE_LINE.exec(line);
      if (!match) return [];
      return [{ day: match[1].trim(), hours: match[2].trim() }];
    });
}

const MANDATORY_SESSION_NOTE = /\bAll\s+\d+\s+sessions\b[^\n]*/i;

/** "All 5 sessions are mandatory" copied into the old schedule text. */
export function sessionNoteFromSchedule(
  ...sources: Array<string | null | undefined>
): string | undefined {
  for (const source of sources) {
    const match = source?.match(MANDATORY_SESSION_NOTE);
    if (match?.[0]?.trim()) return match[0].trim();
  }
  return undefined;
}

/** First source that contains session date lines (schedule field, then description). */
export function sessionsFromSchedule(
  ...sources: Array<string | null | undefined>
): EventSessionInput[] {
  for (const source of sources) {
    const sessions = sessionsFromDescription(source);
    if (sessions.length > 0) return sessions;
  }
  return [];
}

export function hasCompleteSessions(
  sessions?: EventSessionInput[] | null,
): boolean {
  return Boolean(sessions?.some((session) => session.day?.trim() && session.hours?.trim()));
}

/**
 * Fill Session times and Note under the times from the old schedule text
 * when those CMS fields were never stored separately.
 */
export function hydrateEventSessionFields(input: {
  sessions?: EventSessionInput[] | null;
  sessionNote?: string | null;
  time?: string | null;
  description?: string | null;
}): { sessions: EventSessionInput[]; sessionNote?: string } {
  const sessions = hasCompleteSessions(input.sessions)
    ? (input.sessions ?? []).map((session) => ({
        day: session.day?.trim() || undefined,
        hours: session.hours?.trim() || undefined,
      }))
    : sessionsFromSchedule(input.time, input.description);

  const sessionNote =
    input.sessionNote?.trim() ||
    sessionNoteFromSchedule(input.time, input.description) ||
    (sessions.length >= 2
      ? `All ${sessions.length} sessions are mandatory`
      : undefined);

  return { sessions, sessionNote };
}

const SESSION_DAY_LABEL = new RegExp(
  `^(\\d{1,2})\\s+(${SESSION_MONTHS})(?:\\s+(\\d{4}))?$`,
  "i",
);

const MONTH_NUMBER: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

function parseSessionDayLabel(
  label: string,
  defaultYear: number,
): { year: number; month: number; day: number } | null {
  const match = SESSION_DAY_LABEL.exec(label.trim());
  if (!match) return null;
  const month = MONTH_NUMBER[match[2].toLowerCase()];
  if (!month) return null;
  return {
    day: Number(match[1]),
    month,
    year: match[3] ? Number(match[3]) : defaultYear,
  };
}

function calendarDayValue(parts: { year: number; month: number; day: number }): number {
  return parts.year * 10_000 + parts.month * 100 + parts.day;
}

/**
 * Last calendar day on the event card. Uses the last session row so the badge
 * matches the times (e.g. 25–27 Sept), then falls back to Last day.
 */
export function resolveEventCardEndDate(event: {
  date?: string | null;
  endDate?: string | null;
  sessions?: EventSessionInput[] | null;
  time?: string | null;
  description?: string | null;
}): string | undefined {
  const start = event.date ? parseEventDate(event.date) : null;
  const startParts = start ? zonedDateParts(start) : null;
  const defaultYear = startParts?.year;
  const sessions = hydrateEventSessionFields(event).sessions;

  if (sessions.length > 0 && defaultYear) {
    let last: { year: number; month: number; day: number } | null = null;

    for (const session of sessions) {
      const parsed = parseSessionDayLabel(session.day ?? "", defaultYear);
      if (!parsed) continue;
      if (!/\d{4}/.test(session.day ?? "") && startParts && parsed.month < startParts.month) {
        parsed.year = defaultYear + 1;
      }
      if (!last || calendarDayValue(parsed) >= calendarDayValue(last)) last = parsed;
    }

    if (last) {
      return new Date(Date.UTC(last.year, last.month - 1, last.day, 12, 0, 0)).toISOString();
    }
  }

  return event.endDate ?? undefined;
}

function withSessionNote(schedule: string, note?: string): string {
  if (!note) return schedule;
  if (schedule.toLowerCase().includes(note.toLowerCase())) return schedule;
  return `${schedule}\n\n${note}`;
}

/** Build the display schedule from structured CMS session rows (preferred). */
export function composeEventTimeLabel(input: {
  sessions?: EventSessionInput[] | null;
  sessionNote?: string | null;
  time?: string | null;
  description?: string | null;
}): string | undefined {
  const hydrated = hydrateEventSessionFields(input);
  const sessionLines = hydrated.sessions
    .map((session) => {
      const day = session.day?.trim();
      const hours = session.hours?.trim();
      if (!day || !hours) return null;
      return `${day}: ${hours}`;
    })
    .filter((line): line is string => Boolean(line));

  if (sessionLines.length > 0) {
    return withSessionNote(sessionLines.join("\n"), hydrated.sessionNote);
  }

  const fromTime = input.time?.trim();
  if (fromTime) return fromTime;

  const fromDescription = scheduleTextFromDescription(input.description);
  if (fromDescription) {
    return withSessionNote(fromDescription, hydrated.sessionNote);
  }

  return hydrated.sessionNote;
}

