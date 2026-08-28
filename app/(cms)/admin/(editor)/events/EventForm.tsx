"use client";

import { useActionState } from "react";

import {
  DateField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/cms/Field";
import { FormSection } from "@/components/cms/FormSection";
import { ImageField } from "@/components/cms/ImageField";
import {
  SessionsField,
  TextListField,
} from "@/components/cms/RepeatableFields";
import { FormError, FormNotice, SaveBar, WorkingCopyBanner } from "@/components/cms/SaveBar";
import type { YogaEvent } from "@/lib/cms/content-types";

import { saveEvent, type EventFormState } from "./actions";

export interface ProgramOption {
  slug: string;
  title: string;
}

export function EventForm({
  event,
  originalSlug,
  programs,
  isNew,
  notice,
  published,
  unpublishedChanges,
}: {
  event?: Partial<YogaEvent>;
  originalSlug?: string;
  programs: ProgramOption[];
  isNew: boolean;
  notice?: "saved" | "published";
  published?: boolean;
  unpublishedChanges?: boolean;
}) {
  const [state, formAction] = useActionState<EventFormState, FormData>(
    saveEvent,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      {originalSlug ? (
        <input type="hidden" name="originalSlug" value={originalSlug} />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl text-charcoal">
          {isNew ? "New event" : (event?.title ?? "Edit event")}
        </h1>
        <SaveBar cancelHref="/admin/events" />
      </div>

      <FormNotice kind={notice} />
      {!notice && !isNew ? (
        <WorkingCopyBanner
          published={published}
          unpublishedChanges={unpublishedChanges}
        />
      ) : null}
      <FormError message={state.error} />

      <FormSection title="The basics">
        <TextField
          name="title"
          label="Title"
          hint="For example: Surya Kriya"
          defaultValue={event?.title}
          required
        />
        <TextAreaField
          name="description"
          label="Short description"
          hint="The summary shown on the event card."
          defaultValue={event?.description}
          rows={4}
        />
        <SelectField
          name="category"
          label="Type of event"
          defaultValue={event?.category}
          placeholder="Choose one"
          options={[
            { value: "Workshop", label: "Workshop" },
            { value: "Retreat", label: "Retreat" },
            { value: "Free Session", label: "Free Session" },
          ]}
        />
        <SelectField
          name="relatedProgram"
          label="Related program"
          hint="Sets the symbol and intensity shown on the event card."
          defaultValue={event?.relatedProgram?.slug ?? ""}
          placeholder="None"
          options={programs.map((program) => ({
            value: program.slug,
            label: program.title,
          }))}
        />
      </FormSection>

      <FormSection title="When and where">
        <div className="grid gap-5 sm:grid-cols-2">
          <DateField
            name="date"
            label="Date"
            hint="The day the event starts."
            defaultValue={event?.date}
            required
          />
          <DateField
            name="endDate"
            label="Last day"
            hint="Only for events running over more than one day."
            defaultValue={event?.endDate}
          />
        </div>
        <SessionsField
          label="Session times"
          hint="One row per session. Each row becomes its own line on the event card."
          defaultValues={event?.sessions}
        />
        <TextField
          name="sessionNote"
          label="Note under the times"
          hint="Optional, for example: All 3 sessions are mandatory."
          defaultValue={event?.sessionNote}
        />
        <TextField
          name="location"
          label="Location"
          placeholder="Saranda, Albania"
          defaultValue={event?.location}
        />
      </FormSection>

      <FormSection title="Price and notes">
        <TextField
          name="priceLabel"
          label="Price"
          hint="For example: 170€, Free, or By donation."
          defaultValue={event?.priceLabel}
        />
        <TextField
          name="paymentNote"
          label="Payment note"
          hint="Optional, shown in brackets next to the price."
          defaultValue={event?.paymentNote}
        />
        <TextField
          name="ageRequirement"
          label="Age requirement"
          hint="Optional, for example: 14+"
          defaultValue={event?.ageRequirement}
        />
        <TextListField
          name="notes"
          label="Reminders on the card"
          hint="Short lines shown on the event card."
          addLabel="Add another reminder"
          defaultValues={event?.notes ?? []}
        />
        <ImageField
          name="image"
          label="Photo"
          hint="Used when the event is shared on WhatsApp or Facebook."
          value={event?.image as Record<string, unknown> | undefined}
        />
      </FormSection>

      <FormSection title="Web address">
        <TextField
          name="slug"
          label="Web address"
          hint="The part after /events/. Leave it empty and it is built from the title, location and date."
          defaultValue={originalSlug}
        />
      </FormSection>

      <SaveBar cancelHref="/admin/events" />
    </form>
  );
}
