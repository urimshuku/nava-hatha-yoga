import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

interface SendFormNotificationOptions {
  subject: string;
  replyTo: string;
  text: string;
}

interface ResendErrorResponse {
  name?: string;
  message?: string;
  statusCode?: number;
}

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).trim();
  }

  return value;
}

async function getCloudflareEnvValue(name: string): Promise<string | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const value = (env as Record<string, unknown>)[name];

    return typeof value === "string" ? value : undefined;
  } catch {
    return undefined;
  }
}

async function getRequiredEnv(name: string): Promise<string> {
  const rawValue =
    (await getCloudflareEnvValue(name)) ?? process.env[name] ?? "";
  const value = stripWrappingQuotes(rawValue.trim());

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function parseResendError(response: Response): Promise<ResendErrorResponse> {
  try {
    return (await response.json()) as ResendErrorResponse;
  } catch {
    return {
      name: "ResendApiError",
      message: response.statusText || "Unknown Resend error",
      statusCode: response.status,
    };
  }
}

export async function sendFormNotification({
  subject,
  replyTo,
  text,
}: SendFormNotificationOptions): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await getRequiredEnv("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: await getRequiredEnv("RESEND_FROM_EMAIL"),
      to: [await getRequiredEnv("FORM_NOTIFICATION_EMAIL")],
      subject,
      reply_to: [replyTo],
      text,
    }),
  });

  if (!response.ok) {
    const error = await parseResendError(response);
    const details = [
      error.name || "ResendApiError",
      error.statusCode || response.status,
      error.message || response.statusText,
    ].join(": ");

    throw new Error(`Resend failed to send form notification: ${details}`);
  }
}
