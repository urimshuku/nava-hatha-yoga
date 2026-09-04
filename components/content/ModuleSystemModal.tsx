"use client";

import { useEffect } from "react";

import { MODULE_SYSTEM_EXPLAINER } from "@/lib/module-system";

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

function IconSun() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="mt-0.5 h-5 w-5 shrink-0 text-clay"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.55 1.55M16.45 16.45 18 18M18 6l-1.55 1.55M7.55 16.45 6 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconStar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="mt-1 h-3.5 w-3.5 shrink-0 text-clay"
      aria-hidden="true"
    >
      <path
        d="M12 3.5 14.2 9.8 20.5 12 14.2 14.2 12 20.5 9.8 14.2 3.5 12 9.8 9.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ModuleSystemModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
      aria-labelledby="module-system-title"
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
            id="module-system-title"
            className="font-heading text-2xl text-charcoal"
          >
            {MODULE_SYSTEM_EXPLAINER.title}
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
            {MODULE_SYSTEM_EXPLAINER.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 space-y-5 border-t border-border pt-8">
            {MODULE_SYSTEM_EXPLAINER.continuation.map((paragraph) => (
              <p
                key={paragraph}
                className="flex gap-3 text-sm leading-relaxed text-brown sm:text-[0.95rem]"
              >
                <IconSun />
                <span>{paragraph}</span>
              </p>
            ))}

            <p className="pt-1 font-heading text-base text-charcoal">
              {MODULE_SYSTEM_EXPLAINER.examplesHeading}
            </p>
            <ul className="space-y-2.5">
              {MODULE_SYSTEM_EXPLAINER.examples.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-brown sm:text-[0.95rem]"
                >
                  <IconStar />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
