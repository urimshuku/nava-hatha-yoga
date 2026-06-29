import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Durable persistence layer for form submissions, backed by Cloudflare D1.
 *
 * Every submission is written here before the notification email is attempted,
 * giving us a zero-loss guarantee: even if the email provider is down, the
 * submission is safely stored and a scheduled job can retry delivery later.
 */

export type FormSubmissionType = "registration" | "contact";

export interface StoredSubmissionInput {
  id: string;
  type: FormSubmissionType;
  subject: string;
  replyTo: string;
  body: string;
  /** Full raw submission, serialized as JSON. */
  payload: string;
  createdAt: string;
}

export interface PendingSubmission {
  id: string;
  type: FormSubmissionType;
  subject: string;
  reply_to: string;
  body: string;
  email_attempts: number;
}

/**
 * Resolve the D1 binding. In the fetch (request) path it can be read from the
 * Cloudflare context; in the scheduled (cron) path the caller passes it in
 * explicitly because the request-scoped context is not available.
 */
async function resolveDb(db?: D1Database): Promise<D1Database> {
  if (db) return db;

  const { env } = await getCloudflareContext({ async: true });
  const candidate = (env as { DB?: D1Database }).DB;

  if (!candidate) {
    throw new Error("D1 binding 'DB' is not configured.");
  }

  return candidate;
}

export async function saveSubmission(
  input: StoredSubmissionInput,
  db?: D1Database,
): Promise<void> {
  const database = await resolveDb(db);

  await database
    .prepare(
      `INSERT INTO form_submissions
         (id, type, subject, reply_to, body, payload, created_at, emailed, email_attempts)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)`,
    )
    .bind(
      input.id,
      input.type,
      input.subject,
      input.replyTo,
      input.body,
      input.payload,
      input.createdAt,
    )
    .run();
}

export async function markEmailed(id: string, db?: D1Database): Promise<void> {
  const database = await resolveDb(db);

  await database
    .prepare(
      `UPDATE form_submissions
          SET emailed = 1,
              email_attempts = email_attempts + 1,
              last_attempt_at = ?,
              last_error = NULL
        WHERE id = ?`,
    )
    .bind(new Date().toISOString(), id)
    .run();
}

export async function recordEmailFailure(
  id: string,
  error: string,
  db?: D1Database,
): Promise<void> {
  const database = await resolveDb(db);

  await database
    .prepare(
      `UPDATE form_submissions
          SET email_attempts = email_attempts + 1,
              last_attempt_at = ?,
              last_error = ?
        WHERE id = ?`,
    )
    .bind(new Date().toISOString(), error.slice(0, 1000), id)
    .run();
}

export async function getPendingSubmissions(
  limit: number,
  db?: D1Database,
): Promise<PendingSubmission[]> {
  const database = await resolveDb(db);

  const { results } = await database
    .prepare(
      `SELECT id, type, subject, reply_to, body, email_attempts
         FROM form_submissions
        WHERE emailed = 0
        ORDER BY created_at ASC
        LIMIT ?`,
    )
    .bind(limit)
    .all<PendingSubmission>();

  return results ?? [];
}
