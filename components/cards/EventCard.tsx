import Image from "next/image";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/constants";
import { programSymbolSrc } from "@/lib/local-images";
import {
  eventCardSummary,
  eventLocationBadge,
  formatEventCalendarLine,
  formatEventDateBadge,
  formatSessionTimingsTo24Hour,
} from "@/lib/utils";
import type { YogaEvent } from "@/sanity/lib/types";

interface EventCardProps {
  event: YogaEvent;
  whatsappNumber?: string;
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

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-clay" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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
  const chunks = formatSessionTimingsTo24Hour(time).trim().split(/\n\s*\n/);
  const schedulePart = chunks[0] ?? "";
  const mandatoryPart = chunks[1]?.trim();

  type DayGroup = { day: string; hours: string[] };
  const dayGroups: DayGroup[] = [];

  for (const line of schedulePart.split("\n").map((entry) => entry.trim()).filter(Boolean)) {
    if (isSessionDateLine(line)) {
      const match = line.match(
        /^(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+\d{4})?):\s*(.+)$/i,
      );
      if (!match) continue;

      const day = match[1].trim();
      const hours = match[2].trim();
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
      lastGroup.hours.push(line);
    }
  }

  if (dayGroups.length === 0) {
    return <span className="whitespace-pre-line leading-relaxed">{time}</span>;
  }

  return (
    <div>
      <ul className="space-y-1">
        {dayGroups.map((group) => (
          <li key={group.day}>
            {group.hours.map((hours, index) => (
              <div
                key={`${group.day}-${hours}-${index}`}
                className="grid grid-cols-[minmax(6.5rem,7.75rem)_1fr] gap-x-3 sm:grid-cols-[8rem_1fr] sm:gap-x-4"
              >
                <span>{index === 0 ? `${group.day}:` : ""}</span>
                <span>{hours}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
      {mandatoryPart ? <p className="mt-3 leading-snug">{mandatoryPart}</p> : null}
    </div>
  );
}

export function EventCard({ event, whatsappNumber }: EventCardProps) {
  const waMessage = `Hello, I'd like to register for "${event.title}".`;
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`
    : whatsappLink(waMessage);

  const dateBadge = formatEventDateBadge(event.date, event.endDate);
  const locationBadge = eventLocationBadge(event.location);
  const summary = eventCardSummary(event.description);
  const programSlug = event.relatedProgram?.slug;
  const symbolSrc = programSlug ? programSymbolSrc(programSlug) : null;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-ivory shadow-soft transition-shadow duration-300 ease-calm hover:shadow-card">
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
          <h3 className="font-heading text-xl text-charcoal sm:text-[1.75rem]">{event.title}</h3>
        </div>

        {summary ? (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brown sm:mt-4 sm:text-[0.95rem]">
            {summary}
          </p>
        ) : null}

        <dl className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-8">
          <div className="space-y-2.5 sm:space-y-3">
            {event.date ? (
              <EventDetailRow icon={<IconCalendar />} label="Date">
                {formatEventCalendarLine(event.date, event.endDate)}
              </EventDetailRow>
            ) : null}
            {event.location ? (
              <EventDetailRow icon={<IconPin />} label="Location">
                <span className="whitespace-pre-line">{event.location}</span>
              </EventDetailRow>
            ) : null}
            {event.ageRequirement ? (
              <EventDetailRow icon={<IconAge />} label="Age">
                Age: {event.ageRequirement}
              </EventDetailRow>
            ) : null}
            {event.teacher ? (
              <EventDetailRow icon={<IconUser />} label="Teacher">
                Taught by {event.teacher}
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
        </dl>

        {event.notes && event.notes.length > 0 ? (
          <div className="mt-4 rounded-lg border border-border/70 bg-cream/60 px-3.5 py-3 sm:mt-5 sm:px-5 sm:py-3.5">
            <ul className="space-y-2">
              {event.notes.map((note) => (
                <li
                  key={note}
                  className="flex gap-3 text-sm leading-relaxed text-charcoal/90"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                  />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-7 sm:py-4">
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
          <span />
        )}

        <div className="flex flex-wrap gap-2 sm:gap-3 sm:justify-end">
          <Button
            href={`/register?event=${encodeURIComponent(event.title)}`}
            size="sm"
          >
            Register
          </Button>
          {event.whatsappEnabled !== false ? (
            <Button href={waHref} variant="secondary" size="sm">
              Register via WhatsApp
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
