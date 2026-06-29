import { sendFormNotification } from "./form-email";
import {
  getPendingSubmissions,
  markEmailed,
  recordEmailFailure,
  saveSubmission,
  type FormSubmissionType,
} from "./form-store";

/**
 * Zero-loss form delivery.
 *
 * The flow is deliberately persist-first:
 *   1. Durably store the submission in D1.
 *   2. Best-effort send the notification email (with retries).
 *
 * As long as the submission is stored, the user gets a success response — even
 * if the email fails — because a scheduled job (see `flushPendingSubmissions`)
 * will keep retrying delivery until it succeeds. The only way a user sees an
 * error is if BOTH the database write AND the immediate email fail, which means
 * nothing could be saved anywhere.
 */

interface DeliverInput {
  type: FormSubmissionType;
  subject: string;
  replyTo: string;
  /** Formatted plain-text email body. */
  body: string;
  /** Full raw submission, stored verbatim for recovery. */
  payload: unknown;
}

export async function persistAndNotify(input: DeliverInput): Promise<void> {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const createdAt = new Date().toISOString();

  let persisted = false;
  try {
    await saveSubmission({
      id,
      type: input.type,
      subject: input.subject,
      replyTo: input.replyTo,
      body: input.body,
      payload: JSON.stringify(input.payload),
      createdAt,
    });
    persisted = true;
  } catch (error) {
    // Could not store (e.g. D1 unavailable). We still attempt the email below;
    // if that succeeds the submission is not lost. If it also fails we throw.
    console.error("Failed to persist submission to D1:", error);
  }

  try {
    await sendFormNotification({
      subject: input.subject,
      replyTo: input.replyTo,
      text: input.body,
    });

    if (persisted) {
      await markEmailed(id).catch((err) =>
        console.error(`Failed to mark submission ${id} as emailed:`, err),
      );
    }
  } catch (emailError) {
    const message =
      emailError instanceof Error ? emailError.message : "Unknown email error";

    if (persisted) {
      // Data is safe in D1; the scheduled job will retry the email. Treat this
      // as a success for the user so their submission is not lost or repeated.
      console.error(
        `Email delivery deferred for submission ${id} (will retry): ${message}`,
      );
      await recordEmailFailure(id, message).catch(() => {});
      return;
    }

    // Nothing was stored AND the email failed — the submission would be lost.
    // Surface the error so the user can try again.
    throw emailError;
  }
}

export interface FlushResult {
  processed: number;
  sent: number;
  failed: number;
}

/**
 * Retry delivery of any stored submissions whose email has not yet succeeded.
 * Invoked from the scheduled (cron) handler, where the env must be passed
 * explicitly because the request-scoped Cloudflare context is unavailable.
 */
export async function flushPendingSubmissions(
  env: Record<string, unknown>,
  limit = 25,
): Promise<FlushResult> {
  const db = env.DB as D1Database | undefined;
  if (!db) {
    throw new Error("D1 binding 'DB' is not configured for scheduled flush.");
  }

  const pending = await getPendingSubmissions(limit, db);

  let sent = 0;
  let failed = 0;

  for (const row of pending) {
    try {
      await sendFormNotification(
        { subject: row.subject, replyTo: row.reply_to, text: row.body },
        env,
      );
      await markEmailed(row.id, db);
      sent += 1;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown email error";
      await recordEmailFailure(row.id, message, db).catch(() => {});
      failed += 1;
    }
  }

  return { processed: pending.length, sent, failed };
}
