const STORAGE_KEY = "lh_visited_items_v1";

function readSet(): Set<string> {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return new Set();
    const arr = JSON.parse(json);
    return new Set(
      Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []
    );
  } catch {
    return new Set();
  }
}

function writeSet(set: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function getVisitedCount(): number {
  return readSet().size;
}

export function markVisited(id: string): number {
  const set = readSet();
  set.add(id);
  writeSet(set);
  return set.size;
}
