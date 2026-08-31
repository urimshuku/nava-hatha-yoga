import type { ChangeEvent, ReactNode } from "react";

import { toDateInputValue } from "@/lib/utils";

/** Each word in a field or section title starts with a capital letter. */
export function titleCaseLabel(label: string): string {
  return label.replace(/[A-Za-zÀ-ÿ]+(?:'[A-Za-zÀ-ÿ]+)?/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1),
  );
}

/**
 * One labelled row in an editing form. Every field carries a plain-language hint
 * about where the value shows up on the website.
 */
export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-charcoal"
      >
        {titleCaseLabel(label)}
      </label>
      {hint ? <p className="mb-2 text-xs text-brown">{hint}</p> : null}
      {children}
    </div>
  );
}

export const inputClassName =
  "w-full rounded border border-border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-saffron focus:ring-2 focus:ring-saffron/20";

export function TextField({
  name,
  label,
  hint,
  defaultValue,
  value,
  onChange,
  required,
  placeholder,
  readOnly,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <Field label={label} hint={hint} htmlFor={name}>
      <input
        id={name}
        name={name}
        type="text"
        required={required}
        placeholder={placeholder}
        readOnly={readOnly}
        className={
          readOnly
            ? `${inputClassName} cursor-default bg-sand/50 text-brown`
            : inputClassName
        }
        {...(value != null
          ? { value, onChange }
          : { defaultValue })}
      />
    </Field>
  );
}

export function DateField({
  name,
  label,
  hint,
  defaultValue,
  value,
  required,
  onChange,
}: {
  name: string;
  label: string;
  hint?: string;
  /** Any ISO timestamp; only the date part is used. */
  defaultValue?: string;
  /** YYYY-MM-DD when the date is driven by React state. */
  value?: string;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Field label={label} hint={hint} htmlFor={name}>
      <input
        id={name}
        name={name}
        type="date"
        lang="en-GB"
        required={required}
        onChange={onChange}
        className={inputClassName}
        {...(value != null
          ? { value }
          : { defaultValue: toDateInputValue(defaultValue) })}
      />
    </Field>
  );
}

export function TextAreaField({
  name,
  label,
  hint,
  defaultValue,
  rows = 4,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <Field label={label} hint={hint} htmlFor={name}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className={inputClassName}
      />
    </Field>
  );
}

export function SelectField({
  name,
  label,
  hint,
  defaultValue,
  value,
  onChange,
  options,
  placeholder,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint} htmlFor={name}>
      <select
        id={name}
        name={name}
        className={inputClassName}
        {...(value != null
          ? { value, onChange }
          : { defaultValue: defaultValue ?? "" })}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckboxField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded border border-border bg-white px-3 py-3">
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-saffron"
      />
      <div>
        <label htmlFor={name} className="text-sm font-medium text-charcoal">
          {titleCaseLabel(label)}
        </label>
        {hint ? <p className="mt-1 text-xs text-brown">{hint}</p> : null}
      </div>
    </div>
  );
}
