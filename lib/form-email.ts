import "server-only";

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

function getRequiredEnv(name: string): string {
  const value = stripWrappingQuotes(process.env[name]?.trim() ?? "");

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
      Authorization: `Bearer ${getRequiredEnv("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getRequiredEnv("RESEND_FROM_EMAIL"),
      to: [getRequiredEnv("FORM_NOTIFICATION_EMAIL")],
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
