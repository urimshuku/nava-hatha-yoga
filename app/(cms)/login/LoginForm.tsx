"use client";

import { useActionState } from "react";

import { login, type LoginState } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-charcoal"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="w-full rounded border border-border bg-white px-4 py-3 text-base outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
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
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
