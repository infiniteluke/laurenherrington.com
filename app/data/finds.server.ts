import type { Find } from "~/types";

interface FindRow {
  id: string;
  art_id: string;
  user_uuid: string;
  found_by: string | null;
  location: string | null;
  found_at: number;
  adopted: number;
  auto: number;
  created_at: number;
  ip_hash: string | null;
}

function rowToFind(row: FindRow): Find {
  return {
    id: row.id,
    artId: row.art_id,
    userUuid: row.user_uuid,
    foundBy: row.found_by,
    location: row.location,
    foundAt: row.found_at,
    adopted: row.adopted === 1,
    auto: row.auto === 1,
    createdAt: row.created_at,
    ipHash: row.ip_hash,
  };
}

export interface NewFind {
  artId: string;
  userUuid: string;
  foundBy?: string | null;
  location?: string | null;
  foundAt: number;
  adopted: boolean;
  auto?: boolean;
  ipHash?: string | null;
}

export async function recordFind(
  db: D1Database,
  input: NewFind
): Promise<Find> {
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  const adopted = input.adopted ? 1 : 0;
  const auto = input.auto ? 1 : 0;

  const row = await db
    .prepare(
      `INSERT INTO finds (id, art_id, user_uuid, found_by, location, found_at, adopted, auto, created_at, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
    )
    .bind(
      id,
      input.artId,
      input.userUuid,
      input.foundBy ?? null,
      input.location ?? null,
      input.foundAt,
      adopted,
      auto,
      createdAt,
      input.ipHash ?? null
    )
    .first<FindRow>();

  if (!row) throw new Error("recordFind: insert returned no row");
  return rowToFind(row);
}

export async function getFindsForArt(
  db: D1Database,
  artId: string,
  limit = 20
): Promise<Find[]> {
  const result = await db
    .prepare(
      `SELECT * FROM finds WHERE art_id = ? ORDER BY created_at DESC LIMIT ?`
    )
    .bind(artId, limit)
    .all<FindRow>();
  return (result.results ?? []).map(rowToFind);
}

export async function getFindsForUser(
  db: D1Database,
  userUuid: string
): Promise<Find[]> {
  const result = await db
    .prepare(`SELECT * FROM finds WHERE user_uuid = ? ORDER BY created_at DESC`)
    .bind(userUuid)
    .all<FindRow>();
  return (result.results ?? []).map(rowToFind);
}

export async function getRecentActivity(
  db: D1Database,
  limit = 10
): Promise<Find[]> {
  const result = await db
    .prepare(`SELECT * FROM finds ORDER BY created_at DESC LIMIT ?`)
    .bind(limit)
    .all<FindRow>();
  return (result.results ?? []).map(rowToFind);
}

export async function isAdopted(
  db: D1Database,
  artId: string
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT 1 AS x FROM finds WHERE art_id = ? AND adopted = 1 LIMIT 1`
    )
    .bind(artId)
    .first<{ x: number }>();
  return row !== null;
}

export async function getAdopter(
  db: D1Database,
  artId: string
): Promise<Find | null> {
  const row = await db
    .prepare(
      `SELECT * FROM finds WHERE art_id = ? AND adopted = 1 ORDER BY created_at ASC LIMIT 1`
    )
    .bind(artId)
    .first<FindRow>();
  return row ? rowToFind(row) : null;
}

export async function hasUserFoundArt(
  db: D1Database,
  userUuid: string,
  artId: string
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT 1 AS x FROM finds WHERE user_uuid = ? AND art_id = ? LIMIT 1`
    )
    .bind(userUuid, artId)
    .first<{ x: number }>();
  return row !== null;
}

export async function getAdoptedHuntIds(
  db: D1Database,
  artIds: string[]
): Promise<Set<string>> {
  if (artIds.length === 0) return new Set();
  const placeholders = artIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `SELECT DISTINCT art_id FROM finds WHERE adopted = 1 AND art_id IN (${placeholders})`
    )
    .bind(...artIds)
    .all<{ art_id: string }>();
  return new Set((result.results ?? []).map((r) => r.art_id));
}
