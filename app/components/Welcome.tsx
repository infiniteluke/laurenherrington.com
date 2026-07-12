import { ListingStack } from "~/components/ListingStack";
import type { StackPreviewImage } from "~/components/ListingStack";
import { ButtonLink } from "./ButtonLink";
import { Smiley } from "./Smiley";
import { resetProgress } from "~/utils/progress.client";
import { useState, useEffect, useRef } from "react";

interface Stack {
  id: string;
  name: string;
  previewImages: StackPreviewImage[];
}

interface WelcomeProps {
  stacks: Stack[];
  totalStacks: number;
  iconUrl: string;
  shopName: string;
  visitedCount: number;
  firstStackId: string;
  firstUnviewedStackId: string;
  shopSettings: {
    name: string;
    icon_url: string;
  };
  visitedIds: Set<string>;
}

export function Welcome({
  stacks,
  totalStacks,
  iconUrl,
  shopName,
  visitedCount,
  firstUnviewedStackId,
  shopSettings,
  visitedIds,
}: WelcomeProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const starVideoRef = useRef<HTMLVideoElement>(null);
  const unicornVideoRef = useRef<HTMLVideoElement>(null);
  const wizardVideoRef = useRef<HTMLVideoElement>(null);
  const spacemanVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const hasProgress = visitedCount > 0;
  const isDone = visitedCount === totalStacks;

  // Pause videos when celebration is active
  useEffect(() => {
    const videos = [
      starVideoRef.current,
      unicornVideoRef.current,
      wizardVideoRef.current,
      spacemanVideoRef.current,
    ].filter(Boolean) as HTMLVideoElement[];

    if (isDone) {
      videos.forEach((video) => video.pause());
    } else {
      videos.forEach((video) => {
        if (video.paused) {
          // ignore errors if video hasn't loaded yet
          video.play().catch(() => {});
        }
      });
    }
  }, [isDone]);

  return (
    <main className="flex items-center justify-center flex-col lg:mx-24 gap-4 my-8">
      <ButtonLink className=" self-center md:self-end" to="/found">
        👀 Finders Keepers
      </ButtonLink>
      <header className="flex items-center gap-4">
        <img
          src={iconUrl}
          alt={`${shopName} shop icon`}
          className="w-16 h-16"
          width={64}
          height={64}
          fetchPriority="high"
        />
        <h1>{shopName}</h1>
      </header>
      <p className="text-sm text-center">
        {isDone ? (
          <>
            You've visited all {totalStacks} stacks! <Smiley size={32} />
          </>
        ) : hasProgress ? (
          <>
            Visit all {totalStacks} stacks to unlock a surprise!{" "}
            <Smiley size={32} />
            <br />
            <span className="text-xs opacity-75">
              {visitedCount} / {totalStacks} complete
            </span>
          </>
        ) : (
          <>
            Click through all {totalStacks} stacks to unlock a surprise!{" "}
            <Smiley size={32} />
          </>
        )}
      </p>
      <div className="flex items-center gap-4">
        <video
          ref={starVideoRef}
          src="/star.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="md:h-16 h-5"
          aria-label="star"
          width={64}
          height={64}
        />
        <video
          ref={unicornVideoRef}
          src="/unicorn.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="md:h-16 h-8"
          aria-label="unicorn"
          width={64}
          height={64}
        />
        {firstUnviewedStackId && (
          <ButtonLink
            to={`/stack/${firstUnviewedStackId}`}
            onClick={() => {
              if (isDone) {
                resetProgress();
              }
            }}
            className="text-center"
          >
            {isHydrated
              ? hasProgress
                ? isDone
                  ? "Restart"
                  : "Continue"
                : "Start"
              : "\u00A0"}
          </ButtonLink>
        )}
        <video
          ref={wizardVideoRef}
          src="/wizard.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="md:h-16 h-5"
          aria-label="wizard"
          width={64}
          height={64}
        />
        <video
          ref={spacemanVideoRef}
          src="/spaceman.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="md:h-16 h-8"
          aria-label="spaceman"
          width={64}
          height={64}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-32 mt-12">
        {stacks.map((stack) => (
          <ListingStack
            key={stack.id}
            stack={stack}
            isVisited={visitedIds.has(`/stack/${stack.id}`)}
          />
        ))}
      </div>
      <footer className="flex justify-center mt-16 mb-8">
        <a
          href={`https://www.etsy.com/shop/${shopSettings.name}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Etsy shop"
        >
          <img
            src="/etsy-svgrepo-com.svg"
            alt="Etsy"
            className="w-16 h-16 hover:opacity-80 transition-opacity"
            width={64}
            height={64}
          />
        </a>
      </footer>
    </main>
  );
}
