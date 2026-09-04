import { registrationKindFromCategory } from "@/lib/registration-kind";

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

  const startPart = formatZoned(start, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const endPart = formatZoned(end, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startPart} \u2013 ${endPart}`;
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

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDdMmYy(parts: { year: number; month: number; day: number }): string {
  return `${pad2(parts.day)}/${pad2(parts.month)}/${String(parts.year).slice(-2)}`;
}

/** CMS date label: always day/month/year, e.g. 12/09/26. */
export function formatCmsDate(dateString?: string | null): string {
  if (!dateString) return "";
  const date = parseEventDate(dateString);
  if (!date) return "";
  return formatDdMmYy(zonedDateParts(date));
}

/** CMS date range: 12/09/26 or 12/09/26 – 12/12/26. */
export function formatCmsDateRange(
  startString?: string | null,
  endString?: string | null,
): string {
  const start = startString ? parseEventDate(startString) : null;
  const end = endString ? parseEventDate(endString) : null;
  const startLabel = formatCmsDate(startString);
  if (!start || !end || end.getTime() <= start.getTime() || isSameZonedDay(start, end)) {
    return startLabel;
  }
  return `${startLabel} \u2013 ${formatCmsDate(endString)}`;
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

/** Calendar line: compact range for multi-day events, short weekday for a single day. */
export function formatEventCalendarLine(
  startString?: string | null,
  endString?: string | null,
): string {
  const start = startString ? parseEventDate(startString) : null;
  if (!start) return "";

  const end = endString ? parseEventDate(endString) : null;
  if (end && end.getTime() > start.getTime() && !isSameZonedDay(start, end)) {
    return formatDateRange(startString, endString);
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

/**
 * City/country vs street address for a retreat. Older documents stored
 * "Saranda, Albania" in `location` alone; that value becomes city/country and
 * leaves address empty until one is added.
 */
export function splitRetreatPlace(retreat: {
  cityCountry?: string | null;
  location?: string | null;
}): { cityCountry?: string; location?: string } {
  const city = retreat.cityCountry?.trim() || undefined;
  const address = retreat.location?.trim() || undefined;

  if (city) {
    const same = address && address.toLowerCase() === city.toLowerCase();
    return {
      cityCountry: city,
      ...(address && !same ? { location: address } : {}),
    };
  }

  if (!address) return {};

  const inferred = cityCountryFromLocation(address);
  if (inferred && inferred.toLowerCase() === address.toLowerCase()) {
    return { cityCountry: inferred };
  }

  return {
    ...(inferred ? { cityCountry: inferred } : {}),
    location: address,
  };
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

/** Public label for an event or retreat type, shown next to the city. */
export function eventTypeTag(category?: string | null): string {
  const value = (category ?? "").trim().toLowerCase();
  if (value === "free session" || value === "free offering") return "Free Offering";
  if (
    value === "modular workshop" ||
    value === "module" ||
    value === "module system"
  ) {
    return "Module System Workshop";
  }
  if (value === "retreat") return "Retreat";
  return "Workshop";
}

/** Public page for a listing: retreats keep their own URL. */
export function eventDetailPath(event: {
  slug?: string | null;
  category?: string | null;
}): string | undefined {
  if (!event.slug) return undefined;
  if ((event.category ?? "").trim().toLowerCase() === "retreat") {
    return `/retreats/${event.slug}`;
  }
  return `/events/${event.slug}`;
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

type RegistrationEventInput = {
  title: string;
  slug?: string | null;
  location?: string | null;
  cityCountry?: string | null;
  date?: string | null;
  endDate?: string | null;
  sessions?: EventSessionInput[] | null;
  time?: string | null;
  description?: string | null;
  category?: string | null;
  registrationLink?: string | null;
};

/** Full event label for registration links and notification emails. */
export function formatRegistrationEventLabel(
  event: RegistrationEventInput,
): string {
  const title = event.title.trim();
  const location = eventLocationShort(event.location, event.cityCountry);
  const dates = formatRegistrationEventDates(
    event.date,
    event.endDate ?? resolveEventCardEndDate(event),
  );

  if (location && dates) return `${title}, ${location} (${dates})`;
  if (location) return `${title}, ${location}`;
  if (dates) return `${title} (${dates})`;
  return title;
}

/** Registration URL, including the event slug so Free Sessions get the short form. */
export function eventRegisterHref(event: RegistrationEventInput): string {
  const params = new URLSearchParams({
    event: formatRegistrationEventLabel(event),
  });
  if (event.slug) params.set("slug", event.slug);
  const kind = registrationKindFromCategory(event.category);
  if (kind && kind !== "workshop") params.set("kind", kind);
  return `/register?${params.toString()}`;
}

/** Retreat Register buttons always use Retreat Registration from the CMS. */
export function retreatRegisterHref(retreat: RegistrationEventInput): string {
  const params = new URLSearchParams({
    event: formatRegistrationEventLabel(retreat),
    kind: "retreat",
  });
  if (retreat.slug) params.set("slug", retreat.slug);
  return `/register?${params.toString()}`;
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

function webAddressDate(date?: string | null): string {
  if (!date) return "";
  const trimmed = date.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  return toDateInputValue(date);
}

/**
 * Public /events/ address from the session/program, optional marker, city, and first day
 * (e.g. yogasanas-tirane-2026-09-25, or eye-care-practices-module-tirane-2026-09-30).
 */
export function eventWebAddress(
  title?: string | null,
  cityCountry?: string | null,
  date?: string | null,
  infix?: string | null,
): string {
  const city = eventLocationShort(undefined, cityCountry);
  return slugifySegment(
    [title?.trim(), infix?.trim(), city, webAddressDate(date)]
      .filter(Boolean)
      .join(" "),
  );
}

/**
 * Public /retreats/ address from the city, the word “retreat”, and first day
 * (e.g. saranda-retreat-2026-09-10).
 */
export function retreatWebAddress(
  cityCountry?: string | null,
  date?: string | null,
): string {
  const city = eventLocationShort(undefined, cityCountry);
  return slugifySegment(
    [city, "retreat", webAddressDate(date)].filter(Boolean).join(" "),
  );
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

/** Short card copy: intro only, one paragraph per break in the CMS short description. */
export function eventCardSummaryParagraphs(description?: string | null): string[] {
  if (!description) return [];

  return stripEventDescriptionExtras(description)
    .split(/\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
}

/** Short card copy as a single string. Prefer eventCardSummaryParagraphs on cards. */
export function eventCardSummary(description?: string | null): string {
  return eventCardSummaryParagraphs(description).join(" ");
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

const SESSION_HOURS_RANGE =
  /(\d{1,2})[.:](\d{2})\s*[–—−-]\s*(\d{1,2})[.:](\d{2})/g;

function padHour(hourText: string): string {
  return hourText.padStart(2, "0");
}

/**
 * One shape for every session time range: 07:30 – 08:45.
 * Typed hyphens, missing spaces, and unpadded hours are brought in line.
 */
export function formatSessionHoursRange(hours: string): string {
  const trimmed = hours.trim();
  if (!trimmed) return "";

  return formatSessionTimingsTo24Hour(trimmed).replace(
    SESSION_HOURS_RANGE,
    (_, startHour, startMinute, endHour, endMinute) =>
      `${padHour(startHour)}:${startMinute} – ${padHour(endHour)}:${endMinute}`,
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
      return [{ day: match[1].trim(), hours: formatSessionHoursRange(match[2]) }];
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

const MAX_AUTO_SESSION_DAYS = 14;

/** "12 September" or "12 September 2026" from a YYYY-MM-DD date input. */
export function sessionDayLabel(
  ymd?: string | null,
  includeYear = false,
): string {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return "";
  const date = new Date(`${ymd}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    ...(includeYear ? { year: "numeric" as const } : {}),
    timeZone: "UTC",
  }).format(date);
}

