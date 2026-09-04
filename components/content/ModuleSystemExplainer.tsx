"use client";

import { useState } from "react";

import { ModuleSystemModal } from "@/components/content/ModuleSystemModal";
import { MODULE_SYSTEM_EXPLAINER } from "@/lib/module-system";

export function ModuleSystemExplainer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-10">
      <ModuleSystemModal open={open} onClose={() => setOpen(false)} />
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        className="text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
      >
        {MODULE_SYSTEM_EXPLAINER.linkLabel}
      </button>
    </div>
  );
}
