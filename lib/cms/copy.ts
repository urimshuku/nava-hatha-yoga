import { getDocument, type CmsDocumentType } from "./repository";

/** First free slug, trying `preferred` then `preferred-2`, `preferred-3`, … */
export async function nextAvailableSlug(
  type: CmsDocumentType,
  preferred: string,
): Promise<string> {
  if (!(await getDocument(type, preferred))) return preferred;

  for (let n = 2; n < 1000; n += 1) {
    const candidate = `${preferred}-${n}`;
    if (!(await getDocument(type, candidate))) return candidate;
  }

  throw new Error(`Could not find a free web address near "${preferred}".`);
}

/** "Sunrise session" → "Sunrise session (copy)"; a second copy becomes "(copy 2)". */
export function titleForCopy(title: string): string {
  const trimmed = title.trim() || "Untitled";
  const match = /^(.*?)(?: \(copy(?: (\d+))?\))$/.exec(trimmed);
  if (!match) return `${trimmed} (copy)`;

  const base = match[1];
  const next = match[2] ? Number(match[2]) + 1 : 2;
  return `${base} (copy ${next})`;
}
