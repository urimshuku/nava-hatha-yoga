"use client";

import type { MouseEvent } from "react";

const buttonClassName =
  "shrink-0 rounded border border-border px-2.5 py-1.5 text-xs text-brown transition-colors hover:border-saffron hover:text-saffron";

/** Up / Down / Duplicate / Remove for a repeatable CMS row. */
export function RowActions({
  noun,
  onUp,
  onDown,
  onDuplicate,
  onRemove,
}: {
  noun: string;
  onUp?: () => void;
  onDown?: () => void;
  onDuplicate?: (event: MouseEvent<HTMLButtonElement>) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {onUp ? (
        <button
          type="button"
          onClick={onUp}
          className={buttonClassName}
          aria-label={`Move ${noun} earlier`}
        >
          Up
        </button>
      ) : null}
      {onDown ? (
        <button
          type="button"
          onClick={onDown}
          className={buttonClassName}
          aria-label={`Move ${noun} later`}
        >
          Down
        </button>
      ) : null}
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
