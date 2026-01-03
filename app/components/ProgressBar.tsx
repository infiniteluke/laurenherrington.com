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
  const hasProgress = visitedCount > 0;
  const showEllipsis = visitedCount > 0 && visitedCount < total;

  return (
    <>
      <div
        className={`fixed left-3 bottom-3 z-50 ${
          hasProgress ? "right-[calc(0.75rem+1.75rem+0.5rem)]" : "right-3"
        }`}
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          viewTransitionName: "progress-bar",
        }}
      >
        <div
          className="relative h-7 overflow-hidden bg-win95-silver border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="h-full bg-win95-navy transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${pct * 100}%` }}
          />
          <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none text-sm text-white font-bold">
            {visitedCount} / {total} stacks visited
            {showEllipsis && (
              <span className="inline-block w-[0.75rem] text-left ellipsis-animation" />
            )}
          </div>
        </div>
      </div>

      {hasProgress && (
        <Form
          method="post"
          action="/"
          className="fixed right-3 bottom-3 z-[110]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
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
    </>
  );
}
