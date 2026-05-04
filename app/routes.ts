import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("item/:id", "routes/item.$id.tsx"),
  route("stack/:id", "routes/stack.$id.tsx"),
  route("found", "routes/found.tsx"),
] satisfies RouteConfig;
