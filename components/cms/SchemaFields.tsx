"use client";

import { useId, useState } from "react";

import { portableTextToText } from "@/lib/cms/portable-text";
import { readFields } from "@/lib/cms/schema-parse";
import { joinPath, type FieldDef } from "@/lib/cms/schema";

import { RowActions } from "./RowActions";

import {
  CheckboxField,
  Field,
  TextAreaField,
  TextField,
  SelectField,
  DateField,
  inputClassName,
  titleCaseLabel,
} from "./Field";
import { ImageField } from "./ImageField";
import { RichTextField } from "./RichTextField";

/**
 * Renders any schema. One component handles every editable page, so the pages
 * themselves only declare which fields exist and where the values come from.
 */

const addButtonClassName =
  "rounded border border-dashed border-border-strong px-3 py-2 text-sm text-brown transition-colors hover:border-saffron hover:text-saffron";

function asString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return undefined;
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function asRows(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (entry): entry is Record<string, unknown> =>
          Boolean(entry) && typeof entry === "object",
      )
    : [];
}

function cloneValue<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function formFromButton(button: HTMLElement): HTMLFormElement | null {
  const form = button.closest("form");
  return form instanceof HTMLFormElement ? form : null;
}

function childOf(values: unknown, name: string): unknown {
  return values && typeof values === "object"
    ? (values as Record<string, unknown>)[name]
    : undefined;
}

export function SchemaFields({
  fields,
  values,
  prefix = "",
}: {
  fields: FieldDef[];
  /**
   * The object holding exactly these fields. Nested levels receive their own
   * slice, while `prefix` carries the full dotted path used for input names.
   */
  values: unknown;
  prefix?: string;
}) {
  const [live, setLive] = useState<Record<string, string>>({});
  const watched = new Set(
    fields.flatMap((field) =>
      field.visibleWhen ? [field.visibleWhen.name] : [],
    ),
  );

  function current(name: string): string | undefined {
    if (Object.prototype.hasOwnProperty.call(live, name)) return live[name];
    const stored = asString(childOf(values, name));
    if (stored) return stored;
    const field = fields.find((item) => item.name === name);
    if (field?.kind === "select" && !field.placeholder) {
      return field.options[0]?.value;
    }
    return stored;
  }

  return (
    <>
      {fields.map((field) => {
        const path = joinPath(prefix, field.name);
        if (field.hidden) {
          return (
            <input
              key={path}
              type="hidden"
              name={path}
              defaultValue={asString(childOf(values, field.name)) ?? ""}
            />
          );
        }
        if (
          field.visibleWhen &&
          current(field.visibleWhen.name) !== field.visibleWhen.equals
        ) {
          return null;
        }
        return (
          <SchemaField
            key={path}
            field={field}
            values={values}
            prefix={prefix}
            onLiveChange={
              watched.has(field.name)
                ? (value) =>
                    setLive((prev) =>
                      prev[field.name] === value
                        ? prev
                        : { ...prev, [field.name]: value },
                    )
                : undefined
            }
          />
        );
      })}
    </>
  );
}

