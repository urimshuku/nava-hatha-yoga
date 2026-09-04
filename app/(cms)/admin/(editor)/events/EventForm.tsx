"use client";

import { useActionState, useState } from "react";

import {
  DateField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/cms/Field";
import { FormSection, FormSectionsProvider } from "@/components/cms/FormSection";
import { SessionsField } from "@/components/cms/RepeatableFields";
import { FormError, FormNotice, SaveBar } from "@/components/cms/SaveBar";
import type { YogaEvent } from "@/lib/cms/content-types";
import { EVENT_TYPE_OPTIONS } from "@/lib/constants";
import { isFreeSessionCategory, isModuleSystemCategory } from "@/lib/registration-kind";
import {
  cityCountryFromLocation,
  eventWebAddress,
  hydrateEventSessionFields,
  stripEventDescriptionExtras,
  toDateInputValue,
} from "@/lib/utils";

import { saveEvent, discardEventChanges, type EventFormState } from "./actions";

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
}: {
  event?: Partial<YogaEvent>;
  originalSlug?: string;
  programs: ProgramOption[];
  isNew: boolean;
  notice?: "saved" | "published";
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
  const [title, setTitle] = useState(() => event?.title ?? "");
  const [category, setCategory] = useState(() => event?.category ?? "");
  const [programSlug, setProgramSlug] = useState(
    () => event?.relatedProgram?.slug ?? "",
  );
  const [cityCountry, setCityCountry] = useState(() => defaultCity ?? "");
  const [firstDay, setFirstDay] = useState(() => toDateInputValue(event?.date));
  const [lastDay, setLastDay] = useState(() => toDateInputValue(event?.endDate));
  const slugHead = isFreeSessionCategory(category) || isModuleSystemCategory(category)
    ? title
    : programSlug || title;
  const slug =
    eventWebAddress(
      slugHead,
      cityCountry,
      firstDay,
      isModuleSystemCategory(category) ? "module" : undefined,
    ) || originalSlug || "";

  return (
    <FormSectionsProvider>
    <form action={formAction} className="space-y-6">
      {originalSlug ? (
        <input type="hidden" name="originalSlug" value={originalSlug} />
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-heading text-3xl text-charcoal">
          {isNew ? "New workshop" : (event?.title ?? "Edit workshop")}
        </h1>
        <SaveBar
          cancelHref="/admin/events"
          cancelAction={discardEventChanges}
          action={formAction}
          pending={pending}
        />
      </div>

      <FormNotice kind={notice} />
      <FormError message={state.error} />

      <FormSection title="Basic details">
        <TextField
          name="title"
          label="Title"
          hint="For example: Surya Kriya"
          value={title}
          onChange={(change) => setTitle(change.target.value)}
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
          hint="Free offerings use the one-page form. Workshops and Module System Workshop use their matching registration forms."
          value={category}
          onChange={(change) => setCategory(change.target.value)}
          placeholder="Choose one"
          options={EVENT_TYPE_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
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
            label="Start date"
            hint="The day the event starts."
            value={firstDay}
            required
            onChange={(change) => setFirstDay(change.target.value)}
          />
          <DateField
            name="endDate"
            label="End date"
            hint="Leave empty for a single-day event."
            defaultValue={event?.endDate}
            onChange={(change) => setLastDay(change.target.value)}
          />
        </div>
        <SessionsField
          label="Session times"
          hint="One row per session. The plus adds another time on the same day."
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
          hint="Optional, for example: 14+. Leave blank to hide it."
          defaultValue={event?.ageRequirement ?? ""}
        />
        <TextField
          name="intensity"
          label="Intensity"
          hint="Shown on the event card, for example: Medium. Leave blank to hide it."
          placeholder="Medium"
          defaultValue={event?.intensity ?? ""}
        />
        <TextField
          name="yogaExperience"
          label="Yoga Experience"
          hint="Shown under the checkmark on the event card. Leave blank to hide it."
          placeholder="No prior yoga experience required!"
          defaultValue={event?.yogaExperience ?? ""}
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
          hint={
            isModuleSystemCategory(category)
              ? "Always /events/ plus the session name, the word module, the city, and first day. It updates as you change those fields."
              : isFreeSessionCategory(category)
                ? "Always /events/ plus the session name, city, and first day. It updates as you change those fields."
                : "Always /events/ plus the program, city, and first day. It updates as you change those fields."
          }
          value={slug}
          readOnly
        />
      </FormSection>

        <SaveBar
          cancelHref="/admin/events"
          cancelAction={discardEventChanges}
          action={formAction}
          pending={pending}
        />
    </form>
    </FormSectionsProvider>
  );
}
