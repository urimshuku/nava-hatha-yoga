"use server";

import { redirect } from "next/navigation";

import { getCmsAuthConfig, isPasswordCorrect } from "@/lib/cms/auth";
import {
  hashCmsPassword,
  saveCmsPasswordHash,
} from "@/lib/cms/password-store";
import { CMS_DEFAULT_PATH } from "@/lib/cms/sections";
import { startCmsSession } from "@/lib/cms/session";

export interface ChangePasswordState {
  error?: string;
}

const MIN_PASSWORD_LENGTH = 8;

export async function changePassword(
  _state: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const config = await getCmsAuthConfig();
  if (!config.ready) {
    return { error: config.reason };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Please fill in all three fields." };
  }

  if (!(await isPasswordCorrect(currentPassword))) {
    return { error: "The current password is not correct." };
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Please choose a new password of at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  if (newPassword !== confirmPassword) {
    return { error: "The new password and confirmation do not match." };
  }

  if (newPassword === currentPassword) {
    return { error: "Please choose a password that is different from the current one." };
  }

  try {
    await saveCmsPasswordHash(await hashCmsPassword(newPassword));
  } catch (error) {
    console.error("Failed to save CMS password:", error);
    return {
      error:
        "The new password could not be saved. Please try again in a moment.",
    };
  }

  await startCmsSession();
  redirect(CMS_DEFAULT_PATH);
}