function SchemaField({
  field,
  values,
  prefix,
  onLiveChange,
}: {
  field: FieldDef;
  values: unknown;
  prefix: string;
  onLiveChange?: (value: string) => void;
}) {
  const path = joinPath(prefix, field.name);
  const value = childOf(values, field.name);

  switch (field.kind) {
    case "text":
      return (
        <TextField
          name={path}
          label={field.label}
          hint={field.hint}
          defaultValue={asString(value)}
          required={field.required}
          placeholder={field.placeholder}
        />
      );

    case "textarea":
      return (
        <TextAreaField
          name={path}
          label={field.label}
          hint={field.hint}
          defaultValue={asString(value)}
          rows={field.rows}
        />
      );

    case "number":
      return (
        <Field label={field.label} hint={field.hint} htmlFor={path}>
          <input
            id={path}
            name={path}
            type="number"
            defaultValue={asString(value)}
            className={inputClassName}
          />
        </Field>
      );

    case "date":
      return (
        <DateField
          name={path}
          label={field.label}
          hint={field.hint}
          defaultValue={asString(value)}
        />
      );

    case "select":
      return (
        <SelectField
          name={path}
          label={field.label}
          hint={field.hint}
          defaultValue={
            asString(value) ||
            (field.placeholder ? "" : field.options[0]?.value)
          }
          options={field.options}
          placeholder={field.placeholder}
          onChange={
            onLiveChange
              ? (event) => onLiveChange(event.target.value)
              : undefined
          }
        />
      );

    case "checkbox":
      return (
        <CheckboxField
          name={path}
          label={field.label}
          hint={field.hint}
          defaultChecked={value === true}
        />
      );

    case "richtext":
      return (
        <RichTextField
          name={path}
          label={field.label}
          hint={field.hint}
          defaultValue={portableTextToText(
            Array.isArray(value) ? value : undefined,
          )}
        />
      );

    case "image":
      return (
        <ImageField
          name={path}
          label={field.label}
          hint={field.hint}
          value={
            value && typeof value === "object"
              ? (value as Record<string, unknown>)
              : null
          }
        />
      );

    case "list":
      return (
        <ListField
          path={path}
          label={field.label}
          hint={field.hint}
          placeholder={field.placeholder}
          defaultValues={asStringList(value)}
        />
      );

    case "gallery":
      return (
        <GalleryField
          path={path}
          label={field.label}
          hint={field.hint}
          defaultValues={asRows(value)}
        />
      );

    case "group":
      return (
        <fieldset className="rounded border border-border bg-cream/40 p-4">
          <legend className="px-1 text-sm font-semibold text-charcoal">
            {titleCaseLabel(field.label)}
          </legend>
          {field.hint ? (
            <p className="mb-3 text-xs text-brown">{field.hint}</p>
          ) : null}
          <div className="space-y-4">
            <SchemaFields fields={field.fields} values={value} prefix={path} />
          </div>
        </fieldset>
      );

    case "rows":
      return (
        <RowsField
          path={path}
          label={field.label}
          hint={field.hint}
          itemLabel={field.itemLabel}
          titleField={field.titleField}
          fields={field.fields}
          defaultValues={asRows(value)}
          defaultItem={field.defaultItem}
        />
      );
  }
}

/**
 * Repeatable rows keep their original index in a hidden input rather than being
 * renumbered, so removing the second of five rows cannot shuffle the values of
 * the inputs that stay on screen.
 */
function nextRowIndex(rows: { index: number }[]): number {
  return rows.reduce((max, row) => Math.max(max, row.index), -1) + 1;
}

function useIndexedRows<T>(initial: T[]) {
  const [rows, setRows] = useState(() =>
    initial.map((value, index) => ({ index, value })),
  );

  const add = (value: T) => {
    setRows((current) => [
      ...current,
      { index: nextRowIndex(current), value },
    ]);
  };

  const insertAfter = (index: number, value: T) => {
    setRows((current) => {
      const position = current.findIndex((row) => row.index === index);
      const inserted = { index: nextRowIndex(current), value };
      if (position < 0) return [...current, inserted];
      const next = [...current];
      next.splice(position + 1, 0, inserted);
      return next;
    });
  };

  const update = (index: number, value: T) =>
    setRows((current) =>
      current.map((row) => (row.index === index ? { ...row, value } : row)),
    );

  const remove = (index: number) =>
    setRows((current) => current.filter((row) => row.index !== index));

  const move = (index: number, direction: -1 | 1) =>
    setRows((current) => {
      const position = current.findIndex((row) => row.index === index);
      const target = position + direction;
      if (position < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[position], next[target]] = [next[target], next[position]];
      return next;
    });

  return { rows, add, insertAfter, update, remove, move };
}

function ListField({
  path,
  label,
  hint,
  placeholder,
  defaultValues,
}: {
  path: string;
  label: string;
  hint?: string;
  placeholder?: string;
  defaultValues: string[];
}) {
  const { rows, add, insertAfter, update, remove, move } = useIndexedRows<string>(
    defaultValues.length > 0 ? defaultValues : [""],
  );

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.index} className="flex flex-wrap gap-2">
            <input
              type="text"
              name={`${path}__item`}
              value={row.value}
              onChange={(event) => update(row.index, event.target.value)}
              placeholder={placeholder}
              className={`${inputClassName} min-w-0 flex-1`}
            />
            <RowActions
              noun="line"
              onUp={() => move(row.index, -1)}
              onDown={() => move(row.index, 1)}
              onDuplicate={() => insertAfter(row.index, row.value)}
              onRemove={() => remove(row.index)}
            />
          </div>
        ))}
        <button type="button" onClick={() => add("")} className={addButtonClassName}>
          Add line
        </button>
      </div>
    </Field>
  );
}

