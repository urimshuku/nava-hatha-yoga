"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * Save keeps a working copy in the editor. Publish puts that copy on the
 * website. Repeated at the top and bottom of long forms so the buttons stay
 * within reach.
 */
export function SaveBar({ cancelHref }: { cancelHref: string }) {
  const { pending } = useFormStatus();
  const [intent, setIntent] = useState<"save" | "publish" | null>(null);

  return (
    <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
      <div className="flex items-center gap-3">
        <button
          type="submit"
          name="intent"
          value="save"
          disabled={pending}
          onClick={() => setIntent("save")}
          className="rounded border border-border-strong bg-white px-5 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-saffron hover:text-saffron disabled:opacity-60"
        >
          {pending && intent === "save" ? "Saving…" : "Save"}
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending}
          onClick={() => setIntent("publish")}
          className="rounded bg-saffron px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-saffron-hover disabled:opacity-60"
        >
          {pending && intent === "publish" ? "Publishing…" : "Publish"}
        </button>
        <Link href={cancelHref} className="text-sm text-brown hover:text-saffron">
          Cancel
        </Link>
      </div>
      <p className="max-w-xs text-right text-xs text-brown">
        Save keeps your work in the editor. Publish puts it on the website.
      </p>
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
