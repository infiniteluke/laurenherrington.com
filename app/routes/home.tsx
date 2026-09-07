import type { Route } from "./+types/home";
import { Welcome } from "../components/Welcome";
import { useEffect } from "react";
import shopSettings from "../data/shop_settings.json";
import { getListingsByIds } from "~/data/listings";
import { getDefaultStacks, getOtherStacks, isZineStack } from "~/utils/stacks";
import type { StackData } from "~/types";
import { getViewTransitionName } from "~/utils/viewTransition";
import { getPreviewImageSrc } from "~/utils/previewImage";
import { MAX_STACK_PREVIEW_IMAGES } from "~/constants";
import { useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "../root";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData.shopName },
    { name: "description", content: "collaging portfolio" },
  ];
}

function toStackPreview(stack: StackData) {
  const previewImages = isZineStack(stack)
    ? stack.pages.slice(0, MAX_STACK_PREVIEW_IMAGES).map((src, i) => ({
        key: src,
        src: getPreviewImageSrc(src),
        alt: `${stack.name} page ${i + 1}`,
        viewTransitionName: getViewTransitionName(`${stack.id}-${i}`),
      }))
    : getListingsByIds(stack.listingIds)
        .slice(0, MAX_STACK_PREVIEW_IMAGES)
        .map((listing) => ({
          key: listing.id,
          src: getPreviewImageSrc(listing.image),
          alt: listing.title,
          viewTransitionName: getViewTransitionName(listing.id),
        }));

  return { id: stack.id, name: stack.name, previewImages };
}

export async function loader() {
  const stacks = getDefaultStacks().map(toStackPreview);
  const otherStacks = getOtherStacks().map(toStackPreview);
  const iconUrl = shopSettings.icon_url;

  return {
    stacks,
    otherStacks,
    totalStacks: stacks.length,
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
      otherStacks={loaderData.otherStacks}
      totalStacks={loaderData.totalStacks}
      iconUrl={loaderData.iconUrl}
      shopName={loaderData.shopName}
      shopSettings={shopSettings}
      visitedIds={visitedIds}
    />
  );
}
