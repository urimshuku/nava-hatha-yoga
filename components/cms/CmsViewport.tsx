"use client";

import { useEffect } from "react";

/** Stops the editor from shifting when a shorter page hides the scrollbar. */
export function CmsViewport() {
  useEffect(() => {
    document.documentElement.classList.add("cms-editor");
    return () => document.documentElement.classList.remove("cms-editor");
  }, []);

  return null;
}
