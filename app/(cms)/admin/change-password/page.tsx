import Link from "next/link";

import { SITE_NAME } from "@/lib/constants";

import { ChangePasswordForm } from "./ChangePasswordForm";

export const dynamic = "force-dynamic";

export default function ChangePasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs uppercase tracking-widest text-brown">
            {SITE_NAME}
          </p>
          <h1 className="font-heading text-3xl text-charcoal">Change password</h1>
          <p className="mt-3 text-sm text-brown">
            Enter the current editor password, then choose a new one.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-soft">
          <ChangePasswordForm />
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href="/admin" className="text-brown hover:text-saffron">
            Cancel
          </Link>
        </p>
      </div>
    </main>
  );
}
