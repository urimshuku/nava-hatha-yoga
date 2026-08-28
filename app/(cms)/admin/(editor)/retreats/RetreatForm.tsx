"use client";

import { useActionState } from "react";

import { TextField } from "@/components/cms/Field";
import { FormSection } from "@/components/cms/FormSection";
import { FormError, FormNotice, SaveBar, WorkingCopyBanner } from "@/components/cms/SaveBar";
import { SchemaFields } from "@/components/cms/SchemaFields";
import { retreatSchema } from "@/lib/cms/schemas";

import { saveRetreat, type RetreatFormState } from "./actions";

export function RetreatForm({
  retreat,
  originalSlug,
  isNew,
  notice,
  published,
  unpublishedChanges,
}: {
  /** The retreat as it stands today, from the CMS or from Sanity. */
  retreat?: unknown;
  originalSlug?: string;
  isNew: boolean;
  notice?: "saved" | "published";
  published?: boolean;
  unpublishedChanges?: boolean;
}) {
  const [state, formAction] = useActionState<RetreatFormState, FormData>(
    saveRetreat,
    {},
  );

  const title = (retreat as { title?: string } | undefined)?.title;

  return (
    <form action={formAction} className="space-y-6">
      {originalSlug ? (
        <input type="hidden" name="originalSlug" value={originalSlug} />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl text-charcoal">
          {isNew ? "New retreat" : (title ?? "Edit retreat")}
        </h1>
        <SaveBar cancelHref="/admin/retreats" />
      </div>

      <FormNotice kind={notice} />
      {!notice && !isNew ? (
        <WorkingCopyBanner
          published={published}
          unpublishedChanges={unpublishedChanges}
        />
      ) : null}
      <FormError message={state.error} />

      {retreatSchema.sections.map((section) => (
        <FormSection
          key={section.title}
          title={section.title}
          description={section.description}
        >
          <SchemaFields fields={section.fields} values={retreat} />
        </FormSection>
      ))}

      <FormSection title="Web address">
        <TextField
          name="slug"
          label="Web address"
          hint="The part after /retreats/. Changing this moves the page, so existing links will stop working."
          defaultValue={originalSlug}
        />
      </FormSection>

      <SaveBar cancelHref="/admin/retreats" />
    </form>
  );
}
