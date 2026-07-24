"use client";

import Image from "next/image";
import { useState } from "react";

import { TeacherStoryModal } from "@/components/content/TeacherStoryModal";
import {
  DEFAULT_TEACHER_STORY,
  type ResolvedTeacherStory,
} from "@/lib/teacher-story";

export function TeacherStoryTeaser({
  story = DEFAULT_TEACHER_STORY,
}: {
  story?: ResolvedTeacherStory;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TeacherStoryModal
        open={open}
        onClose={() => setOpen(false)}
        title={story.storyTitle}
        paragraphs={story.story}
      />

      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="relative aspect-[4/5] w-60 max-w-full overflow-hidden rounded-2xl border border-border bg-ivory shadow-soft sm:w-64">
          <Image
            src={story.photoSrc}
            alt={story.photoAlt}
            fill
            sizes="256px"
            className="object-cover object-[center_58%]"
          />
        </div>

        <div className="mx-auto max-w-prose space-y-3 text-center font-heading text-base leading-relaxed sm:space-y-4 sm:text-lg">
          <p className="italic text-charcoal">{story.nameLine}</p>

          {story.teaser.map((paragraph) => (
            <p key={paragraph} className="italic text-charcoal">
              {paragraph}
            </p>
          ))}

          <p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-saffron underline underline-offset-2 hover:text-saffron-hover focus-visible:outline-none"
            >
              Read My Full Story
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
