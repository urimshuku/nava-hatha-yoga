import Link from "next/link";
import { notFound } from "next/navigation";

import { findEditablePage } from "@/lib/cms/editable-pages";
import { loadPageValues } from "@/lib/cms/page-values";
import { getDocument } from "@/lib/cms/repository";

import { PageForm } from "../PageForm";

export const dynamic = "force-dynamic";

export default async function EditPagePage({
  params,
  searchParams,
}: {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { page: id } = await params;
  const page = findEditablePage(id);
  if (!page) notFound();

  const [values, stored, query] = await Promise.all([
    loadPageValues(page),
    getDocument(page.type, page.slug),
    searchParams,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <Link href="/admin/pages" className="text-brown hover:text-saffron">
          Pages
        </Link>
        <span className="text-border-strong">/</span>
        <span className="text-charcoal">{page.label}</span>
        {page.schema.previewPath ? (
          <Link
            href={page.schema.previewPath}
            target="_blank"
            className="ml-auto text-brown underline hover:text-saffron"
          >
            View this page on the website
          </Link>
        ) : null}
      </div>

      {!stored ? (
        <p className="rounded border border-border bg-cream/60 px-4 py-3 text-sm text-brown">
          This page still uses the wording currently on the website. Saving
          takes over this page.
        </p>
      ) : null}

      <PageForm
        pageId={page.id}
        schema={page.schema}
        values={values}
        saved={query.saved === "1"}
      />
    </div>
  );
}
