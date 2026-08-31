"use client";

import { useActionState, useState } from "react";

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
import {
  cityCountryFromLocation,
  eventWebAddress,
  hydrateEventSessionFields,
  stripEventDescriptionExtras,
  toDateInputValue,
} from "@/lib/utils";

import { saveEvent, type EventFormState } from "./actions";

export interface ProgramOption {
  slug: string;
  title: string;
  intensity?: string;
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
  const [state, formAction, pending] = useActionState<EventFormState, FormData>(
    saveEvent,
    {},
  );

  const scheduleFields = hydrateEventSessionFields({
    sessions: event?.sessions,
    sessionNote: event?.sessionNote,
    time: event?.time,
    description: event?.description,
  });

  const defaultCity =
    event?.cityCountry?.trim() || cityCountryFromLocation(event?.location);
  const [programSlug, setProgramSlug] = useState(
    () => event?.relatedProgram?.slug ?? "",
  );
  const [cityCountry, setCityCountry] = useState(() => defaultCity ?? "");
  const [firstDay, setFirstDay] = useState(() => toDateInputValue(event?.date));
  const [lastDay, setLastDay] = useState(() => toDateInputValue(event?.endDate));
  const slug =
    eventWebAddress(programSlug, cityCountry, firstDay) || originalSlug || "";

  return (
    <form action={formAction} className="space-y-6">
      {originalSlug ? (
        <input type="hidden" name="originalSlug" value={originalSlug} />
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-heading text-3xl text-charcoal">
          {isNew ? "New event" : (event?.title ?? "Edit event")}
        </h1>
        <SaveBar
          cancelHref="/admin/events"
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
          defaultValue={stripEventDescriptionExtras(event?.description)}
          rows={4}
        />
        <SelectField
          name="category"
          label="Event Type"
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
          label="Program"
          hint="Sets the symbol shown on the event card, and the start of the web address."
          value={programSlug}
          onChange={(change) => setProgramSlug(change.target.value)}
          placeholder="None"
          options={programs.map((program) => ({
            value: program.slug,
            label: program.title,
          }))}
        />
      </FormSection>

      <FormSection title="Program Details">
        <div className="grid gap-5 sm:grid-cols-2">
          <DateField
            name="date"
            label="First Day"
            hint="The day the event starts."
            value={firstDay}
            required
            onChange={(change) => setFirstDay(change.target.value)}
          />
          <DateField
            name="endDate"
            label="Last day"
            hint="Only for events running over more than one day."
            defaultValue={event?.endDate}
            onChange={(change) => setLastDay(change.target.value)}
          />
        </div>
        <SessionsField
          label="Session times"
          hint="One row per session. Each row becomes its own line on the event card."
          firstDay={firstDay}
          lastDay={lastDay}
          defaultValues={scheduleFields.sessions.map((session) => ({
            day: session.day ?? undefined,
            hours: session.hours ?? undefined,
          }))}
        />
        <TextField
          name="sessionNote"
          label="Timing Note"
          hint="Optional, for example: All 3 sessions are mandatory."
          defaultValue={scheduleFields.sessionNote}
        />
        <TextField
          name="cityCountry"
          label="City, country"
          hint="The small label on the event card, for example: Tiranë, Albania."
          placeholder="Tiranë, Albania"
          value={cityCountry}
          onChange={(change) => setCityCountry(change.target.value)}
        />
        <TextField
          name="location"
          label="Address"
          hint="The street address shown under the pin on the event card."
          placeholder="Albania Yoga Center, 8RGM+54V, Tiranë, Albania"
          defaultValue={event?.location}
        />
        <TextField
          name="ageRequirement"
          label="Age requirement"
          hint="Optional, for example: 14+"
          defaultValue={event?.ageRequirement}
        />
        <TextField
          name="intensity"
          label="Intensity"
          hint="Shown on the event card, for example: Medium."
          placeholder="Medium"
          defaultValue={
            event?.intensity?.trim() ||
            programs.find((program) => program.slug === event?.relatedProgram?.slug)
              ?.intensity ||
            ""
          }
        />
        <TextField
          name="yogaExperience"
          label="Yoga Experience"
          hint="Shown under the checkmark on the event card."
          placeholder="No prior yoga experience required!"
          defaultValue={
            event?.yogaExperience?.trim() ||
            "No prior yoga experience required!"
          }
        />
      </FormSection>

      <FormSection title="Price">
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
      </FormSection>

      <FormSection title="Web address">
        <TextField
          name="slug"
          label="Web address"
          hint="Always /events/ plus the program, city, and first day. It updates as you change those fields."
          value={slug}
          readOnly
        />
      </FormSection>

      <FormSection title="Sharing Details (Optional)">
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

      <SaveBar
        cancelHref="/admin/events"
        action={formAction}
        pending={pending}
      />
    </form>
  );
}
