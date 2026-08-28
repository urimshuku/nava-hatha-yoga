"use client";

import { useState } from "react";

import { Field, inputClassName } from "./Field";

/**
 * Rows are submitted as repeated form fields with the same name, so the server
 * action reads them with formData.getAll(name) and keeps their order.
 */

let rowId = 0;
function nextRowId(): string {
  rowId += 1;
  return `row-${rowId}`;
}

function toRows<T>(values: T[], empty: T): { id: string; value: T }[] {
  const source = values.length > 0 ? values : [empty];
  return source.map((value) => ({ id: nextRowId(), value }));
}

const removeButtonClassName =
  "shrink-0 rounded border border-border px-2.5 py-2 text-xs text-brown transition-colors hover:border-saffron hover:text-saffron";

const addButtonClassName =
  "mt-1 rounded border border-dashed border-border-strong px-3 py-2 text-sm text-brown transition-colors hover:border-saffron hover:text-saffron";

export function TextListField({
  name,
  label,
  hint,
  addLabel,
  placeholder,
  defaultValues = [],
}: {
  name: string;
  label: string;
  hint?: string;
  addLabel: string;
  placeholder?: string;
  defaultValues?: string[];
}) {
  const [rows, setRows] = useState(() => toRows(defaultValues, ""));

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex gap-2">
            <input
              type="text"
              name={name}
              defaultValue={row.value}
              placeholder={placeholder}
              className={inputClassName}
            />
            <button
              type="button"
              onClick={() =>
                setRows((current) =>
                  current.length === 1
                    ? current
                    : current.filter((entry) => entry.id !== row.id),
                )
              }
              className={removeButtonClassName}
              aria-label={`Remove ${label} row`}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setRows((current) => [...current, { id: nextRowId(), value: "" }])
          }
          className={addButtonClassName}
        >
          {addLabel}
        </button>
      </div>
    </Field>
  );
}

export interface SessionRow {
  day?: string;
  hours?: string;
}

export function SessionsField({
  label,
  hint,
  defaultValues = [],
}: {
  label: string;
  hint?: string;
  defaultValues?: SessionRow[];
}) {
  const [rows, setRows] = useState(() => toRows<SessionRow>(defaultValues, {}));

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-wrap gap-2 sm:flex-nowrap">
            <input
              type="text"
              name="sessionDay"
              defaultValue={row.value.day ?? ""}
              placeholder="14 August"
              className={inputClassName}
            />
            <input
              type="text"
              name="sessionHours"
              defaultValue={row.value.hours ?? ""}
              placeholder="16:30 – 18:30"
              className={inputClassName}
            />
            <button
              type="button"
              onClick={() =>
                setRows((current) =>
                  current.length === 1
                    ? current
                    : current.filter((entry) => entry.id !== row.id),
                )
              }
              className={removeButtonClassName}
              aria-label="Remove session"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setRows((current) => [...current, { id: nextRowId(), value: {} }])
          }
          className={addButtonClassName}
        >
          Add another session
        </button>
      </div>
    </Field>
  );
}
