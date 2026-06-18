"use client";

import { toPng } from "html-to-image";
import { useRef, useState } from "react";

import { BANK_DETAILS } from "@/lib/register-content";
import { formBoxClass } from "@/components/forms/form-styles";
import { cn } from "@/lib/utils";

function IconShare() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
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

async function shareOrDownloadBlob(blob: Blob): Promise<void> {
  const file = new File([blob], "nava-payment-details.png", {
    type: "image/png",
  });

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: "Payment Details",
        text: "Nava Hatha Yoga — bank transfer details",
      });
      return;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nava-payment-details.png";
  link.click();
  URL.revokeObjectURL(url);
}

function findBackgroundColor(element: HTMLElement): string {
  let current: HTMLElement | null = element.parentElement;
  while (current) {
    const bg = getComputedStyle(current).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      return bg;
    }
    current = current.parentElement;
  }
  return "#FDFBF6";
}

export function BankDetailsCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  async function handleShare() {
    const node = cardRef.current;
    if (!node) return;

    setStatus("saving");
    try {
      await document.fonts.ready;

      const parentBg = findBackgroundColor(node);

      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: parentBg,
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await shareOrDownloadBlob(blob);
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div ref={cardRef} className={cn(formBoxClass, "sm:p-6")}>
        <dl className="space-y-2">
          {BANK_DETAILS.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-0.5 sm:grid-cols-[12rem_1fr] sm:gap-4"
            >
              <dt className="text-xs font-medium text-charcoal sm:text-sm">{row.label}:</dt>
              <dd className="break-words text-xs text-brown sm:text-sm">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleShare}
          disabled={status === "saving"}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11",
            "border border-border-strong bg-ivory text-charcoal transition-colors duration-300",
            "hover:bg-sand/60 hover:text-saffron focus-visible:outline-none",
            "disabled:pointer-events-none disabled:opacity-60",
          )}
          aria-label="Save payment details as an image"
          title="Save payment details as an image"
        >
          <IconShare />
        </button>
      </div>
    </div>
  );
}
