"use client";

import { useEffect, type ComponentType, type SVGProps } from "react";

import {
  BEFORE_PROGRAM_DOCUMENT,
  BEFORE_PROGRAM_TITLE,
  type GuidelineBlock,
} from "@/lib/register-content";

interface BeforeProgramModalProps {
  open: boolean;
  onClose: () => void;
}

type IconProps = SVGProps<SVGSVGElement>;

function iconClass(size: "lg" | "sm" = "lg") {
  return size === "lg"
    ? "h-6 w-6 shrink-0 text-clay"
    : "h-5 w-5 shrink-0 text-clay";
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

function IconGuidelines(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("lg")} aria-hidden="true" {...props}>
      <path d="M7 4h10v16H7z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconBeforeStart(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("lg")} aria-hidden="true" {...props}>
      <path
        d="M12 19V5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M8.5 8.5 12 5l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDuringSession(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("lg")} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAfterProgram(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("lg")} aria-hidden="true" {...props}>
      <path
        d="M12 3.5 19 6v5.5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m8.5 12.5 2 2 5-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStomach(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <path
        d="M6 10c0-2.2 2.7-4 6-4s6 1.8 6 4c0 3.5-2.5 6-6 8-3.5-2-6-4.5-6-8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 10h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconClothing(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <path
        d="M7.5 5h3.5l-.8 14.5a1.5 1.5 0 0 0 2.1 1.4L11 7.5V5H7.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M13 5h3.5l.8 14.5a1.5 1.5 0 0 1-2.1 1.4L13 7.5V5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 7h3.5M13 7h3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPunctuality(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 12V6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBelongings(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <path
        d="M7 9V7.5A2.5 2.5 0 0 1 12 7.5 2.5 2.5 0 0 1 17 7.5V9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect x="5" y="9" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 14h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconWater(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <path
        d="M12 4.5c2.5 3.5 5 6.3 5 9a5 5 0 1 1-10 0c0-2.7 2.5-5.5 5-9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMindfulness(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5 12c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5M5 12c1.5 3 4 4.5 7 4.5s5.5-1.5 7-4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconQuestions(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9.5 9.2a2.7 2.7 0 0 1 4.6 1.9c0 1.7-2.1 2.4-2.1 3.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17.2" r="0.8" fill="currentColor" />
    </svg>
  );
}

function IconSupport(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 8.5v7M8.5 12h7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconConfidentiality(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <rect x="6" y="10" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9 10V8a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconDignity(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <path
        d="M12 4.5c2.8 0 5 2.6 5 6s-2.2 9-5 9.5c-2.8-.5-5-5.5-5-9.5s2.2-6 5-6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.5v8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconNoMusic(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <path
        d="M9.5 16.5V7.5l7-2v9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="16.5" r="1.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="m5 5 14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconTemperature(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <path
        d="M10 4.5h4v11.8a3.2 3.2 0 1 1-4 0V4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="17.8" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 8.5v5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M10.5 11h3M10.5 13.5h3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconNutrition(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass("sm")} aria-hidden="true" {...props}>
      <path
        d="M12 19.5c-3.5-2.5-6.5-5-6.5-8.2a3.7 3.7 0 0 1 6.5-2.5 3.7 3.7 0 0 1 6.5 2.5c0 3.2-3 5.7-6.5 8.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SECTION_ICONS = [IconBeforeStart, IconDuringSession, IconAfterProgram];

const BLOCK_ICONS: Record<string, ComponentType<IconProps>> = {
  "Empty or slightly full stomach": IconStomach,
  "Clothing & Accessories": IconClothing,
  Punctuality: IconPunctuality,
  "Shoes, Bags & Phones": IconBelongings,
  Water: IconWater,
  "Mindfulness in the Classroom": IconMindfulness,
  Questions: IconQuestions,
  "Accompaniment & Support": IconSupport,
  "Confidentiality of the Practice": IconConfidentiality,
  "Dignity of the Practice": IconDignity,
  "No Music During Practice": IconNoMusic,
  "Room Temperature": IconTemperature,
  "Prana & Nutrition": IconNutrition,
};

function GuidelineBlockView({ block }: { block: GuidelineBlock }) {
  const BlockIcon = BLOCK_ICONS[block.heading] ?? IconGuidelines;

  return (
    <div>
      <h4 className="flex items-center gap-2 font-heading text-lg text-charcoal">
        <BlockIcon />
        <span>{block.heading}</span>
      </h4>
      {block.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-1.5 text-sm leading-relaxed text-brown">
          {paragraph}
        </p>
      ))}
      {block.lists?.map((list) => (
        <div key={list.label ?? list.items.join("|")} className="mt-2.5">
          {list.label ? (
            <p className="text-sm font-medium text-charcoal">{list.label}</p>
          ) : null}
          <ul className="mt-1.5 space-y-1.5">
            {list.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed text-brown"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function BeforeProgramModal({ open, onClose }: BeforeProgramModalProps) {
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
      aria-labelledby="before-program-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-ivory shadow-card">
        <div className="flex items-start justify-between gap-4 border-b border-border bg-cream/60 px-6 py-5 sm:px-8">
          <h2
            id="before-program-title"
            className="font-heading text-2xl text-charcoal"
          >
            {BEFORE_PROGRAM_TITLE}
          </h2>
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
            {BEFORE_PROGRAM_DOCUMENT.map((section, sectionIndex) => {
              const SectionIcon = SECTION_ICONS[sectionIndex] ?? IconBeforeStart;
              return (
                <section
                  key={section.title}
                  className={
                    sectionIndex > 0 ? "mt-4 border-t border-border pt-9" : undefined
                  }
                >
                  <h3 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-charcoal">
                    <SectionIcon />
                    <span>{section.title}</span>
                  </h3>
                  <div className="mt-5 space-y-5">
                    {section.blocks.map((block) => (
                      <GuidelineBlockView key={block.heading} block={block} />
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
