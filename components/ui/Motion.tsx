"use client";

import type { ReactNode } from "react";

import { MotionReveal } from "@/components/ui/MotionReveal";
import { cn } from "@/lib/utils";

/** Container that staggers the reveal of its MotionItem children on scroll. */
export function MotionStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("motion-stagger", className)}>{children}</div>;
}

/** A single staggered item. Use inside MotionStagger. */
export function MotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <MotionReveal className={className}>{children}</MotionReveal>;
}
