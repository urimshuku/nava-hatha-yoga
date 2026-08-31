import Link from "next/link";
import { notFound } from "next/navigation";

import { getDocument, hasUnpublishedChanges, isTombstone } from "@/lib/cms/repository";
import { getPrograms } from "@/lib/cms/site-content";
import type { YogaEvent } from "@/lib/cms/content-types";

import { hideEvent } from "../actions";
import { EventForm } from "../EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; published?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;

  const [stored, programs] = await Promise.all([
    getDocument<YogaEvent>("event", slug),
    getPrograms(),
  ]);

  if (!stored || isTombstone(stored.data)) notFound();

  return (
    <div>
      <Link
        href="/admin/events"
        className="text-sm text-brown hover:text-saffron"
      >
        Back to events
      </Link>

      <div className="mt-4">
        <EventForm
          isNew={false}
          event={stored.data}
          originalSlug={slug}
          notice={
            query.published === "1"
              ? "published"
              : query.saved === "1"
                ? "saved"
                : undefined
          }
          unpublishedChanges={hasUnpublishedChanges(stored)}
          published={stored.published}
          programs={programs.map((program) => ({
            slug: program.slug,
            title: program.title,
            intensity: program.intensity,
          }))}
        />
      </div>

      <section className="mt-10 rounded-lg border border-border bg-white p-5 sm:p-6">
        <h2 className="font-heading text-xl text-charcoal">
          Remove from the website
        </h2>
        <p className="mt-2 max-w-prose text-sm text-brown">
          Hiding this event takes it off the website. You can put it back at any
          time.
        </p>
        <form action={hideEvent} className="mt-4">
          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            className="rounded border border-border-strong px-4 py-2.5 text-sm text-brown transition-colors hover:border-saffron hover:text-saffron"
          >
            Hide this event
          </button>
        </form>
      </section>
    </div>
  );
}
