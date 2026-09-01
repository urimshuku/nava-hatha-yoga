"use client";

import { useState, type ReactNode } from "react";

import { titleCaseLabel } from "./Field";

function IconChevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 shrink-0 text-brown transition-transform duration-200 group-open:rotate-180"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Groups related fields under a heading, so a long form reads as short steps. */
export function FormSection({
  id,
  title,
  description,
  collapsible,
  defaultOpen,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const heading = titleCaseLabel(title);
  const body = (
    <>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm text-brown">{description}</p>
      ) : null}
      <div className="mt-5 space-y-5">{children}</div>
    </>
  );

  if (collapsible) {
    return (
      <CollapsibleSection id={id} heading={heading} defaultOpen={defaultOpen}>
        {body}
      </CollapsibleSection>
    );
  }

  return (
    <section id={id} className="scroll-mt-6 rounded-lg border border-border bg-white p-5 sm:p-6">
      <h2 className="font-heading text-xl text-charcoal">{heading}</h2>
      {body}
    </section>
  );
}

function CollapsibleSection({
  id,
  heading,
  defaultOpen,
  children,
}: {
  id?: string;
  heading: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));

  return (
    <details
      id={id}
      open={open}
      onToggle={(event) => {
        const next = event.currentTarget.open;
        setOpen((current) => (current === next ? current : next));
      }}
      className="group scroll-mt-6 rounded-lg border border-border bg-white p-5 open:pb-5 sm:p-6"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <h2 className="font-heading text-xl text-charcoal">{heading}</h2>
        <IconChevron />
      </summary>
      {children}
    </details>
  );
}
