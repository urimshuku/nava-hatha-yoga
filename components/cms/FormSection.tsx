"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

function IconChevronDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 shrink-0"
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

function IconChevronUp() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M6 15l6-6 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface FormSectionsContextValue {
  epoch: number;
  wantOpen: boolean | null;
  expandAll: () => void;
  collapseAll: () => void;
}

const FormSectionsContext = createContext<FormSectionsContextValue | null>(null);

/** Lets Collapse all / Expand all reach every section on the editing form. */
export function FormSectionsProvider({ children }: { children: ReactNode }) {
  const [epoch, setEpoch] = useState(0);
  const [wantOpen, setWantOpen] = useState<boolean | null>(null);

  const expandAll = useCallback(() => {
    setWantOpen(true);
    setEpoch((value) => value + 1);
  }, []);

  const collapseAll = useCallback(() => {
    setWantOpen(false);
    setEpoch((value) => value + 1);
  }, []);

  const value = useMemo(
    () => ({ epoch, wantOpen, expandAll, collapseAll }),
    [epoch, wantOpen, expandAll, collapseAll],
  );

  return (
    <FormSectionsContext.Provider value={value}>
      {children}
    </FormSectionsContext.Provider>
  );
}

export function SectionToggleButtons() {
  const sections = useContext(FormSectionsContext);
  if (!sections) return null;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={sections.collapseAll}
        className="inline-flex items-center gap-1.5 text-sm text-brown hover:text-saffron"
      >
        <IconChevronUp />
        Collapse all
      </button>
      <button
        type="button"
        onClick={sections.expandAll}
        className="inline-flex items-center gap-1.5 text-sm text-brown hover:text-saffron"
      >
        <IconChevronDown />
        Expand all
      </button>
    </div>
  );
}

/** Groups related fields under a heading, so a long form reads as short steps. */
export function FormSection({
  id,
  title,
  description,
  collapsible = true,
  defaultOpen = true,
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
  const sections = useContext(FormSectionsContext);
  const [open, setOpen] = useState(Boolean(defaultOpen));

  useEffect(() => {
    if (sections?.wantOpen == null) return;
    setOpen(sections.wantOpen);
  }, [sections?.epoch, sections?.wantOpen]);

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
