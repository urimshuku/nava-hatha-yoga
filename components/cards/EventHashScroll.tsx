"use client";

import { useEffect } from "react";

/** Scroll a shared event card into view under the sticky header. */
export function EventHashScroll() {
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;

    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return null;
}
