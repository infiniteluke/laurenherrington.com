const STORAGE_KEY = "lh_visited_fullscreen_item_ids_v1";
const UPDATED_EVENT = "lh_progress_updated_v1";

function safeParse(json: string | null): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

export function getVisitedItemIds(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function markItemVisited(id: string): string[] {
  if (typeof window === "undefined") return [];
  const current = new Set(getVisitedItemIds());
  current.add(id);
  const next = Array.from(current).sort();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(UPDATED_EVENT));
  return next;
}

export function onProgressUpdated(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}


