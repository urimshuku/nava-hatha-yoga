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
  return new Intl.DateTimeFormat("en-GB", options).format(date);
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
  const start = startString ? new Date(startString) : null;
  const end = endString ? new Date(endString) : null;

  if (!start || Number.isNaN(start.getTime())) return formatDate(startString);
  if (!end || Number.isNaN(end.getTime()) || end.getTime() <= start.getTime()) {
    return formatDate(startString);
  }

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    const startDay = new Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(start);
    const endPart = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(end);
    return `${startDay}\u2013${endPart}`;
  }

  if (sameYear) {
    const startPart = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
    }).format(start);
    const endPart = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(end);
    return `${startPart} \u2013 ${endPart}`;
  }

  return `${formatDate(startString)} \u2013 ${formatDate(endString)}`;
}

const EVENT_TIMEZONE = "Europe/Tirane";

function parseEventDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date;
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

  if (end && end.getTime() > start.getTime()) {
    const sameMonth =
      start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

    if (sameMonth) {
      const startDay = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        timeZone: EVENT_TIMEZONE,
      }).format(start);
      const endDay = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        timeZone: EVENT_TIMEZONE,
      }).format(end);
      return { days: `${startDay}\u2013${endDay}`, monthYear };
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

  if (end && end.getTime() > start.getTime()) {
    const sameMonth =
      start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

    if (sameMonth) {
      const startDay = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        timeZone: EVENT_TIMEZONE,
      }).format(start);
      const endDay = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        timeZone: EVENT_TIMEZONE,
      }).format(end);
      const monthYear = new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
        timeZone: EVENT_TIMEZONE,
      }).format(end);

      const weekdays =
        weekday(start) === weekday(end) ? weekday(start) : `${weekday(start)}\u2013${weekday(end)}`;

      return `${weekdays}, ${startDay}\u2013${endDay} ${monthYear}`;
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

  if (end && end.getTime() > start.getTime()) {
    const sameMonth =
      start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

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

/** Subtle, shared Framer Motion variants. Respects reduced-motion via CSS. */
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};
