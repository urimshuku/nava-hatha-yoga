-- Content store for the built-in CMS (/login + /admin).
--
-- One row per editable document. `data` holds the document as JSON in the exact
-- shape the site already expects (see sanity/lib/types.ts), so a stored row can
-- be handed straight to the existing components.
--
-- Rows here take precedence over the same document in Sanity, matched by slug.
-- A row with hidden = 1 acts as a tombstone: it removes the matching Sanity
-- document from the site without deleting anything in Sanity.

CREATE TABLE IF NOT EXISTS cms_documents (
  type       TEXT NOT NULL,               -- 'event' | 'program'
  slug       TEXT NOT NULL,
  data       TEXT NOT NULL,               -- JSON matching the existing site types
  published  INTEGER NOT NULL DEFAULT 1,  -- 0 = keep editing, do not show on the site
  hidden     INTEGER NOT NULL DEFAULT 0,  -- 1 = hide the matching Sanity document
  sort_order INTEGER,
  updated_at TEXT NOT NULL,               -- ISO timestamp
  PRIMARY KEY (type, slug)
);

-- Listing a content type in the editor and on the site.
CREATE INDEX IF NOT EXISTS idx_cms_documents_type
  ON cms_documents (type, sort_order, updated_at);
