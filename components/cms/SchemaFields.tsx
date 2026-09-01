"use client";

import { useId, useState } from "react";

import { portableTextToText } from "@/lib/cms/portable-text";
import { joinPath, type FieldDef } from "@/lib/cms/schema";

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

const removeButtonClassName =
  "shrink-0 rounded border border-border px-2.5 py-1.5 text-xs text-brown transition-colors hover:border-saffron hover:text-saffron";

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
  return (
    <>
      {fields.map((field) => (
        <SchemaField
          key={joinPath(prefix, field.name)}
          field={field}
          values={values}
          prefix={prefix}
        />
      ))}
    </>
  );
}

function SchemaField({
  field,
  values,
  prefix,
}: {
  field: FieldDef;
  values: unknown;
  prefix: string;
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
          defaultValue={asString(value)}
          options={field.options}
          placeholder={field.placeholder}
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
        />
      );
  }
}

/**
 * Repeatable rows keep their original index in a hidden input rather than being
 * renumbered, so removing the second of five rows cannot shuffle the values of
 * the inputs that stay on screen.
 */
function useIndexedRows<T>(initial: T[]) {
  const [rows, setRows] = useState(() =>
    initial.map((value, index) => ({ index, value })),
  );
  const [nextIndex, setNextIndex] = useState(initial.length);

  const add = (value: T) => {
    setRows((current) => [...current, { index: nextIndex, value }]);
    setNextIndex((current) => current + 1);
  };

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

  return { rows, add, remove, move };
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
  const { rows, add, remove } = useIndexedRows<string>(
    defaultValues.length > 0 ? defaultValues : [""],
  );

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.index} className="flex gap-2">
            <input
              type="text"
              name={`${path}__item`}
              defaultValue={row.value}
              placeholder={placeholder}
              className={inputClassName}
            />
            <button
              type="button"
              onClick={() => remove(row.index)}
              className={removeButtonClassName}
              aria-label={`Remove line from ${label}`}
            >
              Remove
            </button>
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
  const { rows, add, remove, move } = useIndexedRows(defaultValues);

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {rows.map((row, position) => (
          <div key={row.index} className="rounded border border-border p-3">
            <input type="hidden" name={`${path}__index`} value={row.index} />
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-brown">
                Photo {position + 1}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => move(row.index, -1)}
                  className={removeButtonClassName}
                  aria-label="Move photo earlier"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(row.index, 1)}
                  className={removeButtonClassName}
                  aria-label="Move photo later"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => remove(row.index)}
                  className={removeButtonClassName}
                >
                  Remove
                </button>
              </div>
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

function RowsField({
  path,
  label,
  hint,
  itemLabel,
  titleField,
  fields,
  defaultValues,
}: {
  path: string;
  label: string;
  hint?: string;
  itemLabel: string;
  titleField?: string;
  fields: FieldDef[];
  defaultValues: Record<string, unknown>[];
}) {
  const { rows, add, remove, move } = useIndexedRows(defaultValues);
  const groupId = useId();

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
                {titleField && asString(row.value[titleField])?.trim()
                  ? asString(row.value[titleField])
                  : `${itemLabel} ${position + 1}`}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => move(row.index, -1)}
                  className={removeButtonClassName}
                  aria-label={`Move ${itemLabel} earlier`}
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(row.index, 1)}
                  className={removeButtonClassName}
                  aria-label={`Move ${itemLabel} later`}
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => remove(row.index)}
                  className={removeButtonClassName}
                >
                  Remove
                </button>
              </div>
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

        <button type="button" onClick={() => add({})} className={addButtonClassName}>
          Add {itemLabel}
        </button>
      </div>
    </div>
  );
}
