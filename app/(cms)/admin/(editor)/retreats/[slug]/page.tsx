import Link from "next/link";
import { notFound } from "next/navigation";

import { getDocument, hasUnpublishedChanges, isTombstone } from "@/lib/cms/repository";
import type { Retreat } from "@/lib/cms/content-types";

import { RemoveFromWebsite } from "@/components/cms/RemoveFromWebsite";

import { deleteRetreat, hideRetreat } from "../actions";
import { RetreatForm } from "../RetreatForm";

export const dynamic = "force-dynamic";

export default async function EditRetreatPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; published?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const stored = await getDocument<Retreat>("retreat", slug);

  if (!stored || isTombstone(stored.data)) notFound();

  return (
    <div>
      <Link
        href="/admin/retreats"
        className="text-sm text-brown hover:text-saffron"
      >
        Back to retreats
      </Link>

      <div className="mt-4">
        <RetreatForm
          isNew={false}
          retreat={stored.data}
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
        />
      </div>

      <RemoveFromWebsite
        slug={slug}
        noun="retreat"
        hide={hideRetreat}
        remove={deleteRetreat}
      />
    </div>
  );
}
