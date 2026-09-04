"use client";

import { useEffect, useState } from "react";

import { formatSessionHoursRange, sessionDayLabelsBetween } from "@/lib/utils";

import { Field, inputClassName } from "./Field";
import { RowActions } from "./RowActions";

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

const iconButtonClassName =
  "inline-flex h-[2.625rem] w-[2.625rem] shrink-0 items-center justify-center rounded border border-border text-brown transition-colors hover:border-saffron hover:text-saffron";

const addButtonClassName =
  "mt-1 rounded border border-dashed border-border-strong px-3 py-2 text-sm text-brown transition-colors hover:border-saffron hover:text-saffron";

function IconPlus() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M8 3.25v9.5M3.25 8h9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

  function moveRow(id: string, direction: -1 | 1) {
    setRows((current) => {
      const position = current.findIndex((row) => row.id === id);
      const target = position + direction;
      if (position < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[position], next[target]] = [next[target], next[position]];
      return next;
    });
  }

  function duplicateRow(id: string) {
    setRows((current) => {
      const position = current.findIndex((row) => row.id === id);
      if (position < 0) return current;
      const next = [...current];
      next.splice(position + 1, 0, {
        id: nextRowId(),
        value: current[position].value,
      });
      return next;
    });
  }

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-wrap gap-2">
            <input
              type="text"
              name={name}
              value={row.value}
              onChange={(event) =>
                setRows((current) =>
                  current.map((entry) =>
                    entry.id === row.id
                      ? { ...entry, value: event.target.value }
                      : entry,
                  ),
                )
              }
              placeholder={placeholder}
              className={`${inputClassName} min-w-0 flex-1`}
            />
            <RowActions
              noun="line"
              onUp={() => moveRow(row.id, -1)}
              onDown={() => moveRow(row.id, 1)}
              onDuplicate={() => duplicateRow(row.id)}
              onRemove={() =>
                setRows((current) =>
                  current.length === 1
                    ? current
                    : current.filter((entry) => entry.id !== row.id),
                )
              }
            />
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

function sameSessionDay(left?: string, right?: string): boolean {
  const a = left?.trim();
  const b = right?.trim();
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

export function SessionsField({
  label,
  hint,
  defaultValues = [],
  firstDay,
  lastDay,
}: {
  label: string;
  hint?: string;
  defaultValues?: SessionRow[];
  firstDay?: string;
  lastDay?: string;
}) {
  const [rows, setRows] = useState(() => toRows<SessionRow>(defaultValues, {}));

  useEffect(() => {
    const labels = sessionDayLabelsBetween(firstDay, lastDay);
    if (labels.length === 0) return;

    setRows((current) => {
      if (current.some((row) => row.value.hours?.trim() || row.value.day?.trim())) {
        return current;
      }
      return labels.map((day) => ({
        id: nextRowId(),
        value: { day, hours: "" },
      }));
    });
  }, [firstDay, lastDay]);

  function updateRow(id: string, patch: SessionRow) {
    setRows((current) => {
      const index = current.findIndex((row) => row.id === id);
      if (index < 0) return current;

      const previousDay = current[index].value.day;
      let stillInGroup = true;

      return current.map((row, rowIndex) => {
        if (rowIndex < index) return row;
        if (rowIndex === index) {
          return { ...row, value: { ...row.value, ...patch } };
        }
        if (patch.day === undefined) return row;
        if (!stillInGroup || !sameSessionDay(row.value.day, previousDay)) {
          stillInGroup = false;
          return row;
        }
        return { ...row, value: { ...row.value, day: patch.day } };
      });
    });
  }

  function addTimeOnSameDay(id: string) {
    setRows((current) => {
      const index = current.findIndex((row) => row.id === id);
      if (index < 0) return current;
      const day = current[index].value.day?.trim() ?? "";
      const next = [...current];
      next.splice(index + 1, 0, {
        id: nextRowId(),
        value: { day, hours: "" },
      });
      return next;
    });
  }

  function moveRow(id: string, direction: -1 | 1) {
    setRows((current) => {
      const position = current.findIndex((row) => row.id === id);
      const target = position + direction;
      if (position < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[position], next[target]] = [next[target], next[position]];
      return next;
    });
  }

  function duplicateRow(id: string) {
    setRows((current) => {
      const position = current.findIndex((row) => row.id === id);
      if (position < 0) return current;
      const next = [...current];
      next.splice(position + 1, 0, {
        id: nextRowId(),
        value: { ...current[position].value },
      });
      return next;
    });
  }

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {rows.map((row, index) => {
          const continuation = sameSessionDay(
            rows[index - 1]?.value.day,
            row.value.day,
          );

          return (
            <div
              key={row.id}
              className="flex flex-wrap items-center gap-2"
            >
              {continuation ? (
                <div className="min-w-0 flex-1 basis-40">
                  <input
                    type="hidden"
                    name="sessionDay"
                    value={row.value.day ?? ""}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  name="sessionDay"
                  value={row.value.day ?? ""}
                  placeholder="14 August"
                  onChange={(event) =>
                    updateRow(row.id, { day: event.target.value })
                  }
                  className={`${inputClassName} min-w-0 flex-1 basis-40`}
                />
              )}
              <input
                type="text"
                name="sessionHours"
                value={row.value.hours ?? ""}
                placeholder="16:30 – 18:30"
                onChange={(event) =>
                  updateRow(row.id, { hours: event.target.value })
                }
                onBlur={(event) =>
                  updateRow(row.id, {
                    hours: formatSessionHoursRange(event.target.value),
                  })
                }
                className={`${inputClassName} min-w-0 flex-1 basis-40`}
              />
              <button
                type="button"
                onClick={() => addTimeOnSameDay(row.id)}
                className={iconButtonClassName}
                aria-label="Add another time on this day"
              >
                <IconPlus />
              </button>
              <RowActions
                noun="session"
                onUp={() => moveRow(row.id, -1)}
                onDown={() => moveRow(row.id, 1)}
                onDuplicate={() => duplicateRow(row.id)}
                onRemove={() =>
                  setRows((current) =>
                    current.length === 1
                      ? current
                      : current.filter((entry) => entry.id !== row.id),
                  )
                }
              />
            </div>
          );
        })}
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
