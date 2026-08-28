"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { findEditablePage } from "@/lib/cms/editable-pages";
import { saveDocument } from "@/lib/cms/repository";
import { readDocument } from "@/lib/cms/schema-parse";
import { assertCmsSession } from "@/lib/cms/session";

export interface PageFormState {
  error?: string;
}

/**
 * Saves any of the single pages. The page being edited arrives as a hidden field
 * and is looked up in the registry, which both finds the right schema and keeps
 * an unknown value from writing anywhere unexpected.
 */
export async function savePage(
  _state: PageFormState,
  formData: FormData,
): Promise<PageFormState> {
  await assertCmsSession();

  const id = formData.get("pageId");
  const page = typeof id === "string" ? findEditablePage(id) : undefined;
  if (!page) {
    return { error: "That page could not be found. Please reload and try again." };
  }

  const data = readDocument<Record<string, unknown>>(page.schema, formData);

  // Legal pages are looked up by slug on the website, so it has to be stored.
  if (page.type === "legalPage") {
    data.slug = page.slug;
  }

  try {
    await saveDocument({
      type: page.type,
      slug: page.slug,
      data,
      published: true,
    });
  } catch (error) {
    console.error(`Failed to save page ${page.id}.`, error);
    return { error: "The page could not be saved. Please try again." };
  }

  for (const path of page.revalidate) {
    revalidatePath(path);
  }
  revalidatePath("/admin/pages");

  redirect(`/admin/pages/${page.id}?saved=1`);
}
