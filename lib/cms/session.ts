import { cookies } from "next/headers";

import {
  CMS_SESSION_COOKIE,
  CMS_SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  isSessionTokenValid,
} from "./auth";

/**
 * Session handling for server components and server actions. The middleware
 * only turns visitors away at the door; this module is the authority that every
 * page and every save re-checks.
 */

export async function hasCmsSession(): Promise<boolean> {
  const store = await cookies();
  return isSessionTokenValid(store.get(CMS_SESSION_COOKIE)?.value);
}

export async function startCmsSession(): Promise<void> {
  const store = await cookies();

  store.set(CMS_SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CMS_SESSION_MAX_AGE_SECONDS,
  });
}

export async function endCmsSession(): Promise<void> {
  const store = await cookies();
  store.delete(CMS_SESSION_COOKIE);
}

/**
 * Guards every server action that writes content. Throwing (rather than
 * redirecting) keeps an unauthenticated write from silently doing nothing.
 */
export async function assertCmsSession(): Promise<void> {
  if (!(await hasCmsSession())) {
    throw new Error("Your session has expired. Please sign in again.");
  }
}
