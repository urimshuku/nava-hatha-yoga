"use server";

import { redirect } from "next/navigation";

import { getCmsAuthConfig, isPasswordCorrect } from "@/lib/cms/auth";
import { endCmsSession, startCmsSession } from "@/lib/cms/session";

export interface LoginState {
  error?: string;
}

/** Only allow redirects back into the editor, never to an external URL. */
function safeNextPath(value: FormDataEntryValue | null): string {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/admin") ? path : "/admin";
}

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const config = await getCmsAuthConfig();
  if (!config.ready) {
    return { error: config.reason };
  }

  const password = String(formData.get("password") ?? "");
  if (!password) {
    return { error: "Please enter the password." };
  }

  if (!(await isPasswordCorrect(password))) {
    return { error: "That password is not correct. Please try again." };
  }

  await startCmsSession();
  redirect(safeNextPath(formData.get("next")));
}

export async function logout(): Promise<void> {
  await endCmsSession();
  redirect("/login");
}
