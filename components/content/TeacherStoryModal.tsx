"use client";

import { useEffect } from "react";

import {
  TEACHER_STORY_PARAGRAPHS,
  TEACHER_STORY_TITLE,
} from "@/lib/teacher-story";

interface TeacherStoryModalProps {
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

export function TeacherStoryModal({ open, onClose }: TeacherStoryModalProps) {
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
      aria-labelledby="teacher-story-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-ivory shadow-card">
        <div className="flex items-start justify-between gap-4 border-b border-border bg-cream/60 px-6 py-5 sm:px-8">
          <h2 id="teacher-story-title" className="font-heading text-2xl text-charcoal">
            {TEACHER_STORY_TITLE}
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
            {TEACHER_STORY_PARAGRAPHS.map((paragraph, index) => (
              <p
                key={paragraph}
                className={index === 0 ? "italic text-charcoal" : undefined}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
