import { textToPortableText } from "./portable-text";
import { joinPath, type DocumentSchema, type FieldDef } from "./schema";

/**
 * Turns a submitted form back into a document, guided by the same schema that
 * rendered it. Because the form always contains every field of the page, the
 * result is the complete document rather than a patch, which keeps saving free
 * of merge surprises.
 *
 * Naming contract with the renderer:
 *   plain fields   `hero.headline`
 *   images         `hero.image__json`   (JSON, so Sanity images round-trip)
 *   simple lists   `highlights__item`   (repeated)
 *   repeatable rows`sections__index`    (repeated, one per surviving row)
 */

function readText(formData: FormData, path: string): string | undefined {
  const value = formData.get(path);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function readJson(formData: FormData, path: string): unknown {
  const value = formData.get(`${path}__json`);
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function readIndices(formData: FormData, path: string): number[] {
  return formData
    .getAll(`${path}__index`)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 0);
}

/** True when a row carries no content and should not be saved. */
function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.every(isEmpty);
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !key.startsWith("_"))
      .every(([, entry]) => isEmpty(entry));
  }
  return false;
}

function newKey(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

function readField(
  field: FieldDef,
  formData: FormData,
  prefix: string,
): unknown {
  const path = joinPath(prefix, field.name);

  switch (field.kind) {
    case "text":
    case "textarea":
      return readText(formData, path);

    case "date": {
      const value = readText(formData, path);
      return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined;
    }

    case "number": {
      const value = Number(readText(formData, path));
      return Number.isFinite(value) ? value : undefined;
    }

    case "select":
      return readText(formData, path);

    case "checkbox":
      return formData.get(path) === "on";

    case "richtext": {
      const value = formData.get(path);
      if (typeof value !== "string" || !value.trim()) return undefined;
      return textToPortableText(value);
    }

    case "list": {
      const items = formData
        .getAll(`${path}__item`)
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean);
      return items.length > 0 ? items : undefined;
    }

    case "image":
      return readJson(formData, path) ?? undefined;

    case "gallery": {
      const images = readIndices(formData, path)
        .map((index) => readJson(formData, `${path}.${index}`))
        .filter(Boolean)
        .map((image) => ({ _key: newKey(), ...(image as object) }));
      return images.length > 0 ? images : undefined;
    }

    case "group": {
      const group = readFields(field.fields, formData, path);
      return isEmpty(group) ? undefined : group;
    }

    case "rows": {
      const rows = readIndices(formData, path)
        .map((index) => readFields(field.fields, formData, `${path}.${index}`))
        .filter((row) => !isEmpty(row))
        .map((row) => ({ _key: newKey(), ...row }));
      return rows.length > 0 ? rows : undefined;
    }
  }
}

function readFields(
  fields: FieldDef[],
  formData: FormData,
  prefix: string,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    const value = readField(field, formData, prefix);
    if (value !== undefined) {
      result[field.name] = value;
    }
  }

  return result;
}

/** The document described by a schema, read out of a submitted form. */
export function readDocument<T>(
  schema: DocumentSchema,
  formData: FormData,
): T {
  const fields = schema.sections.flatMap((section) => section.fields);
  return readFields(fields, formData, "") as T;
}
