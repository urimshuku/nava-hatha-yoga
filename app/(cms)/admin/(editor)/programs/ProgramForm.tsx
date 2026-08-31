"use client";

import { useActionState } from "react";

import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/cms/Field";
import { FormSection } from "@/components/cms/FormSection";
import { ImageField } from "@/components/cms/ImageField";
import { TextListField } from "@/components/cms/RepeatableFields";
import { RichTextField } from "@/components/cms/RichTextField";
import { FormError, FormNotice, SaveBar, WorkingCopyBanner } from "@/components/cms/SaveBar";
import type { Program } from "@/lib/cms/content-types";

import { saveProgram, type ProgramFormState } from "./actions";

/** The program's long sections, already converted to editable text. */
export interface ProgramRichText {
  whatIs: string;
  aboutThePractice: string;
  practiceIndependently: string;
  privateAndGroupSessions: string;
}

export function ProgramForm({
  program,
  richText,
  originalSlug,
  isNew,
  notice,
  published,
  unpublishedChanges,
}: {
  program?: Partial<Program>;
  richText: ProgramRichText;
  originalSlug?: string;
  isNew: boolean;
  notice?: "saved" | "published";
  published?: boolean;
  unpublishedChanges?: boolean;
}) {
  const [state, formAction, pending] = useActionState<ProgramFormState, FormData>(
    saveProgram,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      {originalSlug ? (
        <input type="hidden" name="originalSlug" value={originalSlug} />
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-heading text-3xl text-charcoal">
          {isNew ? "New program" : (program?.title ?? "Edit program")}
        </h1>
        <SaveBar
          cancelHref="/admin/programs"
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
          defaultValue={program?.title}
          required
        />
        <TextAreaField
          name="shortIntro"
          label="Short introduction"
          hint="Shown on program cards and under the title on the program page. Keep it under a few sentences."
          defaultValue={program?.shortIntro}
          rows={3}
        />
        <SelectField
          name="category"
          label="Which list it appears in"
          hint="Core programs appear in the main list on the Programs page; special programs in the second list."
          defaultValue={program?.category ?? "main"}
          options={[
            { value: "main", label: "Core program" },
            { value: "special", label: "Special program" },
          ]}
        />
      </FormSection>

      <FormSection title="The program page">
        <ImageField
          name="image"
          label="Photo"
          hint="Shown on the program card and at the top of the program page."
          value={program?.image as Record<string, unknown> | undefined}
        />
        <RichTextField
          name="whatIs"
          label="What is this practice?"
          hint="The first main section on the program page."
          defaultValue={richText.whatIs}
        />
        <RichTextField
          name="aboutThePractice"
          label="About the practice"
          defaultValue={richText.aboutThePractice}
        />
        <TextListField
          name="benefits"
          label="Benefits"
          hint="One benefit per line. Use careful wording, for example “may support”."
          addLabel="Add another benefit"
          defaultValues={program?.benefits ?? []}
        />
        <TextField
          name="beforeProgramTitle"
          label="Heading for the “before the program” section"
          hint="Leave empty for “Before the Program”. Use “Pre-Requisite” when the practice has a requirement."
          defaultValue={program?.beforeProgramTitle}
        />
        <TextListField
          name="beforeProgramNotes"
          label="Before the program"
          hint="Leave all rows empty to use the site-wide notes."
          addLabel="Add another note"
          defaultValues={program?.beforeProgramNotes ?? []}
        />
        <RichTextField
          name="practiceIndependently"
          label="After the program"
          hint="Guidance on continuing the practice at home."
          defaultValue={richText.practiceIndependently}
        />
      </FormSection>

      <FormSection title="Sidebar">
        <RichTextField
          name="privateAndGroupSessions"
          label="Private and group sessions"
          hint="How this practice is offered. Shown in the sidebar above the buttons."
          defaultValue={richText.privateAndGroupSessions}
          rows={6}
        />
        <SelectField
          name="intensity"
          label="Intensity"
          hint="Shown in the sidebar and on related event cards."
          defaultValue={program?.intensity ?? ""}
          placeholder="Not set"
          options={[
            { value: "Low", label: "Low" },
            { value: "Medium", label: "Medium" },
            { value: "High", label: "High" },
          ]}
        />
        <TextField
          name="priceLabel"
          label="Price"
          hint="For example: 300€"
          defaultValue={program?.priceLabel}
        />
        <TextField
          name="videoUrl"
          label="Video link"
          hint="Optional YouTube link shown in the sidebar."
          defaultValue={program?.videoUrl}
        />
        <TextField
          name="videoTitle"
          label="Video label"
          hint="Optional, for example: Sadhguru speaks on Angamardana"
          defaultValue={program?.videoTitle}
        />
      </FormSection>

      <FormSection title="Web address">
        <TextField
          name="slug"
          label="Web address"
          hint="The part after /programs/. Changing this moves the page, so existing links will stop working."
          defaultValue={originalSlug}
        />
      </FormSection>

      <SaveBar
        cancelHref="/admin/programs"
        action={formAction}
        pending={pending}
      />
    </form>
  );
}
