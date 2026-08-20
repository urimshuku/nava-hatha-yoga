"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

function IconShare() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 3v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.5 6.5 12 3l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type EventShareButtonProps = {
  title: string;
  path: string;
};

export function EventShareButton({
  title,
  path,
}: EventShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}${path}`;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ url });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this session link:", url);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={share}
      aria-label={copied ? "Session link copied" : `Share ${title}`}
      className="px-3"
    >
      {copied ? (
        <span className="text-xs">Copied</span>
      ) : (
        <>
          <IconShare />
          <span className="sr-only">Share</span>
        </>
      )}
    </Button>
  );
}
