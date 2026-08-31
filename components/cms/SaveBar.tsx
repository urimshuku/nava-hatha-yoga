"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useFormStatus } from "react-dom";

/**
 * Save keeps a working copy in the editor. Publish writes the current form
 * and puts it on the website in one step — no separate Save is required.
 * Repeated at the top and bottom of long forms so the buttons stay within reach.
 *
 * React's server-action FormData often omits the clicked submit button, so
 * intent is stored on a hidden field updated synchronously on click.
 */
function markFormIntent(
  form: HTMLFormElement | null,
  intent: "save" | "publish",
) {
  if (!form) return;
  const fields = form.querySelectorAll<HTMLInputElement>(
    "input[data-cms-intent]",
  );
  for (const field of fields) {
    field.value = intent;
  }
}

export function SaveBar({ cancelHref }: { cancelHref: string }) {
  const { pending } = useFormStatus();
  const [intent, setIntent] = useState<"save" | "publish" | null>(null);

  function onIntentClick(next: "save" | "publish") {
    return (event: MouseEvent<HTMLButtonElement>) => {
      setIntent(next);
      markFormIntent(event.currentTarget.form, next);
    };
  }

  return (
    <div className="ml-auto flex shrink-0 items-center gap-3">
      <input
        type="hidden"
        name="intent"
        data-cms-intent=""
        defaultValue="save"
      />
      <button
        type="submit"
        disabled={pending}
        onClick={onIntentClick("save")}
        className="rounded border border-border-strong bg-white px-5 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-saffron hover:text-saffron disabled:opacity-60"
      >
        {pending && intent === "save" ? "Saving…" : "Save"}
      </button>
      <button
        type="submit"
        disabled={pending}
        onClick={onIntentClick("publish")}
        className="rounded bg-saffron px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saffron-hover disabled:opacity-60"
      >
        {pending && intent === "publish" ? "Publishing…" : "Publish"}
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

export function FormNotice({
  kind,
}: {
  kind?: "saved" | "published" | "deleted";
}) {
  if (kind === "saved") {
    return (
      <p className="rounded border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-brown">
        Saved. It is not on the website until you publish.
      </p>
    );
  }

  if (kind === "published") {
    return (
      <p className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        Published. The website is showing this now.
      </p>
    );
  }

  if (kind === "deleted") {
    return (
      <p className="rounded border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-brown">
        Deleted. It is no longer on the website.
      </p>
    );
  }

  return null;
}

/** Shown when reopening a working copy that is not on the website yet. */
export function WorkingCopyBanner({
  published,
  unpublishedChanges,
}: {
  published?: boolean;
  unpublishedChanges?: boolean;
}) {
  if (!published) {
    return (
      <p className="rounded border border-saffron/30 bg-saffron/5 px-4 py-3 text-sm text-saffron-hover">
        This is saved but not on the website yet. Publish to put it live.
      </p>
    );
  }

  if (unpublishedChanges) {
    return (
      <p className="rounded border border-saffron/30 bg-saffron/5 px-4 py-3 text-sm text-saffron-hover">
        You have saved changes that are not on the website yet. Publish to
        update the live page.
      </p>
    );
  }

  return null;
}
