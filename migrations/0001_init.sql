CREATE TABLE finds (
  id          TEXT PRIMARY KEY,
  art_id      TEXT NOT NULL,
  user_uuid   TEXT NOT NULL,
  found_by    TEXT,
  location    TEXT,
  found_at    INTEGER NOT NULL,
  adopted     INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL,
  ip_hash     TEXT
);

CREATE INDEX idx_finds_art_created ON finds (art_id, created_at DESC);
CREATE INDEX idx_finds_user        ON finds (user_uuid);
CREATE INDEX idx_finds_created     ON finds (created_at DESC);
CREATE INDEX idx_finds_adopted     ON finds (art_id) WHERE adopted = 1;
