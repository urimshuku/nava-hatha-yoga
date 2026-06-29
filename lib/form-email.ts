import { getCloudflareContext } from "@opennextjs/cloudflare";

interface SendFormNotificationOptions {
  subject: string;
  replyTo: string;
  text: string;
}

/**
 * A Cloudflare env bag (bindings, vars, secrets). Passed explicitly from the
 * scheduled/cron path where the request-scoped context is unavailable.
 */
type EnvLike = Record<string, unknown>;

interface ResendErrorResponse {
  name?: string;
  message?: string;
  statusCode?: number;
}

/**
 * Delivery resilience settings.
 *
 * A form submission must not be lost because of a single transient hiccup
 * (brief Resend 5xx, a momentary network blip from the Worker, or a 429
 * rate-limit). We retry such failures a few times with exponential backoff
 * before giving up. Genuinely permanent failures (bad API key, unverified
 * domain, malformed request) are 4xx — we fail fast on those so we don't keep
 * the user waiting on something that can never succeed.
 */
const MAX_DELIVERY_ATTEMPTS = 4;
const ATTEMPT_TIMEOUT_MS = 10_000;
const BASE_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 4_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** A 429 (rate limit) or any 5xx is worth retrying; other 4xx are permanent. */
function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function backoffDelay(attempt: number, retryAfterSeconds?: number): number {
  if (retryAfterSeconds && retryAfterSeconds > 0) {
    return Math.min(retryAfterSeconds * 1000, MAX_BACKOFF_MS);
  }

  const exponential = BASE_BACKOFF_MS * 2 ** (attempt - 1);
  const jitter = Math.random() * BASE_BACKOFF_MS;

  return Math.min(exponential + jitter, MAX_BACKOFF_MS);
}

function parseRetryAfter(response: Response): number | undefined {
  const header = response.headers.get("retry-after");
  if (!header) return undefined;

  const seconds = Number(header);

  return Number.isFinite(seconds) ? seconds : undefined;
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

async function getCloudflareEnvValue(
  name: string,
  env?: EnvLike,
): Promise<string | undefined> {
  if (env) {
    const value = env[name];
    return typeof value === "string" ? value : undefined;
  }

  try {
    const { env: ctxEnv } = await getCloudflareContext({ async: true });
    const value = (ctxEnv as unknown as EnvLike)[name];

    return typeof value === "string" ? value : undefined;
  } catch {
    return undefined;
  }
}

async function getRequiredEnv(name: string, env?: EnvLike): Promise<string> {
  const rawValue =
    (await getCloudflareEnvValue(name, env)) ?? process.env[name] ?? "";
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

/** One delivery attempt. Returns the response so the caller can decide on retries. */
async function postToResend(
  apiKey: string,
  body: string,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);

  try {
    return await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendFormNotification(
  { subject, replyTo, text }: SendFormNotificationOptions,
  env?: EnvLike,
): Promise<void> {
  // Resolve config once up front. A missing key/env is a permanent failure and
  // should not be retried.
  const apiKey = await getRequiredEnv("RESEND_API_KEY", env);
  const body = JSON.stringify({
    from: await getRequiredEnv("RESEND_FROM_EMAIL", env),
    to: [await getRequiredEnv("FORM_NOTIFICATION_EMAIL", env)],
    subject,
    reply_to: [replyTo],
    text,
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_DELIVERY_ATTEMPTS; attempt += 1) {
    let response: Response;

    try {
      response = await postToResend(apiKey, body);
    } catch (err) {
      // Network error or timeout (AbortError) — transient, worth retrying.
      lastError = new Error(
        `Resend request failed (attempt ${attempt}/${MAX_DELIVERY_ATTEMPTS}): ${
          err instanceof Error ? err.message : "network error"
        }`,
      );

      if (attempt < MAX_DELIVERY_ATTEMPTS) {
        await sleep(backoffDelay(attempt));
        continue;
      }
      break;
    }

    if (response.ok) {
      return;
    }

    const error = await parseResendError(response);
    const details = [
      error.name || "ResendApiError",
      error.statusCode || response.status,
      error.message || response.statusText,
    ].join(": ");
    lastError = new Error(`Resend failed to send form notification: ${details}`);

    // Permanent failures (e.g. 401/403/422) won't succeed on retry — fail fast.
    if (!isRetryableStatus(response.status)) {
      throw lastError;
    }

    if (attempt < MAX_DELIVERY_ATTEMPTS) {
      await sleep(backoffDelay(attempt, parseRetryAfter(response)));
      continue;
    }
  }

  throw lastError ?? new Error("Resend failed to send form notification.");
}
