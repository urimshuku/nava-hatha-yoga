"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeUp, stagger } from "@/lib/utils";

/** Container that staggers the reveal of its MotionItem children on scroll. */
export function MotionStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/** A single staggered item. Use inside MotionStagger. */
export function MotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
