import { Form } from "react-router";

export function ProgressBar({
  total,
  visitedCount,
}: {
  total: number;
  visitedCount: number;
}) {
  if (!total) return null;

  const pct = Math.max(0, Math.min(1, visitedCount / total));
  const showReset = visitedCount > 0;

  return (
    <div
      className="fixed left-3 right-3 bottom-5 z-50 flex items-center gap-2"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        viewTransitionName: "progress-bar",
      }}
    >
      {/* Progress bar */}
      <div
        className="flex-1 h-7 overflow-hidden bg-win95-silver border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-win95-navy transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      {/* Reset button */}
      {showReset && (
        <Form method="post" action="/" className="flex" style={{ zIndex: 102 }}>
          <button
            type="submit"
            className="h-7 w-7 flex items-center justify-center bg-win95-silver border-2 border-t-win95-highlight border-l-win95-highlight border-b-win95-shadow border-r-win95-shadow active:border-t-win95-shadow active:border-l-win95-shadow active:border-b-win95-highlight active:border-r-win95-highlight"
            aria-label="Reset progress"
          >
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 5.5A5.5 5.5 0 0 1 13 8" />
              <path d="M14 4v4h-4" />
              <path d="M13 10.5A5.5 5.5 0 0 1 3 8" />
              <path d="M2 12V8h4" />
            </svg>
          </button>
        </Form>
      )}
    </div>
  );
}
