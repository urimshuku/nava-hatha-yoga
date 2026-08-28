/**
 * Field definitions for the editor.
 *
 * Every editable page is described once, as data, and both the form and the
 * save action are driven from that description. Adding a field to the website
 * therefore means adding one line here rather than writing a form, a parser and
 * a save action by hand.
 *
 * These objects cross the server/client boundary, so they must stay plain data.
 */

interface FieldBase {
  /** Key within its parent object. Paths are built by joining with dots. */
  name: string;
  label: string;
  /** Plain-language note about where the value appears on the website. */
  hint?: string;
}

export type FieldDef =
  | (FieldBase & {
      kind: "text";
      required?: boolean;
      placeholder?: string;
    })
  | (FieldBase & { kind: "textarea"; rows?: number })
  | (FieldBase & { kind: "richtext" })
  | (FieldBase & { kind: "date" })
  | (FieldBase & { kind: "checkbox" })
  | (FieldBase & { kind: "number" })
  | (FieldBase & {
      kind: "select";
      options: { value: string; label: string }[];
      placeholder?: string;
    })
  /** A list of plain lines, such as bullet points. */
  | (FieldBase & { kind: "list"; placeholder?: string })
  | (FieldBase & { kind: "image" })
  /** A list of images, such as a retreat gallery. */
  | (FieldBase & { kind: "gallery" })
  /** A nested object, shown as an indented block. */
  | (FieldBase & { kind: "group"; fields: FieldDef[] })
  /** A list of nested objects the editor can add to, reorder and remove. */
  | (FieldBase & {
      kind: "rows";
      /** Singular noun for the add button, e.g. "card". */
      itemLabel: string;
      fields: FieldDef[];
      /** Field to show in the collapsed row header. Defaults to the first text field. */
      titleField?: string;
    });

export interface SchemaSection {
  title: string;
  description?: string;
  fields: FieldDef[];
}

export interface DocumentSchema {
  /** Heading of the editing page. */
  title: string;
  description?: string;
  /** Path on the website this edits, shown as a "View page" link. */
  previewPath?: string;
  sections: SchemaSection[];
}

/** Reads a dotted path such as `hero.primaryCta.label` out of a document. */
export function valueAtPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current === null || current === undefined) return undefined;
    if (Array.isArray(current)) return current[Number(segment)];
    if (typeof current === "object") {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);
}

export function joinPath(prefix: string, name: string): string {
  return prefix ? `${prefix}.${name}` : name;
}

/** Every field in a schema, flattened, with its full path. */
export function flattenFields(
  fields: FieldDef[],
  prefix = "",
): { path: string; field: FieldDef }[] {
  return fields.flatMap((field) => {
    const path = joinPath(prefix, field.name);
    if (field.kind === "group") {
      return [{ path, field }, ...flattenFields(field.fields, path)];
    }
    return [{ path, field }];
  });
}
