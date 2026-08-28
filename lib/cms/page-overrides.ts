import { getDocument, SINGLETON_SLUG, type CmsDocumentType } from "./repository";

/**
 * Published CMS page, if one exists. Callers fall back to lib/placeholders.ts.
 */

export async function getPageOverride<T>(
  type: CmsDocumentType,
  slug: string = SINGLETON_SLUG,
): Promise<T | undefined> {
  const document = await getDocument<T>(type, slug);
  if (!document || !document.published) return undefined;
  return document.data;
}

/** CMS data, otherwise the provided fallback (usually a placeholder). */
export async function withPageOverride<T>(
  type: CmsDocumentType,
  fromSanity: T,
  slug: string = SINGLETON_SLUG,
): Promise<T> {
  return (await getPageOverride<T>(type, slug)) ?? fromSanity;
}
