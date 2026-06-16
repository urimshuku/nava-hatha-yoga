"use client";

import { useEffect } from "react";

import {
  MEDICAL_DISCLAIMER_DOCUMENT,
  type DisclaimerItem,
} from "@/lib/register-content";

interface MedicalDisclaimerModalProps {
  open: boolean;
  onClose: () => void;
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMedical() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6 shrink-0 text-clay"
      aria-hidden="true"
    >
      <path
        d="M12 20.5S4 15.5 4 9.6A4.1 4.1 0 0 1 12 7.8 4.1 4.1 0 0 1 20 9.6c0 5.9-8 10.9-8 10.9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 13h2l1-2.5L12 15l1.5-3 1 1h2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6 shrink-0 text-clay"
      aria-hidden="true"
    >
      <path
        d="M12 3.5 19 6v5.5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <rect
        x="9.25"
        y="11"
        width="5.5"
        height="4.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10.4 11v-1.1a1.6 1.6 0 0 1 3.2 0V11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SECTION_ICONS = [IconMedical, IconShield];

function DisclaimerItemBlock({ item, index }: { item: DisclaimerItem; index: number }) {
  return (
    <div>
      <h4 className="font-heading text-lg text-charcoal">
        {index}. {item.title}
      </h4>
      {item.lead ? (
        <p className="mt-1.5 text-sm leading-relaxed text-brown">{item.lead}</p>
      ) : null}
      {item.points && item.points.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {item.points.map((point) => (
            <li
              key={point}
              className="flex gap-3 text-sm leading-relaxed text-brown"
            >
              <span
                aria-hidden="true"
                className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.contact ? (
        <div className="mt-2 text-sm leading-relaxed text-brown">
          <p className="font-medium text-charcoal">{item.contact.name}</p>
          <p>
            <a
              href={`mailto:${item.contact.email}`}
              className="text-saffron underline underline-offset-2 hover:text-saffron-hover"
            >
              {item.contact.email}
            </a>
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function MedicalDisclaimerModal({ open, onClose }: MedicalDisclaimerModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-ivory shadow-card">
        <div className="flex items-start justify-between gap-4 border-b border-border bg-cream/60 px-6 py-5 sm:px-8">
          <div>
            <h2
              id="disclaimer-title"
              className="font-heading text-2xl text-charcoal"
            >
              Medical Acknowledgement & Liability Disclaimer
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong bg-ivory text-charcoal transition-colors duration-300 hover:bg-sand/60 hover:text-saffron focus-visible:outline-none"
          >
            <IconClose />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <div className="space-y-9">
            {MEDICAL_DISCLAIMER_DOCUMENT.map((section, sectionIndex) => {
              const SectionIcon = SECTION_ICONS[sectionIndex] ?? IconMedical;
              return (
              <section
                key={section.title}
                className={
                  sectionIndex > 0 ? "mt-4 border-t border-border pt-9" : undefined
                }
              >
                <h3 className="flex items-center gap-2.5 font-heading text-xl text-charcoal">
                  <SectionIcon />
                  <span>{section.title}</span>
                </h3>
                {section.intro ? (
                  <p className="mt-2 text-sm italic leading-relaxed text-brown">
                    {section.intro}
                  </p>
                ) : null}
                <div className="mt-5 space-y-5">
                  {section.items.map((item, i) => (
                    <DisclaimerItemBlock
                      key={item.title}
                      item={item}
                      index={i + 1}
                    />
                  ))}
                </div>
              </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