function GalleryField({
  path,
  label,
  hint,
  defaultValues,
}: {
  path: string;
  label: string;
  hint?: string;
  defaultValues: Record<string, unknown>[];
}) {
  const { rows, add, insertAfter, remove, move } = useIndexedRows(defaultValues);

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {rows.map((row, position) => (
          <div key={row.index} className="rounded border border-border p-3">
            <input type="hidden" name={`${path}__index`} value={row.index} />
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-brown">
                Photo {position + 1}
              </p>
              <RowActions
                noun="photo"
                onUp={() => move(row.index, -1)}
                onDown={() => move(row.index, 1)}
                onDuplicate={(event) => {
                  const form = formFromButton(event.currentTarget);
                  const json = form
                    ? form.querySelector(
                        `input[name="${path}.${row.index}__json"]`,
                      )
                    : null;
                  const raw =
                    json instanceof HTMLInputElement ? json.value : "";
                  let value: Record<string, unknown> = cloneValue(row.value);
                  if (raw.trim()) {
                    try {
                      const parsed = JSON.parse(raw) as unknown;
                      if (parsed && typeof parsed === "object") {
                        value = parsed as Record<string, unknown>;
                      }
                    } catch {
                      value = cloneValue(row.value);
                    }
                  }
                  insertAfter(row.index, value);
                }}
                onRemove={() => remove(row.index)}
              />
            </div>
            <ImageField
              name={`${path}.${row.index}`}
              label="Photo"
              value={row.value}
            />
          </div>
        ))}
        <button type="button" onClick={() => add({})} className={addButtonClassName}>
          Add photo
        </button>
      </div>
    </Field>
  );
}

function rowHeading(
  row: Record<string, unknown>,
  position: number,
  itemLabel: string,
  titleField: string | undefined,
  fields: FieldDef[],
): string {
  const titled = titleField ? asString(row[titleField])?.trim() : undefined;
  if (titled) return titled;
  const kindField = fields.find((field) => field.name === "kind");
  if (kindField?.kind === "select") {
    const kind = asString(row.kind);
    const kindLabel = kindField.options.find((option) => option.value === kind)
      ?.label;
    if (kindLabel) return `${itemLabel} ${position + 1} — ${kindLabel}`;
  }
  return `${itemLabel} ${position + 1}`;
}

function RowsField({
  path,
  label,
  hint,
  itemLabel,
  titleField,
  fields,
  defaultValues,
  defaultItem,
}: {
  path: string;
  label: string;
  hint?: string;
  itemLabel: string;
  titleField?: string;
  fields: FieldDef[];
  defaultValues: Record<string, unknown>[];
  defaultItem?: Record<string, unknown>;
}) {
  const { rows, add, insertAfter, remove, move } = useIndexedRows(defaultValues);
  const groupId = useId();

  function duplicateRow(rowIndex: number, button: HTMLElement) {
    const form = formFromButton(button);
    if (form) {
      insertAfter(
        rowIndex,
        readFields(fields, new FormData(form), `${path}.${rowIndex}`),
      );
      return;
    }
    insertAfter(
      rowIndex,
      cloneValue(rows.find((row) => row.index === rowIndex)?.value ?? {}),
    );
  }

  return (
    <div>
      <div className="mb-2">
        <p className="text-sm font-medium text-charcoal">{titleCaseLabel(label)}</p>
        {hint ? <p className="mt-1 text-xs text-brown">{hint}</p> : null}
      </div>

      <div className="space-y-3">
        {rows.map((row, position) => (
          <div
            key={`${groupId}-${row.index}`}
            className="rounded border border-border bg-white p-4"
          >
            <input type="hidden" name={`${path}__index`} value={row.index} />

            <div className="mb-3 flex items-center justify-between gap-2 border-b border-border pb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-brown">
                {rowHeading(row.value, position, itemLabel, titleField, fields)}
              </p>
              <RowActions
                noun={itemLabel}
                onUp={() => move(row.index, -1)}
                onDown={() => move(row.index, 1)}
                onDuplicate={(event) =>
                  duplicateRow(row.index, event.currentTarget)
                }
                onRemove={() => remove(row.index)}
              />
            </div>

            <div className="space-y-4">
              <SchemaFields
                fields={fields}
                values={row.value}
                prefix={`${path}.${row.index}`}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => add(defaultItem ? { ...defaultItem } : {})}
          className={addButtonClassName}
        >
          Add {itemLabel}
        </button>
      </div>
    </div>
  );
}
