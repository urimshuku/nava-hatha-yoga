import {
  getDocument,
  publicPayload,
  SINGLETON_SLUG,
  type CmsDocumentType,
} from "./repository";

/**
 * Published CMS page, if one exists. Callers fall back to lib/placeholders.ts.
 * Uses the last published snapshot so a Save in the editor does not change the
 * website.
 */

export async function getPageOverride<T>(
  type: CmsDocumentType,
  slug: string = SINGLETON_SLUG,
): Promise<T | undefined> {
  const document = await getDocument<T>(type, slug);
  if (!document) return undefined;
  return publicPayload(document);
}

/** CMS data, otherwise the provided fallback (usually a placeholder). */
export async function withPageOverride<T>(
  type: CmsDocumentType,
  fromSanity: T,
  slug: string = SINGLETON_SLUG,
): Promise<T> {
  return (await getPageOverride<T>(type, slug)) ?? fromSanity;
}
