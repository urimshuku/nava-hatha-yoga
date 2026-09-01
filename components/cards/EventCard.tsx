import Image from "next/image";
import Link from "next/link";
import type { ElementType, ReactNode } from "react";

import { EventShareButton } from "@/components/cards/EventShareButton";
import { Button } from "@/components/ui/Button";
import { getProgramIntensity } from "@/lib/constants";
import { programSymbolSrc } from "@/lib/local-images";
import {
  cn,
  eventAnchorId,
  eventCardSummaryParagraphs,
  eventLocationBadge,
  eventRegisterHref,
  formatEventCalendarLine,
  formatEventDateBadge,
  formatSessionHoursRange,
  normalizeEventSessionSchedule,
  resolveEventCardEndDate,
} from "@/lib/utils";
import type { YogaEvent } from "@/lib/cms/content-types";

interface EventCardProps {
  event: YogaEvent;
  experienceNote?: string;
  /** Use 1 on the session page; 2 on /events; 3 under a section heading. */
  headingLevel?: 1 | 2 | 3;
  /** Link the whole card to the session page when a slug exists. */
  linkTitle?: boolean;
  showRegistration?: boolean;
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-clay" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-clay" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-clay" aria-hidden="true">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconIntensity() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-clay" aria-hidden="true">
      <path d="M6 16v2M12 11v7M18 6v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconAge() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-clay" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 16h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconExperience() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-clay" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 12.5 10.5 15 16 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="5.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="18.5" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconPrice() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-clay" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M18.09 10.37A6 6 0 1 1 10.34 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M7 6h1.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 14h1.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function EventDetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 gap-2.5 text-sm text-brown">
      <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 flex-1 leading-snug">
        <span className="sr-only">{label}: </span>
        {children}
      </span>
    </div>
  );
}

function isSessionDateLine(line: string): boolean {
  return /^\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+\d{4})?:\s*.+$/i.test(
    line,
  );
}

function isSessionTimeLine(line: string): boolean {
  return /^\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}/.test(line);
}

