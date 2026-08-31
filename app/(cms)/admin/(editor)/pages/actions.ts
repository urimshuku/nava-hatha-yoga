"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { findEditablePage } from "@/lib/cms/editable-pages";
import { isPublishIntent, preserveSeo } from "@/lib/cms/form-values";
import { getDocument, isTombstone, saveDocument } from "@/lib/cms/repository";
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

  const stored = await getDocument<Record<string, unknown>>(page.type, page.slug);
  const existing =
    stored && !isTombstone(stored.data) ? stored.data : undefined;
  const dataWithSeo = preserveSeo(data, existing);

  const publish = isPublishIntent(formData);

  try {
    await saveDocument({
      type: page.type,
      slug: page.slug,
      data: dataWithSeo,
      publish,
    });
  } catch (error) {
    console.error(`Failed to save page ${page.id}.`, error);
    return { error: "The page could not be saved. Please try again." };
  }

  if (publish) {
    for (const path of page.revalidate) {
      revalidatePath(path);
    }
  }
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${page.id}`);

  redirect(
    `/admin/pages/${page.id}?${publish ? "published=1" : "saved=1"}`,
  );
}
