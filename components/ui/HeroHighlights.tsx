import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function IconTriangle() {
  return (
    <svg {...iconProps} className="h-5 w-5">
      <path d="M12 4.5 20 19.5H4Z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg {...iconProps} className="h-5 w-5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.4 5.4l1.4 1.4M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4" />
    </svg>
  );
}

function IconInfinity() {
  return (
    <svg {...iconProps} className="h-5 w-5">
      <path d="M12 12c-1.8-2.4-3.6-3.6-5.4-3.6a3.6 3.6 0 1 0 0 7.2c1.8 0 3.6-1.2 5.4-3.6Z" />
      <path d="M12 12c1.8 2.4 3.6 3.6 5.4 3.6a3.6 3.6 0 0 0 0-7.2c-1.8 0-3.6 1.2-5.4 3.6Z" />
    </svg>
  );
}

const HIGHLIGHTS: { icon: ReactNode; text: string; lines?: string[] }[] = [
  { icon: <IconTriangle />, text: "Ancient yogic tools for modern life." },
  { icon: <IconSun />, text: "Practices for balance, clarity and well-being." },
  {
    icon: <IconInfinity />,
    text: "Learn once. Practise for a lifetime.",
    lines: ["Learn once.", "Practise for a lifetime."],
  },
];

export function HeroHighlights({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto max-w-3xl", className)}>
      <ul className="grid gap-6 text-left sm:grid-cols-3 sm:gap-10 sm:text-center">
        {HIGHLIGHTS.map((item) => (
          <li
            key={item.text}
            className="flex items-center gap-3 sm:flex-col sm:gap-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-ivory/70 text-saffron">
              {item.icon}
            </span>
            <span className="text-sm leading-snug text-brown sm:text-base">
              {item.lines
                ? item.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))
                : item.text}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-20 flex flex-col items-center sm:mt-28" aria-hidden="true">
        <svg
          viewBox="0 0 220 16"
          className="h-4 w-32 text-saffron sm:w-44"
          fill="none"
        >
          <path
            d="M4 11C18 11 24 4 36 4S54 11 73 11 91 4 110 4 129 11 147 11 165 4 184 4 202 11 216 11"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
        <p className="mt-6 text-center text-sm italic leading-snug text-brown sm:mt-8 sm:text-base">
          “In balance. Life unfolds.”
        </p>
      </div>
    </div>
  );
}
