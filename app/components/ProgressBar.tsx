import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { getListingsTotal } from "~/data/listings";
import { getVisitedItemIds, onProgressUpdated } from "~/utils/progress.client";

export function ProgressBar() {
  const location = useLocation();
  const total = useMemo(() => getListingsTotal(), []);
  const [visitedCount, setVisitedCount] = useState(0);

  useEffect(() => {
    // Re-read on navigation so it reflects visits triggered elsewhere.
    setVisitedCount(getVisitedItemIds().length);
  }, [location.key]);

  useEffect(() => {
    return onProgressUpdated(() => {
      setVisitedCount(getVisitedItemIds().length);
    });
  }, []);

  if (!total) return null;

  const pct = Math.max(0, Math.min(1, visitedCount / total));
  const onDarkSurface = location.pathname.startsWith("/item/");

  return (
    <div
      className="fixed left-3 right-3 bottom-5 z-50 pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden="true"
    >
      <div
        className={[
          "h-5 rounded-full overflow-hidden shadow-sm",
          onDarkSurface ? "bg-white/25 ring-1 ring-white/20" : "bg-black/10",
        ].join(" ")}
      >
        <div
          className={[
            "h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none",
            onDarkSurface ? "bg-white/90" : "bg-black/70",
          ].join(" ")}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
