-- Durable store for every form submission (registration + contact).
--
-- The submission is written here BEFORE the notification email is attempted,
-- so a submission can never be lost even if the email provider is unavailable.
-- A scheduled job retries delivery of any rows where emailed = 0.

CREATE TABLE IF NOT EXISTS form_submissions (
  id              TEXT PRIMARY KEY,
  type            TEXT NOT NULL,            -- 'registration' | 'contact'
  subject         TEXT NOT NULL,            -- email subject line
  reply_to        TEXT NOT NULL,            -- submitter's email
  body            TEXT NOT NULL,            -- formatted email body (plain text)
  payload         TEXT NOT NULL,            -- full raw submission as JSON
  created_at      TEXT NOT NULL,            -- ISO timestamp
  emailed         INTEGER NOT NULL DEFAULT 0, -- 0 = pending, 1 = delivered
  email_attempts  INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TEXT,
  last_error      TEXT
);

-- Fast lookup of submissions still awaiting email delivery.
CREATE INDEX IF NOT EXISTS idx_form_submissions_pending
  ON form_submissions (emailed, created_at);
