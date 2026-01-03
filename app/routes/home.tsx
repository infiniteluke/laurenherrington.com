import type { Route } from "./+types/home";
import { Welcome } from "../components/Welcome";
import { useEffect } from "react";
import shopSettings from "../data/shop_settings.json";
import stacksData from "../data/stacks.json";
import { getListingsByIds } from "~/data/listings";
import { useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "../root";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData.shopName },
    { name: "description", content: "collaging portfolio" },
  ];
}

export async function loader() {
  const stacks = stacksData.map((stack) => ({
    ...stack,
    listings: getListingsByIds(stack.listingIds),
  }));
  const iconUrl = shopSettings.icon_url;

  return {
    stacks,
    totalStacks: stacksData.length,
    iconUrl,
    shopName: shopSettings.name,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>("root");

  useEffect(() => {
    // An old version of this site contained a service worker.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister().then(function (result) {
            if (result) {
              console.log("Service worker unregistered successfully.");
            } else {
              console.log(
                "Service worker unregistration failed or was already unregistered."
              );
            }
          });
        }
      });
    }
  }, []);

  // Get visited IDs from root loader data
  const visitedIds = rootLoaderData?.visitedIds ?? new Set<string>();

  return (
    <Welcome
      visitedCount={rootLoaderData?.visitedCount ?? 0}
      firstStackId={rootLoaderData?.firstStackId ?? ""}
      firstUnviewedStackId={rootLoaderData?.firstUnviewedStackId ?? ""}
      stacks={loaderData.stacks}
      totalStacks={loaderData.totalStacks}
      iconUrl={loaderData.iconUrl}
      shopName={loaderData.shopName}
      shopSettings={shopSettings}
      visitedIds={visitedIds}
    />
  );
}
