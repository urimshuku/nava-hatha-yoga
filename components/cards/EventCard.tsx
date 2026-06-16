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

function EventTimeBlock({ time }: { time: string }) {
  const chunks = time.trim().split(/\n\s*\n/);
  const schedulePart = chunks[0] ?? "";
  const mandatoryPart = chunks[1]?.trim();

  const sessions = schedulePart
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      return match ? { day: match[1].trim(), hours: match[2].trim() } : null;
    })
    .filter((session): session is { day: string; hours: string } => session !== null);

  if (sessions.length === 0) {
    return <span className="whitespace-pre-line leading-relaxed">{time}</span>;
  }

  return (
    <div>
      <ul className="space-y-1">
        {sessions.map((session) => (
          <li
            key={session.day}
            className="grid grid-cols-[minmax(4.75rem,5.75rem)_1fr] gap-x-4 sm:grid-cols-[6.25rem_1fr]"
          >
            <span>{session.day}:</span>
            <span>{session.hours}</span>
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
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
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
              <p className="font-heading text-3xl text-gold sm:text-4xl">{dateBadge.days}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-brown">
                {dateBadge.monthYear}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex items-center gap-3">
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
          <h3 className="font-heading text-2xl text-charcoal sm:text-[1.75rem]">{event.title}</h3>
        </div>

        {summary ? (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-brown sm:text-[0.95rem]">
            {summary}
          </p>
        ) : null}

        <dl className="mt-5 grid gap-6 sm:grid-cols-2 sm:gap-8">
          <div className="space-y-3">
            {event.date ? (
              <EventDetailRow icon={<IconCalendar />} label="Date">
                {formatEventCalendarLine(event.date, event.endDate)}
              </EventDetailRow>
            ) : null}
            {event.location ? (
              <EventDetailRow icon={<IconPin />} label="Location">
                {event.location}
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
          <div className="mt-5 rounded-lg border border-border/70 bg-cream/60 px-4 py-3.5 sm:px-5">
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

      <div className="flex flex-col gap-4 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        {event.priceLabel || event.paymentNote ? (
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-heading text-xl text-charcoal">
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

        <div className="flex flex-wrap gap-3 sm:justify-end">
          {event.registrationLink ? (
            <Button href={event.registrationLink} size="sm">
              Register
            </Button>
          ) : null}
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
