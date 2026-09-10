-- Optional CMS password override.
--
-- The editor still starts from the CMS_PASSWORD secret. Once someone changes
-- the password on /admin, the new value is stored here (hashed) and that is
-- what sign-in checks. The secret remains as a fallback when this table is
-- empty (first login, or a fresh database).

CREATE TABLE IF NOT EXISTS cms_password (
  id            INTEGER PRIMARY KEY CHECK (id = 1),
  password_hash TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
