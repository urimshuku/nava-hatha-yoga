"use client";

import { useActionState, useState, type FormEvent } from "react";

import { TextField } from "@/components/cms/Field";
import { FormSection } from "@/components/cms/FormSection";
import { FormError, FormNotice, SaveBar, WorkingCopyBanner } from "@/components/cms/SaveBar";
import { SchemaFields } from "@/components/cms/SchemaFields";
import { retreatSchema } from "@/lib/cms/schemas";
import {
  retreatWebAddress,
  splitRetreatPlace,
  toDateInputValue,
} from "@/lib/utils";

import { saveRetreat, discardRetreatChanges, type RetreatFormState } from "./actions";

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
  const [state, formAction, pending] = useActionState<RetreatFormState, FormData>(
    saveRetreat,
    {},
  );

  const retreatValues = retreat as
    | {
        title?: string;
        cityCountry?: string;
        location?: string;
        date?: string;
      }
    | undefined;
  const place = splitRetreatPlace(retreatValues ?? {});
  const [title, setTitle] = useState(() => retreatValues?.title ?? "");
  const [cityCountry, setCityCountry] = useState(() => place.cityCountry ?? "");
  const [firstDay, setFirstDay] = useState(() =>
    toDateInputValue(retreatValues?.date),
  );
  const slug =
    retreatWebAddress(cityCountry, title, firstDay) || originalSlug || "";

  const values =
    retreat && typeof retreat === "object"
      ? {
          ...(retreat as Record<string, unknown>),
          ...place,
        }
      : retreat;

  function syncWebAddress(event: FormEvent<HTMLFormElement>) {
    const target = event.target;
    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    if (target.name === "title") setTitle(target.value);
    if (target.name === "cityCountry") setCityCountry(target.value);
    if (target.name === "date") setFirstDay(target.value);
  }

  return (
    <form action={formAction} onInput={syncWebAddress} className="space-y-6">
      {originalSlug ? (
        <input type="hidden" name="originalSlug" value={originalSlug} />
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-heading text-3xl text-charcoal">
          {isNew ? "New retreat" : (retreatValues?.title ?? "Edit retreat")}
        </h1>
        <SaveBar
          cancelHref="/admin/retreats"
          cancelAction={discardRetreatChanges}
          action={formAction}
          pending={pending}
        />
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
          <SchemaFields fields={section.fields} values={values} />
        </FormSection>
      ))}

      <FormSection title="Web address">
        <TextField
          name="slug"
          label="Web address"
          hint="Always /retreats/ plus the city, title, and first day. It updates as you change those fields."
          value={slug}
          readOnly
        />
      </FormSection>

      <SaveBar
        cancelHref="/admin/retreats"
        cancelAction={discardRetreatChanges}
        action={formAction}
        pending={pending}
      />
    </form>
  );
}
