import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { ProgressBar } from "~/components/ProgressBar";
import { getListings, getListingsTotal } from "~/data/listings";
import { getVisitedCount, resetProgress } from "~/utils/progress.client";
import { SmileyCelebration } from "./components/SmileyCelebration";
import { ButtonLink } from "./components/ButtonLink";
import shopSettings from "./data/shop_settings.json";

export async function loader() {
  const listings = getListings();
  return {
    totalListings: listings.length,
    firstItemId: listings[0]?.id ?? "",
    visitedCount: 0,
  };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  return {
    ...serverData,
    visitedCount: getVisitedCount(),
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
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
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
  return (
    <>
      <Outlet />
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
          />
        </a>
      </footer>
      {"visitedCount" in loaderData && (
        <ProgressBar
          total={loaderData.totalListings}
          visitedCount={loaderData.visitedCount}
        />
      )}
      <SmileyCelebration
        active={loaderData.visitedCount === loaderData.totalListings}
      />
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
