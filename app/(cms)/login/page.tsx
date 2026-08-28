import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Old address; the editor is at /admin. */
export default async function LoginRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  if (next?.startsWith("/admin")) {
    redirect(`/admin?next=${encodeURIComponent(next)}`);
  }
  redirect("/admin");
}
