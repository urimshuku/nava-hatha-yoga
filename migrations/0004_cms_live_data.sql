-- Working copy (`data`) vs last published snapshot (`live_data`).
-- Save updates `data` only. Publish copies `data` into `live_data` and sets
-- published = 1. The public site reads `live_data` so a save cannot take a live
-- page off the website or show unfinished edits.
--
-- Existing published rows are backfilled so the site keeps showing what it
-- already shows until the next Publish.

ALTER TABLE cms_documents ADD COLUMN live_data TEXT;

UPDATE cms_documents
   SET live_data = data
 WHERE published = 1
   AND hidden = 0;
