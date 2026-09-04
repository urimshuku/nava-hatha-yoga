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

      <div className="mx-auto mt-8 flex w-fit max-w-full flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-8">
        <div className="relative aspect-[4/5] w-60 max-w-full shrink-0 overflow-hidden rounded-2xl border border-border bg-ivory shadow-soft sm:w-64 lg:w-72">
          <Image
            src={story.photoSrc}
            alt={story.photoAlt}
            fill
            sizes="(min-width: 1024px) 288px, 256px"
            className="object-cover object-[center_58%]"
          />
        </div>

        <div className="max-w-sm space-y-3 text-center font-heading text-base leading-relaxed sm:space-y-4 sm:text-lg lg:text-left">
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
