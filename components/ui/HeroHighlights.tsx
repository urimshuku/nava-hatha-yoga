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
    <ul
      className={cn(
        "mx-auto grid max-w-3xl gap-4 text-left sm:grid-cols-3 sm:gap-8 sm:text-center",
        className,
      )}
    >
      {HIGHLIGHTS.map((item) => (
        <li
          key={item.text}
          className="flex items-center gap-3 sm:flex-col sm:gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-ivory/70 text-saffron">
            {item.icon}
          </span>
          <span className="text-sm leading-snug text-brown">
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
  );
}
