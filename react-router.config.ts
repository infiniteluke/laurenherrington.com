import type { Config } from "@react-router/dev/config";
import { getItemSlugs } from "./util/slugs";

let slugs = getItemSlugs();

export default {
  ssr: true,
  prerender: ["/", ...slugs.map((s) => `/item/${s}`)],
  future: {
    v8_viteEnvironmentApi: true,
    v8_splitRouteModules: true,
  },
} satisfies Config;
