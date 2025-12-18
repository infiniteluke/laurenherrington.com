import type { Route } from "./+types/home";
import { Welcome } from "../components/Welcome";
import { useEffect } from "react";
import shopSettings from "../data/shop_settings.json";
import { getListings } from "~/data/listings";
import { useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "../root";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData.shopName },
    { name: "description", content: "collaging portfolio" },
  ];
}

export async function loader() {
  const listings = getListings();
  const iconUrl = shopSettings.icon_url;

  return {
    listings,
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

  return (
    <Welcome
      visitedCount={rootLoaderData?.visitedCount ?? 0}
      listings={loaderData.listings}
      iconUrl={loaderData.iconUrl}
      shopName={loaderData.shopName}
    />
  );
}
