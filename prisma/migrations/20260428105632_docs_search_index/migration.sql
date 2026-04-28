-- Functional GIN index on docs.plaintext for full-text search.
-- Using expression indexes avoids recomputing tsvector on every query.
-- The app populates plaintext on every contentJson save; these indexes stay current automatically.
CREATE INDEX "docs_plaintext_search_idx"
  ON "docs" USING GIN (to_tsvector('english', "plaintext"));

-- Title index so title-only searches are fast without scanning plaintext.
CREATE INDEX "docs_title_search_idx"
  ON "docs" USING GIN (to_tsvector('english', "title"));
