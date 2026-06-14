import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { SanityImage } from "@/components/ui/SanityImage";
import { whatsappLink } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
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

export function EventCard({ event, whatsappNumber }: EventCardProps) {
  const waMessage = `Hello, I'd like to register for "${event.title}".`;
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`
    : whatsappLink(waMessage);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-ivory shadow-soft transition-shadow duration-300 ease-calm hover:shadow-card">
      <div className="relative aspect-[16/9] overflow-hidden">
        <SanityImage
          image={event.image}
          alt={event.title}
          width={720}
          height={405}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-full w-full object-cover"
        />
        {event.category ? (
          <span className="absolute left-4 top-4 inline-flex rounded-full bg-cream/90 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brown backdrop-blur-sm">
            {event.category}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-2xl text-charcoal">{event.title}</h3>

        {event.relatedProgram?.title ? (
          event.relatedProgram.slug ? (
            <Link
              href={`/programs/${event.relatedProgram.slug}`}
              className="mt-1 inline-flex w-fit text-sm font-medium text-saffron hover:text-saffron-hover"
            >
              {event.relatedProgram.title}
            </Link>
          ) : (
            <span className="mt-1 text-sm font-medium text-brown">
              {event.relatedProgram.title}
            </span>
          )
        ) : null}

        <dl className="mt-4 space-y-2 text-sm text-brown">
          {event.date ? (
            <div className="flex items-center gap-2.5">
              <dt className="contents">
                <IconCalendar />
                <span className="sr-only">Date</span>
              </dt>
              <dd>{formatDate(event.date)}</dd>
            </div>
          ) : null}
          {event.time ? (
            <div className="flex items-center gap-2.5">
              <dt className="contents">
                <IconClock />
                <span className="sr-only">Time</span>
              </dt>
              <dd>{event.time}</dd>
            </div>
          ) : null}
          {event.location ? (
            <div className="flex items-center gap-2.5">
              <dt className="contents">
                <IconPin />
                <span className="sr-only">Location</span>
              </dt>
              <dd>{event.location}</dd>
            </div>
          ) : null}
          {event.teacher ? (
            <div className="flex items-center gap-2.5">
              <dt className="contents">
                <IconUser />
                <span className="sr-only">Teacher</span>
              </dt>
              <dd>{event.teacher}</dd>
            </div>
          ) : null}
        </dl>

        {event.description ? (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-brown">
            {event.description}
          </p>
        ) : null}

        {event.priceLabel ? (
          <p className="mt-4 text-sm font-medium text-charcoal">{event.priceLabel}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3 pt-2">
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
