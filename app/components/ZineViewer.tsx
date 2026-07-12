import { useEffect, useState } from "react";
import { ButtonLink } from "~/components/ButtonLink";
import { getViewTransitionName } from "~/utils/viewTransition";

const win95ButtonClass = [
  "text-sm px-3 py-1 select-none bg-win95-silver",
  "border-2 border-t-win95-highlight border-l-win95-highlight border-b-win95-shadow border-r-win95-shadow",
  "shadow-[1px_1px_0_black]",
  "active:border-t-win95-shadow active:border-l-win95-shadow active:border-b-win95-highlight active:border-r-win95-highlight",
  "active:shadow-none active:translate-x-px active:translate-y-px",
].join(" ");

interface ZineViewerProps {
  stackId: string;
  name: string;
  pages: string[];
  nextStack: { id: string; name: string } | null;
}

export function ZineViewer({
  stackId,
  name,
  pages,
  nextStack,
}: ZineViewerProps) {
  const [page, setPage] = useState(0);
  const isFirst = page === 0;
  const isLast = page === pages.length - 1;

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(pages.length - 1, p + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages.length]);

  return (
    <main className="h-dvh flex flex-col overflow-hidden gap-3">
      <h1 className="text-center mt-3">{name}</h1>
      <p className="text-center text-sm">
        Page {page + 1} of {pages.length}
      </p>

      <div className="flex-1 flex justify-center">
        <div
          className="max-h-full max-w-full"
          style={{ viewTransitionName: getViewTransitionName(`${stackId}-0`) }}
        >
          <img
            className="object-contain max-h-[calc(100dvh-150px)] max-w-full"
            src={pages[page]}
            alt={`${name} page ${page + 1}`}
            fetchPriority="high"
          />
        </div>
      </div>

      <div
        className="z-10 fixed bottom-10 left-0 right-0 flex items-center justify-between gap-3 px-3 py-3"
        style={{ viewTransitionName: "item-nav" }}
      >
        {isFirst ? (
          <ButtonLink className="text-sm" to="/" viewTransition>
            Home
          </ButtonLink>
        ) : (
          <button type="button" onClick={goPrev} className={win95ButtonClass}>
            ← Prev
          </button>
        )}

        {isLast ? (
          nextStack ? (
            <ButtonLink
              viewTransition
              className="text-sm"
              to={`/stack/${nextStack.id}`}
            >
              {nextStack.name} →
            </ButtonLink>
          ) : (
            <ButtonLink viewTransition className="text-sm" to="/">
              Home
            </ButtonLink>
          )
        ) : (
          <button type="button" onClick={goNext} className={win95ButtonClass}>
            Next →
          </button>
        )}
      </div>
    </main>
  );
}