function EventTimeBlock({ time }: { time: string }) {
  const normalized = normalizeEventSessionSchedule(time);
  const mandatoryMatch = normalized.match(/\n\s*(All\s+\d+\s+sessions\b[^\n]*)/i);
  const mandatoryPart = mandatoryMatch?.[1]?.trim();
  const schedulePart = mandatoryMatch
    ? normalized.slice(0, mandatoryMatch.index).trim()
    : normalized;

  type DayGroup = { day: string; hours: string[] };
  const dayGroups: DayGroup[] = [];
  const extraLines: string[] = [];

  for (const line of schedulePart.split("\n").map((entry) => entry.trim()).filter(Boolean)) {
    if (/^duration:/i.test(line)) {
      extraLines.push(line);
      continue;
    }

    if (isSessionDateLine(line)) {
      const match = line.match(
        /^(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+\d{4})?):\s*(.+)$/i,
      );
      if (!match) continue;

      const day = match[1].trim();
      const hours = formatSessionHoursRange(match[2]);
      const lastGroup = dayGroups[dayGroups.length - 1];

      if (lastGroup?.day === day) {
        lastGroup.hours.push(hours);
      } else {
        dayGroups.push({ day, hours: [hours] });
      }
      continue;
    }

    const lastGroup = dayGroups[dayGroups.length - 1];
    if (lastGroup && isSessionTimeLine(line)) {
      lastGroup.hours.push(formatSessionHoursRange(line));
    }
  }

  if (dayGroups.length === 0) {
    return <span className="whitespace-pre-line leading-relaxed">{normalized}</span>;
  }

  return (
    <div>
      {extraLines.length > 0 ? (
        <p className="mb-2 leading-snug">{extraLines.join("\n")}</p>
      ) : null}
      <ul className="space-y-1">
        {dayGroups.map((group) => (
          <li key={group.day}>
            {group.hours.map((hours, index) => (
              <div
                key={`${group.day}-${hours}-${index}`}
                className="grid grid-cols-[minmax(6.5rem,7.75rem)_1fr] gap-x-3 sm:grid-cols-[8rem_1fr] sm:gap-x-4"
              >
                <span>{index === 0 ? `${group.day}:` : ""}</span>
                <span className="tabular-nums">{hours}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
      {mandatoryPart ? <p className="mt-3 leading-snug">{mandatoryPart}</p> : null}
    </div>
  );
}

export function EventCard({
  event,
  experienceNote,
  headingLevel = 3,
  linkTitle = true,
  showRegistration = true,
}: EventCardProps) {
  const TitleTag = `h${headingLevel}` as ElementType;
  const displayEndDate = resolveEventCardEndDate(event);
  const dateBadge = formatEventDateBadge(event.date, displayEndDate);
  const locationBadge = eventLocationBadge(event.location, event.cityCountry);
  const summaryParagraphs = eventCardSummaryParagraphs(event.description);
  const shareAnchorId = eventAnchorId(event._id);
  const programSlug = event.relatedProgram?.slug;
  const symbolSrc = programSlug ? programSymbolSrc(programSlug) : null;
  const intensity =
    event.intensity?.trim() ||
    event.relatedProgram?.intensity ||
    getProgramIntensity(programSlug);
  const experienceLabel =
    event.yogaExperience?.trim() ||
    experienceNote?.trim() ||
    (intensity ? "No prior yoga experience required!" : undefined);
  const sessionHref =
    linkTitle && event.slug ? `/events/${event.slug}` : undefined;

  return (
    <article
      id={shareAnchorId}
      className={cn(
        "relative scroll-mt-24 overflow-hidden rounded-xl border border-border bg-ivory shadow-soft transition-shadow duration-300 ease-calm hover:shadow-card sm:scroll-mt-28",
        sessionHref && "group",
      )}
    >
      {sessionHref ? (
        <Link
          href={sessionHref}
          className="absolute inset-0 z-0"
          aria-label={`View ${event.title}`}
        />
      ) : null}
      <div className="p-4 sm:p-7">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          {locationBadge ? (
            <span className="inline-flex rounded-full bg-sand px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-brown">
              {locationBadge}
            </span>
          ) : event.category ? (
            <span className="inline-flex rounded-full bg-sand px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-brown">
              {event.category}
            </span>
          ) : (
            <span />
          )}

          {dateBadge ? (
            <div className="shrink-0 text-right leading-none">
              <p className="font-heading text-2xl text-gold sm:text-4xl">{dateBadge.days}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-brown">
                {dateBadge.monthYear}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center gap-2.5 sm:mt-5 sm:gap-3">
          {symbolSrc ? (
            <Image
              src={symbolSrc}
              alt=""
              aria-hidden="true"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 object-contain opacity-90"
            />
          ) : null}
          <TitleTag className="font-heading text-xl text-charcoal transition-colors group-hover:text-saffron sm:text-[1.75rem]">
            {event.title}
          </TitleTag>
        </div>

        {summaryParagraphs.length > 0 ? (
          <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-brown sm:mt-4 sm:text-[0.95rem]">
            {summaryParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-8">
          <div className="space-y-2.5 sm:space-y-3">
            {event.date ? (
              <EventDetailRow icon={<IconCalendar />} label="Date">
                {formatEventCalendarLine(event.date, displayEndDate)}
              </EventDetailRow>
            ) : null}
            {event.location ? (
              <EventDetailRow icon={<IconPin />} label="Address">
                <span className="whitespace-pre-line">{event.location}</span>
              </EventDetailRow>
            ) : null}
            {event.ageRequirement ? (
              <EventDetailRow icon={<IconAge />} label="Age">
                Age: {event.ageRequirement}
              </EventDetailRow>
            ) : null}
            {intensity ? (
              <EventDetailRow icon={<IconIntensity />} label="Intensity">
                Intensity: {intensity}
              </EventDetailRow>
            ) : null}
            {experienceLabel ? (
              <EventDetailRow icon={<IconExperience />} label="Experience">
                {experienceLabel}
              </EventDetailRow>
            ) : null}
          </div>

          {event.time ? (
            <div className="sm:pt-0">
              <EventDetailRow icon={<IconClock />} label="Time">
                <EventTimeBlock time={event.time} />
              </EventDetailRow>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-7 sm:py-4">
        {event.priceLabel || event.paymentNote ? (
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-heading text-lg text-charcoal sm:text-xl">
            {event.priceLabel ? (
              <span className="inline-flex items-center gap-2">
                <IconPrice />
                <span>{event.priceLabel}</span>
              </span>
            ) : null}
            {event.paymentNote ? (
              <span className="font-sans text-[11px] font-normal leading-snug text-brown/75">
                ({event.paymentNote})
              </span>
            ) : null}
          </p>
        ) : (
          <span className="hidden sm:block" />
        )}

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-3">
          <div className="flex shrink-0 gap-2">
            {programSlug ? (
              <Button
                href={`/programs/${programSlug}`}
                variant="secondary"
                size="sm"
                className="px-3"
                aria-label="About the Program"
              >
                <IconMore />
              </Button>
            ) : null}
            <EventShareButton
              title={`${event.title} · Nava Hatha Yoga`}
              path={event.slug ? `/events/${event.slug}` : `/events#${shareAnchorId}`}
            />
          </div>
          {showRegistration ? (
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                href={eventRegisterHref(event)}
                size="sm"
              >
                Register
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
