import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { ProgressBar } from "~/components/ProgressBar";
import stacksData from "~/data/stacks.json";
import {
  getVisitedCount,
  getVisitedIds,
  resetProgress,
} from "~/utils/progress.client";
import { SmileyCelebration } from "./components/Smiley";
import { ButtonLink } from "./components/ButtonLink";

export async function loader() {
  const firstStackId = stacksData[0]?.id ?? "";
  return {
    totalStacks: stacksData.length,
    firstStackId,
    firstUnviewedStackId: firstStackId,
    visitedCount: 0,
  };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  const visitedIds = getVisitedIds();
  const firstUnviewed = stacksData.find(
    (s) => !visitedIds.has(`/stack/${s.id}`)
  );
  return {
    ...serverData,
    visitedCount: visitedIds.size,
    visitedIds,
    firstUnviewedStackId: firstUnviewed?.id ?? serverData.firstStackId,
  };
}

clientLoader.hydrate = true as const;

export async function clientAction() {
  resetProgress();
  throw redirect("/");
}

export function shouldRevalidate() {
  // Always revalidate on navigation to pick up fresh visitedCount from localStorage
  return true;
}

export const links: Route.LinksFunction = () => [
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "https://fonts.gstatic.com/s/vt323/v18/pxiKyp0ihIEF2hsY.ttf",
    as: "font",
    type: "font/ttf",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=VT323&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: `html{background-size:40px 40px;background-image:linear-gradient(to right, rgba(128, 128, 128, 0.15) 1px, transparent 1px),linear-gradient(to bottom, rgba(128, 128, 128, 0.15) 1px, transparent 1px)}html,body{font-size:1.4rem;line-height:1;font-family:"VT323",ui-monospace,monospace}body{margin-left:0.75rem;margin-right:0.75rem}`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="mx-3">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const onFoundRoute = useLocation().pathname.startsWith("/found");
  return (
    <>
      <Outlet />
      {!onFoundRoute && "visitedCount" in loaderData && (
        <ProgressBar
          total={loaderData.totalStacks}
          visitedCount={loaderData.visitedCount}
        />
      )}
      {!onFoundRoute && (
        <SmileyCelebration
          active={loaderData.visitedCount === loaderData.totalStacks}
        />
      )}
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p className="mb-4">{details}</p>
      <ButtonLink to="/">Go Home</ButtonLink>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto mt-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
