"use client";

import { useState } from "react";

import { TeacherStoryModal } from "@/components/content/TeacherStoryModal";
import { MODULE_SYSTEM_EXPLAINER } from "@/lib/module-system";

export function ModuleSystemExplainer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-10">
      <TeacherStoryModal
        open={open}
        onClose={() => setOpen(false)}
        title={MODULE_SYSTEM_EXPLAINER.title}
        paragraphs={[
          ...MODULE_SYSTEM_EXPLAINER.intro,
          ...MODULE_SYSTEM_EXPLAINER.continuation,
        ]}
        examplesHeading={MODULE_SYSTEM_EXPLAINER.examplesHeading}
        examples={MODULE_SYSTEM_EXPLAINER.examples}
        titleId="module-system-title"
        italicFirst={false}
      />
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
