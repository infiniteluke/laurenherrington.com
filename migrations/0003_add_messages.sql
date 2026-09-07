CREATE TABLE messages (
  id          TEXT PRIMARY KEY,
  name        TEXT,
  email       TEXT,
  body        TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  ip_hash     TEXT,
  -- 0 until the notification email is accepted by the send_email binding, so a
  -- delivery failure is visible in the table rather than silently lost.
  emailed     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_messages_created    ON messages (created_at DESC);
CREATE INDEX idx_messages_ip_created ON messages (ip_hash, created_at DESC);
