import { hc } from "hono/client";
import type { AppType } from "@app/api";

const API_URL = `${import.meta.env.VITE_API_URL}/api/`;

export const apiClient = hc<AppType>(API_URL, {
  init: { credentials: "include" },
});
