"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

/**
 * Save controls, repeated at the top and bottom of long forms so the button is
 * always within reach.
 */
export function SaveBar({
  cancelHref,
  label = "Save",
}: {
  cancelHref: string;
  label?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center gap-4">
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-saffron px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saffron-hover disabled:opacity-60"
      >
        {pending ? "Saving…" : label}
      </button>
      <Link href={cancelHref} className="text-sm text-brown hover:text-saffron">
        Cancel
      </Link>
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded border border-saffron/30 bg-saffron/5 px-4 py-3 text-sm text-saffron-hover"
    >
      {message}
    </p>
  );
}
