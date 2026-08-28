import { NextResponse, type NextRequest } from "next/server";

import { CMS_SESSION_COOKIE, isSessionTokenValid } from "@/lib/cms/auth";

/**
 * Keeps /admin behind the login. This is the fast first check; the /admin layout
 * and every save action verify the session again, so the CMS stays protected
 * even if a request reaches it without passing through here.
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

  const loginUrl = new URL("/login", request.url);
  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (returnTo !== "/admin") {
    loginUrl.searchParams.set("next", returnTo);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/cms/:path*"],
};
