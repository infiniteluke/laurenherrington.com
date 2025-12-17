export function ProgressBar({
  total,
  visitedCount,
}: {
  total: number;
  visitedCount: number;
}) {
  if (!total) return null;

  const pct = Math.max(0, Math.min(1, visitedCount / total));

  return (
    <div
      className="fixed left-3 right-3 bottom-5 z-50 pointer-events-none"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        viewTransitionName: "progress-bar",
      }}
      aria-hidden="true"
    >
      <div className="h-5 overflow-hidden bg-win95-silver border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight">
        <div
          className="h-full bg-win95-navy transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
