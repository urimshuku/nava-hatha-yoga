import Link from "next/link";
import { notFound } from "next/navigation";

import { findEditablePage } from "@/lib/cms/editable-pages";
import { loadPageValues } from "@/lib/cms/page-values";
import { getDocument, hasUnpublishedChanges } from "@/lib/cms/repository";

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

  const [values, stored, query] = await Promise.all([
    loadPageValues(page),
    getDocument(page.type, page.slug),
    searchParams,
  ]);

  const isRegistration = page.section === "registration";
  const isLegal = page.section === "legal";
  const startsAsWorkshopCopy =
    !stored &&
    (page.id === "register-retreat" || page.id === "register-module");

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

      {!stored ? (
        <p className="rounded border border-border bg-cream/60 px-4 py-3 text-sm text-brown">
          {startsAsWorkshopCopy
            ? `This form starts as a copy of Workshop Registration. Save keeps a working copy here. Publish puts this wording on the ${page.label.toLowerCase()} form.`
            : "This page still uses the wording currently on the website. Save keeps a working copy here. Publish puts this wording on the website."}
        </p>
      ) : hasUnpublishedChanges(stored) ? (
        <p className="rounded border border-saffron/30 bg-saffron/5 px-4 py-3 text-sm text-saffron-hover">
          You have saved changes that are not on the website yet. Publish to
          update the live page.
        </p>
      ) : !stored.published ? (
        <p className="rounded border border-saffron/30 bg-saffron/5 px-4 py-3 text-sm text-saffron-hover">
          This page is saved but not published, so the website still shows its
          previous wording.
        </p>
      ) : null}

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
