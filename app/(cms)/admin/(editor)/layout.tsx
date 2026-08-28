import Link from "next/link";
import { redirect } from "next/navigation";

import { CmsNav } from "@/components/cms/CmsNav";
import { CMS_SECTIONS } from "@/lib/cms/sections";
import { hasCmsSession } from "@/lib/cms/session";
import { SITE_NAME } from "@/lib/constants";

import { logout } from "../../login/actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The middleware already turned away anyone without a session; this is the
  // authoritative check, so the editor is safe even if a request bypasses it.
  if (!(await hasCmsSession())) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-container flex-col gap-8 px-5 py-8 lg:flex-row lg:gap-12 lg:px-8 lg:py-12">
      <aside className="lg:w-56 lg:shrink-0">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-brown">
            {SITE_NAME}
          </p>
          <p className="font-heading text-2xl text-charcoal">Website Editor</p>
        </div>

        <CmsNav sections={CMS_SECTIONS} />

        <div className="mt-10 space-y-3 border-t border-border pt-6 text-sm">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="block text-brown hover:text-saffron"
          >
            View the website
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-brown transition-colors hover:text-saffron"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
