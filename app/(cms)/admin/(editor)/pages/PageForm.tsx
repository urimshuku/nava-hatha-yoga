"use client";

import { useActionState } from "react";

import { FormSection } from "@/components/cms/FormSection";
import { FormError, FormNotice, SaveBar } from "@/components/cms/SaveBar";
import { SchemaFields } from "@/components/cms/SchemaFields";
import type { DocumentSchema } from "@/lib/cms/schema";

import { savePage, type PageFormState } from "./actions";

function jumpToSection(id: string) {
  const node = document.getElementById(id);
  if (node instanceof HTMLDetailsElement && !node.open) {
    node.querySelector("summary")?.click();
  }
  node?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Editing form for any single page, built from the page's schema. */
export function PageForm({
  pageId,
  schema,
  values,
  notice,
  cancelHref = "/admin/pages",
}: {
  pageId: string;
  schema: DocumentSchema;
  /** The page as it stands today, from the CMS or from Sanity. */
  values: unknown;
  notice?: "saved" | "published";
  cancelHref?: string;
}) {
  const [state, formAction, pending] = useActionState<PageFormState, FormData>(
    savePage,
    {},
  );
  const visibleSections = schema.sections.filter((section) => !section.archived);
  const jumpLinks = visibleSections.filter(
    (section) => section.collapsible && section.id,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="pageId" value={pageId} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">{schema.title}</h1>
        </div>
        <SaveBar
          cancelHref={cancelHref}
          action={formAction}
          pending={pending}
        />
      </div>

      <FormNotice kind={notice} />
      <FormError message={state.error} />

      {jumpLinks.length > 0 ? (
        <nav
          aria-label="Form steps"
          className="flex flex-wrap gap-2 rounded-lg border border-border bg-white px-4 py-3"
        >
          {jumpLinks.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => jumpToSection(section.id as string)}
              className="rounded border border-border px-3 py-1.5 text-sm text-brown transition-colors hover:border-saffron hover:text-saffron"
            >
              {section.navTitle ?? section.title}
            </button>
          ))}
        </nav>
      ) : null}

      {visibleSections.map((section) => (
        <FormSection
          key={section.id ?? section.title}
          id={section.id}
          title={section.title}
          description={section.description}
          collapsible
        >
          <SchemaFields fields={section.fields} values={values} />
        </FormSection>
      ))}

      <SaveBar
        cancelHref={cancelHref}
        action={formAction}
        pending={pending}
      />
    </form>
  );
}
