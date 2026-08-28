import { NextResponse, type NextRequest } from "next/server";

import { CMS_SESSION_COOKIE, isSessionTokenValid } from "@/lib/cms/auth";
import { CMS_DEFAULT_PATH } from "@/lib/cms/sections";

/**
 * Protects editor routes under /admin/... and CMS APIs. Exact /admin is the
 * password screen, so it is not matched here.
 *
 * Next 16 deprecates this filename in favour of `proxy.ts`, but the Cloudflare
 * adapter only bundles `middleware.js`, so renaming it would drop the guard from
 * the deployed worker. Keep the old name until OpenNext supports the new one.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(CMS_SESSION_COOKIE)?.value;

  if (await isSessionTokenValid(token)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin", request.url);
  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (returnTo !== "/admin" && returnTo !== "/admin/" && returnTo !== CMS_DEFAULT_PATH) {
    loginUrl.searchParams.set("next", returnTo);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/events/:path*",
    "/admin/programs/:path*",
    "/admin/retreats/:path*",
    "/admin/pages/:path*",
    "/api/cms/:path*",
  ],
};
