import type { ContactMessage } from "~/types";

interface MessageRow {
  id: string;
  name: string | null;
  email: string | null;
  body: string;
  created_at: number;
  ip_hash: string | null;
  emailed: number;
}

function rowToMessage(row: MessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    body: row.body,
    createdAt: row.created_at,
    ipHash: row.ip_hash,
    emailed: row.emailed === 1,
  };
}

export interface NewMessage {
  name?: string | null;
  email?: string | null;
  body: string;
  ipHash?: string | null;
}

export async function recordMessage(
  db: D1Database,
  input: NewMessage
): Promise<ContactMessage> {
  const row = await db
    .prepare(
      `INSERT INTO messages (id, name, email, body, created_at, ip_hash, emailed)
       VALUES (?, ?, ?, ?, ?, ?, 0)
       RETURNING *`
    )
    .bind(
      crypto.randomUUID(),
      input.name ?? null,
      input.email ?? null,
      input.body,
      Date.now(),
      input.ipHash ?? null
    )
    .first<MessageRow>();

  if (!row) throw new Error("Failed to record message");
  return rowToMessage(row);
}

export async function markMessageEmailed(
  db: D1Database,
  id: string
): Promise<void> {
  await db
    .prepare(`UPDATE messages SET emailed = 1 WHERE id = ?`)
    .bind(id)
    .run();
}

export async function countRecentMessagesByIp(
  db: D1Database,
  ipHash: string,
  sinceMs: number
): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM messages WHERE ip_hash = ? AND created_at >= ?`
    )
    .bind(ipHash, sinceMs)
    .first<{ n: number }>();
  return row?.n ?? 0;
}
