"use client";

import { useActionState } from "react";

import { changePassword, type ChangePasswordState } from "./actions";

const fieldClass =
  "w-full rounded border border-border bg-white px-4 py-3 text-base outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20";
const labelClass = "mb-2 block text-sm font-medium text-charcoal";

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState<
    ChangePasswordState,
    FormData
  >(changePassword, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="currentPassword" className={labelClass}>
          Current password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="newPassword" className={labelClass}>
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={fieldClass}
        />
        <p className="mt-2 text-xs text-brown">At least 8 characters.</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={fieldClass}
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded border border-saffron/30 bg-saffron/5 px-4 py-3 text-sm text-saffron-hover"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-saffron px-4 py-3 text-base font-medium text-white transition-colors hover:bg-saffron-hover disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
