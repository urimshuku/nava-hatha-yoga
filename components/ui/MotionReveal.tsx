"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Scroll reveal that is visible by default (SSR-safe).
 * Only hides and animates after mount when the element is below the fold.
 * Animation is skipped for prefers-reduced-motion.
 */
export function MotionReveal({ children, className, delay = 0 }: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    const margin = 80;
    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight - margin && rect.bottom > margin;

    if (inView) {
      el.classList.add("is-visible");
      return;
    }

    el.classList.add("motion-pending");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-visible");
        el.classList.remove("motion-pending");
        io.disconnect();
      },
      { rootMargin: `-${margin}px`, threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("motion-reveal", className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
