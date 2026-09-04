import Link from "next/link";
import { notFound } from "next/navigation";

import { findEditablePage } from "@/lib/cms/editable-pages";
import { loadPageValues } from "@/lib/cms/page-values";

import { PageForm } from "../PageForm";

export const dynamic = "force-dynamic";

export default async function EditPagePage({
  params,
  searchParams,
}: {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ saved?: string; published?: string }>;
}) {
  const { page: id } = await params;
  const page = findEditablePage(id);
  if (!page) notFound();

  const [values, query] = await Promise.all([
    loadPageValues(page),
    searchParams,
  ]);

  const isRegistration = page.section === "registration";
  const isLegal = page.section === "legal";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        {isRegistration ? (
          <span className="text-brown">Registration</span>
        ) : isLegal ? (
          <span className="text-brown">Legal</span>
        ) : (
          <Link href="/admin/pages" className="text-brown hover:text-saffron">
            Main Pages
          </Link>
        )}
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

      <PageForm
        pageId={page.id}
        schema={page.schema}
        values={values}
        notice={
          query.published === "1"
            ? "published"
            : query.saved === "1"
              ? "saved"
              : undefined
        }
      />
    </div>
  );
}
