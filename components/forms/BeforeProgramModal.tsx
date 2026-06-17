"use client";

import { useEffect } from "react";

import {
  BLOCK_ICONS,
  IconGuidelines,
  SECTION_ICONS,
} from "@/lib/guideline-icons";
import {
  BEFORE_PROGRAM_DOCUMENT,
  BEFORE_PROGRAM_TITLE,
  type GuidelineBlock,
} from "@/lib/register-content";
import {
  GUIDELINES_PDF_FILENAME,
  GUIDELINES_PDF_URL,
} from "@/lib/guidelines-pdf.constants";

interface BeforeProgramModalProps {
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
              const SectionIcon = SECTION_ICONS[sectionIndex] ?? SECTION_ICONS[0];
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

        <div className="border-t border-border bg-cream/60 px-6 py-4 sm:px-8">
          <a
            href={GUIDELINES_PDF_URL}
            download={GUIDELINES_PDF_FILENAME}
            className="text-sm font-medium text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}
