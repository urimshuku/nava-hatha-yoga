"use client";

import { useActionState } from "react";

import { FormSection } from "@/components/cms/FormSection";
import { FormError, SaveBar } from "@/components/cms/SaveBar";
import { SchemaFields } from "@/components/cms/SchemaFields";
import type { DocumentSchema } from "@/lib/cms/schema";

import { savePage, type PageFormState } from "./actions";

/** Editing form for any single page, built from the page's schema. */
export function PageForm({
  pageId,
  schema,
  values,
  saved,
}: {
  pageId: string;
  schema: DocumentSchema;
  /** The page as it stands today, from the CMS or from Sanity. */
  values: unknown;
  saved?: boolean;
}) {
  const [state, formAction] = useActionState<PageFormState, FormData>(
    savePage,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="pageId" value={pageId} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">{schema.title}</h1>
          {schema.description ? (
            <p className="mt-1 max-w-2xl text-sm text-brown">
              {schema.description}
            </p>
          ) : null}
        </div>
        <SaveBar cancelHref="/admin/pages" />
      </div>

      {saved ? (
        <p className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Saved. Your changes are on the website now.
        </p>
      ) : null}

      <FormError message={state.error} />

      {schema.sections.map((section) => (
        <FormSection
          key={section.title}
          title={section.title}
          description={section.description}
        >
          <SchemaFields fields={section.fields} values={values} />
        </FormSection>
      ))}

      <SaveBar cancelHref="/admin/pages" />
    </form>
  );
}
