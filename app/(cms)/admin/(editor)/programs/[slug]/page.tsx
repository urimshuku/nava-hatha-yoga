import Link from "next/link";
import { notFound } from "next/navigation";

import { portableTextToText } from "@/lib/cms/portable-text";
import { getDocument, hasUnpublishedChanges, isTombstone } from "@/lib/cms/repository";
import type { Program } from "@/lib/cms/content-types";

import { hideProgram } from "../actions";
import { ProgramForm } from "../ProgramForm";

export const dynamic = "force-dynamic";

export default async function EditProgramPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; published?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const stored = await getDocument<Program>("program", slug);

  if (!stored || isTombstone(stored.data)) notFound();

  const program = stored.data;

  return (
    <div>
      <Link
        href="/admin/programs"
        className="text-sm text-brown hover:text-saffron"
      >
        Back to programs
      </Link>

      <div className="mt-4">
        <ProgramForm
          isNew={false}
          program={program}
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
          richText={{
            whatIs: portableTextToText(program.whatIs),
            aboutThePractice: portableTextToText(program.aboutThePractice),
            practiceIndependently: portableTextToText(
              program.practiceIndependently,
            ),
            privateAndGroupSessions: portableTextToText(
              program.privateAndGroupSessions,
            ),
          }}
        />
      </div>

      <section className="mt-10 rounded-lg border border-border bg-white p-5 sm:p-6">
        <h2 className="font-heading text-xl text-charcoal">
          Remove from the website
        </h2>
        <p className="mt-2 max-w-prose text-sm text-brown">
          Hiding this program takes it off the website. You can put it back at
          any time.
        </p>
        <form action={hideProgram} className="mt-4">
          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            className="rounded border border-border-strong px-4 py-2.5 text-sm text-brown transition-colors hover:border-saffron hover:text-saffron"
          >
            Hide this program
          </button>
        </form>
      </section>
    </div>
  );
}
