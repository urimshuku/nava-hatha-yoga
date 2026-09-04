"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

interface TeacherStoryModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  paragraphs: readonly string[];
  examplesHeading?: string;
  examples?: readonly string[];
  titleId?: string;
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

export function TeacherStoryModal({
  open,
  onClose,
  title,
  paragraphs,
  examplesHeading,
  examples,
  titleId = "teacher-story-title",
}: TeacherStoryModalProps) {
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

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-ivory shadow-card">
        <div className="flex items-start justify-between gap-4 border-b border-border bg-cream/60 px-6 py-5 sm:px-8">
          <h2 id={titleId} className="font-heading text-2xl text-charcoal">
            {title}
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

        <div className="overflow-y-auto px-6 py-6 text-left sm:px-8">
          <div className="space-y-5 font-heading text-lg leading-relaxed text-brown">
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={index === 0 ? "italic text-charcoal" : undefined}
              >
                {paragraph}
              </p>
            ))}
            {examplesHeading ? <p>{examplesHeading}</p> : null}
            {examples && examples.length > 0 ? (
              <ul className="list-disc space-y-2 pl-6">
                {examples.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
