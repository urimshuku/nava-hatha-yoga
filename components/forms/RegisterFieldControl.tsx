"use client";

import {
  formFieldClass,
  formErrorClass,
  formLabelClass,
} from "@/components/forms/form-styles";
import type { RegisterFormField } from "@/lib/register-config";
import { cn } from "@/lib/utils";

function RequiredMark() {
  return <span className="text-saffron">*</span>;
}

export function RegisterFieldControl({
  field,
  id,
  value,
  onChange,
  error,
}: {
  field: RegisterFormField;
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const labelClass = formLabelClass;
  const fieldClass = formFieldClass;
  const required = field.required ? (
    <>
      {" "}
      <RequiredMark />
    </>
  ) : null;

  if (field.type === "select") {
    return (
      <div>
        <label htmlFor={id} className={labelClass}>
          {field.label}
          {required}
        </label>
        <select
          id={id}
          className={fieldClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{field.placeholder || "Select (optional)"}</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error ? (
          <p role="alert" className={formErrorClass}>
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="sm:col-span-2">
        <label htmlFor={id} className={labelClass}>
          {field.label}
          {required}
        </label>
        <textarea
          id={id}
          rows={2}
          className={cn(fieldClass, "resize-y")}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        {error ? (
          <p role="alert" className={formErrorClass}>
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const inputType =
    field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text";

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {field.label}
        {required}
      </label>
      <input
        id={id}
        type={inputType}
        autoComplete={
          field.key === "fullName"
            ? "name"
            : field.key === "email"
              ? "email"
              : field.key === "phone" || field.key === "emergencyPhone"
                ? "tel"
                : undefined
        }
        inputMode={field.key === "age" ? "numeric" : undefined}
        className={fieldClass}
        value={value}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p role="alert" className={formErrorClass}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
