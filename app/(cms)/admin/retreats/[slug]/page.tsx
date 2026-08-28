import Link from "next/link";
import { notFound } from "next/navigation";

import { getDocument, isTombstone } from "@/lib/cms/repository";
import type { Retreat } from "@/lib/cms/content-types";

import { hideRetreat } from "../actions";
import { RetreatForm } from "../RetreatForm";

export const dynamic = "force-dynamic";

export default async function EditRetreatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
          published={stored.published}
        />
      </div>

      <section className="mt-10 rounded-lg border border-border bg-white p-5 sm:p-6">
        <h2 className="font-heading text-xl text-charcoal">
          Remove from the website
        </h2>
        <p className="mt-2 max-w-prose text-sm text-brown">
          Hiding this retreat takes it off the website. You can put it back at
          any time.
        </p>
        <form action={hideRetreat} className="mt-4">
          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            className="rounded border border-border-strong px-4 py-2.5 text-sm text-brown transition-colors hover:border-saffron hover:text-saffron"
          >
            Hide this retreat
          </button>
        </form>
      </section>
    </div>
  );
}