/**
 * One session-day label per calendar day between First Day and Last Day.
 * Empty when the span is a single day or longer than a typical workshop, so a
 * far-future last day does not create dozens of rows.
 */
export function sessionDayLabelsBetween(
  startYmd?: string | null,
  endYmd?: string | null,
): string[] {
  if (
    !startYmd ||
    !endYmd ||
    !/^\d{4}-\d{2}-\d{2}$/.test(startYmd) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(endYmd)
  ) {
    return [];
  }

  const start = new Date(`${startYmd}T12:00:00.000Z`);
  const end = new Date(`${endYmd}T12:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
  if (end.getTime() <= start.getTime()) return [];

  const includeYear = startYmd.slice(0, 4) !== endYmd.slice(0, 4);
  const labels: string[] = [];
  const cursor = new Date(start);

  while (cursor.getTime() <= end.getTime()) {
    const ymd = cursor.toISOString().slice(0, 10);
    labels.push(sessionDayLabel(ymd, includeYear));
    if (labels.length > MAX_AUTO_SESSION_DAYS) return [];
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return labels.length >= 2 ? labels : [];
}

/** Session day labels for the start/end span, including a single-day event. */
export function sessionDayLabelsForSpan(
  startYmd?: string | null,
  endYmd?: string | null,
): string[] {
  const range = sessionDayLabelsBetween(startYmd, endYmd);
  if (range.length > 0) return range;
  const single = sessionDayLabel(startYmd);
  return single ? [single] : [];
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
        hours: formatSessionHoursRange(session.hours ?? "") || undefined,
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
 * Last calendar day for display. First Day / Last Day on the form win.
 * Session rows are only used when Last day was left blank.
 */
export function resolveEventCardEndDate(event: {
  date?: string | null;
  endDate?: string | null;
  sessions?: EventSessionInput[] | null;
  time?: string | null;
  description?: string | null;
}): string | undefined {
  if (event.endDate) return event.endDate;

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

  return undefined;
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

