import { hc } from "hono/client";
import type { AppType } from "@app/api";

export const apiClient = hc<AppType>("http://localhost:3000/api/", {
  init: {
    credentials: "include",
  },
});
