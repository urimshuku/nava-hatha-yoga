import Link from "next/link";
import { notFound } from "next/navigation";

import { getDocument, isTombstone } from "@/lib/cms/repository";
import { getPrograms } from "@/lib/cms/site-content";
import type { YogaEvent } from "@/lib/cms/content-types";

import { RemoveFromWebsite } from "@/components/cms/RemoveFromWebsite";

import { deleteEvent, hideEvent } from "../actions";
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
        ← Back to workshops
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
          programs={programs.map((program) => ({
            slug: program.slug,
            title: program.title,
          }))}
        />
      </div>

      <RemoveFromWebsite
        slug={slug}
        noun="workshop"
        hide={hideEvent}
        remove={deleteEvent}
      />
    </div>
  );
}
