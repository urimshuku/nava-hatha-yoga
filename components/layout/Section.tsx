import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionTone = "cream" | "ivory" | "sand";

interface SectionProps {
  children: ReactNode;
  className?: string;
  tone?: SectionTone;
  id?: string;
  size?: "default" | "small";
  as?: "section" | "div" | "article";
}

const toneClasses: Record<SectionTone, string> = {
  cream: "bg-cream",
  ivory: "bg-ivory",
  sand: "bg-sand",
};

export function Section({
  children,
  className,
  tone = "cream",
  id,
  size = "default",
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        toneClasses[tone],
        size === "default" ? "py-section" : "py-section-sm",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
