-- Media library for the built-in CMS.
--
-- The image bytes live in the R2 bucket bound as `MEDIA`; this table is the
-- index the editor browses. `key` is the R2 object key and doubles as the
-- public path: an image is served from /media/<key>.

CREATE TABLE IF NOT EXISTS cms_media (
  key          TEXT PRIMARY KEY,
  filename     TEXT NOT NULL,          -- original name, shown in the picker
  content_type TEXT NOT NULL,
  size         INTEGER NOT NULL,       -- bytes
  width        INTEGER,                -- measured in the browser before upload
  height       INTEGER,
  alt          TEXT,                   -- default alt text, editable per use
  created_at   TEXT NOT NULL
);

-- Newest uploads first in the picker.
CREATE INDEX IF NOT EXISTS idx_cms_media_created
  ON cms_media (created_at DESC);
