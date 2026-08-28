import { redirect } from "next/navigation";

import { CMS_DEFAULT_PATH } from "@/lib/cms/sections";
import { hasCmsSession } from "@/lib/cms/session";
import { SITE_NAME } from "@/lib/constants";

import { LoginForm } from "../login/LoginForm";

export const dynamic = "force-dynamic";

/**
 * navahathayoga.com/admin is the CMS door: the password form when signed out,
 * Events when already signed in.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await hasCmsSession()) {
    redirect(CMS_DEFAULT_PATH);
  }

  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs uppercase tracking-widest text-brown">
            {SITE_NAME}
          </p>
          <h1 className="font-heading text-3xl text-charcoal">Website Editor</h1>
          <p className="mt-3 text-sm text-brown">
            Sign in to update the website content.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-soft">
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
