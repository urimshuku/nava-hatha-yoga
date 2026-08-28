"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  checkbox,
  imageValue,
  resolveSlug,
  text,
  textList,
} from "@/lib/cms/form-values";
import { textToPortableText } from "@/lib/cms/portable-text";
import {
  deleteDocument,
  getDocument,
  isTombstone,
  saveDocument,
  setDocumentHidden,
} from "@/lib/cms/repository";
import { assertCmsSession } from "@/lib/cms/session";
import type { Program, ProgramCategory, ProgramIntensity } from "@/lib/cms/content-types";

export interface ProgramFormState {
  error?: string;
}

const CATEGORIES: ProgramCategory[] = ["main", "special"];
const INTENSITIES: ProgramIntensity[] = ["Low", "Medium", "High"];

function refreshAffectedPages(slug: string) {
  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath(`/programs/${slug}`);
  revalidatePath("/contact");
  revalidatePath("/admin/programs");
}

/**
 * The program as it exists today, so fields the form does not show (its image
 * and SEO settings, for instance) survive an edit.
 */
async function loadBaseProgram(
  slug: string | undefined,
): Promise<Partial<Program>> {
  if (!slug) return {};

  const stored = await getDocument<Program>("program", slug);
  if (stored && !isTombstone(stored.data)) return stored.data;
  return {};
}

/** Empty rich text is stored as undefined so the site's fallbacks still apply. */
function richText(formData: FormData, name: string) {
  const value = text(formData, name);
  if (!value) return undefined;

  const blocks = textToPortableText(value);
  return blocks.length > 0 ? blocks : undefined;
}

export async function saveProgram(
  _state: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  await assertCmsSession();

  const title = text(formData, "title");
  if (!title) return { error: "Please give the program a title." };

  const originalSlug = text(formData, "originalSlug");
  const slug = resolveSlug(text(formData, "slug"), [title]);
  if (!slug) {
    return {
      error:
        "This program needs a web address. Add a title, or type one in the Web address field.",
    };
  }

  const base = await loadBaseProgram(originalSlug ?? slug);
  const categoryInput = text(formData, "category");
  const intensityInput = text(formData, "intensity");
  const image = imageValue(formData, "image");
  const seoImage = imageValue(formData, "seo.image");

  const program: Program = {
    ...base,
    image: image === null ? undefined : (image ?? base.image),
    _id: base._id ?? `cms.program.${slug}`,
    title,
    slug,
    shortIntro: text(formData, "shortIntro"),
    category: CATEGORIES.find((entry) => entry === categoryInput),
    intensity: INTENSITIES.find((entry) => entry === intensityInput),
    priceLabel: text(formData, "priceLabel"),
    videoUrl: text(formData, "videoUrl"),
    videoTitle: text(formData, "videoTitle"),
    whatIs: richText(formData, "whatIs"),
    aboutThePractice: richText(formData, "aboutThePractice"),
    practiceIndependently: richText(formData, "practiceIndependently"),
    privateAndGroupSessions: richText(formData, "privateAndGroupSessions"),
    benefits: textList(formData, "benefits"),
    beforeProgramTitle: text(formData, "beforeProgramTitle"),
    beforeProgramNotes: textList(formData, "beforeProgramNotes"),
    seo: {
      title: text(formData, "seo.title"),
      description: text(formData, "seo.description"),
      image:
        seoImage === null ? undefined : (seoImage ?? base.seo?.image),
    },
  };

  try {
    await saveDocument({
      type: "program",
      slug,
      data: program,
      published: checkbox(formData, "published"),
    });

    if (originalSlug && originalSlug !== slug) {
      await deleteDocument("program", originalSlug);
      refreshAffectedPages(originalSlug);
    }
  } catch (error) {
    console.error("Failed to save program.", error);
    return { error: "The program could not be saved. Please try again." };
  }

  refreshAffectedPages(slug);
  redirect(`/admin/programs?saved=${encodeURIComponent(slug)}`);
}

export async function hideProgram(formData: FormData): Promise<void> {
  await assertCmsSession();

  const slug = text(formData, "slug");
  if (!slug) return;

  await setDocumentHidden("program", slug, true);

  refreshAffectedPages(slug);
  redirect("/admin/programs");
}

export async function restoreProgram(formData: FormData): Promise<void> {
  await assertCmsSession();

  const slug = text(formData, "slug");
  if (!slug) return;

  await setDocumentHidden("program", slug, false);

  refreshAffectedPages(slug);
  redirect("/admin/programs");
}
