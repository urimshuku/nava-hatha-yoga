"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { nextAvailableSlug, titleForCopy } from "@/lib/cms/copy";
import {
  checkbox,
  dateToTimestamp,
  imageValue,
  pairedList,
  resolveSlug,
  text,
  textList,
} from "@/lib/cms/form-values";
import {
  deleteDocument,
  getDocument,
  isTombstone,
  saveDocument,
  setDocumentHidden,
} from "@/lib/cms/repository";
import { assertCmsSession } from "@/lib/cms/session";
import { getPrograms } from "@/lib/cms/site-content";
import type { EventCategory, YogaEvent } from "@/lib/cms/content-types";

export interface EventFormState {
  error?: string;
}

const CATEGORIES: EventCategory[] = ["Workshop", "Retreat", "Free Session"];

/** Clears the router cache so the client sees her change the moment she looks. */
function refreshAffectedPages(slug: string) {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/events/archive");
  revalidatePath(`/events/${slug}`);
  revalidatePath("/admin/events");
}

/**
 * The event as it exists today, so fields the form does not show (the social
 * sharing image, for instance) survive an edit.
 */
async function loadBaseEvent(slug: string | undefined): Promise<Partial<YogaEvent>> {
  if (!slug) return {};

  const stored = await getDocument<YogaEvent>("event", slug);
  if (stored && !isTombstone(stored.data)) return stored.data;
  return {};
}

async function resolveRelatedProgram(
  slug: string | undefined,
): Promise<YogaEvent["relatedProgram"]> {
  if (!slug) return null;

  const programs = await getPrograms();
  const program = programs.find((entry) => entry.slug === slug);
  if (!program) return null;

  return {
    title: program.title,
    slug: program.slug,
    intensity: program.intensity,
  };
}

export async function saveEvent(
  _state: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  await assertCmsSession();

  const title = text(formData, "title");
  if (!title) return { error: "Please give the event a title." };

  const date = dateToTimestamp(text(formData, "date"), "start");
  if (!date) return { error: "Please choose the date of the event." };

  const originalSlug = text(formData, "originalSlug");
  const slug = resolveSlug(text(formData, "slug"), [
    title,
    text(formData, "location"),
    text(formData, "date"),
  ]);
  if (!slug) {
    return {
      error:
        "This event needs a web address. Add a title, or type one in the Web address field.",
    };
  }

  const categoryInput = text(formData, "category");
  const category = CATEGORIES.find((entry) => entry === categoryInput);

  const base = await loadBaseEvent(originalSlug ?? slug);
  const sessions = pairedList(formData, "sessionDay", "sessionHours").map(
    (row) => ({ day: row.first, hours: row.second }),
  );

  const image = imageValue(formData, "image");

  const event: YogaEvent = {
    ...base,
    image: image === null ? undefined : (image ?? base.image),
    _id: base._id ?? `cms.event.${slug}`,
    title,
    slug,
    date,
    endDate: dateToTimestamp(text(formData, "endDate"), "end"),
    description: text(formData, "description"),
    sessions,
    sessionNote: text(formData, "sessionNote"),
    // The composed schedule replaces the legacy free-text time field.
    time: undefined,
    location: text(formData, "location"),
    priceLabel: text(formData, "priceLabel"),
    paymentNote: text(formData, "paymentNote"),
    ageRequirement: text(formData, "ageRequirement"),
    category,
    relatedProgram: await resolveRelatedProgram(text(formData, "relatedProgram")),
    notes: textList(formData, "notes"),
  };

  try {
    await saveDocument({
      type: "event",
      slug,
      data: event,
      published: checkbox(formData, "published"),
    });

    // Renaming the web address leaves the old document behind; remove it.
    if (originalSlug && originalSlug !== slug) {
      await deleteDocument("event", originalSlug);
      refreshAffectedPages(originalSlug);
    }
  } catch (error) {
    console.error("Failed to save event.", error);
    return {
      error: "The event could not be saved. Please try again.",
    };
  }

  refreshAffectedPages(slug);
  redirect(`/admin/events?saved=${encodeURIComponent(slug)}`);
}

/**
 * Takes an event off the website. Its content is kept, so it can be put back.
 */
export async function hideEvent(formData: FormData): Promise<void> {
  await assertCmsSession();

  const slug = text(formData, "slug");
  if (!slug) return;

  await setDocumentHidden("event", slug, true);

  refreshAffectedPages(slug);
  redirect("/admin/events");
}

/** Puts a hidden event back on the website, with its content intact. */
export async function restoreEvent(formData: FormData): Promise<void> {
  await assertCmsSession();

  const slug = text(formData, "slug");
  if (!slug) return;

  await setDocumentHidden("event", slug, false);

  refreshAffectedPages(slug);
  redirect("/admin/events");
}

/** Copies an event as an unpublished draft and opens it for editing. */
export async function duplicateEvent(formData: FormData): Promise<void> {
  await assertCmsSession();

  const slug = text(formData, "slug");
  if (!slug) return;

  const stored = await getDocument<YogaEvent>("event", slug);
  if (!stored || isTombstone(stored.data)) {
    redirect("/admin/events");
  }

  const newSlug = await nextAvailableSlug("event", `${stored.slug}-copy`);
  const title = titleForCopy(stored.data.title || stored.slug);

  await saveDocument({
    type: "event",
    slug: newSlug,
    data: {
      ...stored.data,
      _id: `cms.event.${newSlug}`,
      slug: newSlug,
      title,
    },
    published: false,
    hidden: false,
  });

  refreshAffectedPages(newSlug);
  redirect(`/admin/events/${newSlug}`);
}
