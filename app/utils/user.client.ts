const KEY = "lh_user_uuid_v1";

export function mirrorUserUuid(uuid: string): void {
  try {
    if (localStorage.getItem(KEY) !== uuid) localStorage.setItem(KEY, uuid);
  } catch {
    // ignore (private mode, storage full, etc.)
  }
}

export function getMirroredUserUuid(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
