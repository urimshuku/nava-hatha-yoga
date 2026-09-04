import Link from "next/link";
import { notFound } from "next/navigation";

import { portableTextToText } from "@/lib/cms/portable-text";
import { getDocument, isTombstone } from "@/lib/cms/repository";
import type { Program } from "@/lib/cms/content-types";

import { RemoveFromWebsite } from "@/components/cms/RemoveFromWebsite";

import { deleteProgram, hideProgram } from "../actions";
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

      <RemoveFromWebsite
        slug={slug}
        noun="program"
        hide={hideProgram}
        remove={deleteProgram}
      />
    </div>
  );
}
