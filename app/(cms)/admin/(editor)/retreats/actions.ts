"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isPublishIntent, preserveSeo, resolveSlug, text } from "@/lib/cms/form-values";
import { nextAvailableSlug, titleForCopy } from "@/lib/cms/copy";
import {
  deleteDocument,
  getDocument,
  isTombstone,
  revertWorkingCopy,
  saveDocument,
  setDocumentHidden,
} from "@/lib/cms/repository";
import { readDocument } from "@/lib/cms/schema-parse";
import { retreatSchema } from "@/lib/cms/schemas";
import { assertCmsSession } from "@/lib/cms/session";
import type { Retreat } from "@/lib/cms/content-types";
import { retreatWebAddress } from "@/lib/utils";

export interface RetreatFormState {
  error?: string;
}

function refreshAffectedPages(slug: string) {
  revalidatePath("/retreats");
  revalidatePath("/retreats/archive");
  revalidatePath(`/retreats/${slug}`);
  revalidatePath("/admin/retreats");
}

export async function saveRetreat(
  _state: RetreatFormState,
  formData: FormData,
): Promise<RetreatFormState> {
  await assertCmsSession();

  const data = readDocument<Retreat>(retreatSchema, formData);
  if (!data.title) {
    return { error: "Please give the retreat a title." };
  }

  const originalSlug = text(formData, "originalSlug");
  const slug = resolveSlug(
    retreatWebAddress(
      text(formData, "cityCountry"),
      text(formData, "date"),
    ),
    [text(formData, "cityCountry"), "retreat", text(formData, "date")],
  );
  if (!slug) {
    return {
      error: "This retreat needs a web address. Type a city and start date.",
    };
  }

  const stored = await getDocument<Retreat>(
    "retreat",
    originalSlug || slug,
  );
  const existing =
    stored && !isTombstone(stored.data) ? stored.data : undefined;

  const retreat: Retreat = {
    ...preserveSeo(data, existing),
    _id: `cms.retreat.${slug}`,
    slug,
  };

  const publish = isPublishIntent(formData);

  try {
    await saveDocument({
      type: "retreat",
      slug,
      data: retreat,
      publish,
      copyStateFromSlug: originalSlug || undefined,
    });

    if (originalSlug && originalSlug !== slug) {
      await deleteDocument("retreat", originalSlug);
      refreshAffectedPages(originalSlug);
    }
  } catch (error) {
    console.error("Failed to save retreat.", error);
    return { error: "The retreat could not be saved. Please try again." };
  }

  if (publish) {
    refreshAffectedPages(slug);
  } else {
    revalidatePath("/admin/retreats");
    revalidatePath(`/admin/retreats/${slug}`);
  }
  redirect(`/admin/retreats/${slug}?${publish ? "published=1" : "saved=1"}`);
}

export async function hideRetreat(formData: FormData): Promise<void> {
  await assertCmsSession();

  const slug = text(formData, "slug");
  if (!slug) return;

  await setDocumentHidden("retreat", slug, true);

  refreshAffectedPages(slug);
  redirect("/admin/retreats");
}

export async function restoreRetreat(formData: FormData): Promise<void> {
  await assertCmsSession();

  const slug = text(formData, "slug");
  if (!slug) return;

  await setDocumentHidden("retreat", slug, false);

  refreshAffectedPages(slug);
  redirect("/admin/retreats");
}

/** Copies a retreat as an unpublished draft and opens it for editing. */
export async function duplicateRetreat(formData: FormData): Promise<void> {
  await assertCmsSession();

  const slug = text(formData, "slug");
  if (!slug) return;

  const stored = await getDocument<Retreat>("retreat", slug);
  if (!stored || isTombstone(stored.data)) {
    redirect("/admin/retreats");
  }

  const newSlug = await nextAvailableSlug("retreat", `${stored.slug}-copy`);
  const title = titleForCopy(stored.data.title || stored.slug);

  await saveDocument({
    type: "retreat",
    slug: newSlug,
    data: {
      ...stored.data,
      _id: `cms.retreat.${newSlug}`,
      slug: newSlug,
      title,
    },
    published: false,
    hidden: false,
  });

  refreshAffectedPages(newSlug);
  redirect(`/admin/retreats/${newSlug}`);
}

/** Permanently removes a retreat from the editor and the website. */
export async function deleteRetreat(formData: FormData): Promise<void> {
  await assertCmsSession();

  const slug = text(formData, "slug");
  if (!slug) return;

  await deleteDocument("retreat", slug);

  refreshAffectedPages(slug);
  redirect("/admin/retreats?deleted=1");
}

/** Throws away a saved working copy and returns to the retreats list. */
export async function discardRetreatChanges(formData: FormData): Promise<void> {
  await assertCmsSession();

  const slug = text(formData, "originalSlug");
  if (slug) {
    await revertWorkingCopy("retreat", slug);
    revalidatePath("/admin/retreats");
    revalidatePath(`/admin/retreats/${slug}`);
  }

  redirect("/admin/retreats");
}
