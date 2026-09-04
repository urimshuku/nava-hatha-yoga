"use client";

import type { MouseEvent } from "react";

const buttonClassName =
  "shrink-0 rounded border border-border px-2.5 py-1.5 text-xs text-brown transition-colors hover:border-saffron hover:text-saffron";

/** Duplicate / Remove for a repeatable CMS row. */
export function RowActions({
  noun,
  onDuplicate,
  onRemove,
}: {
  noun: string;
  onDuplicate?: (event: MouseEvent<HTMLButtonElement>) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {onDuplicate ? (
        <button
          type="button"
          onClick={onDuplicate}
          className={buttonClassName}
          aria-label={`Duplicate ${noun}`}
        >
          Duplicate
        </button>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className={buttonClassName}
          aria-label={`Remove ${noun}`}
        >
          Remove
        </button>
      ) : null}
    </div>
  );
}
