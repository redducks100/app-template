import { createIsomorphicFn } from "@tanstack/react-start";
import { hc } from "hono/client";
import type { AppType } from "@app/api";

type Client = ReturnType<typeof hc<AppType>>;

const getServerFetch = createIsomorphicFn()
  .client(() => undefined as typeof fetch | undefined)
  .server(() => {
    const serverFetch: typeof fetch = async (input, init) => {
      const { apiApp } = await import("@app/api");
      const { getRequestHeaders } = await import(
        "@tanstack/react-start/server"
      );

      const headers = new Headers(init?.headers);
      try {
        const reqHeaders = getRequestHeaders();
        const cookie = reqHeaders?.get("cookie");
        if (cookie) headers.set("cookie", cookie);
      } catch {}

      return apiApp.fetch(new Request(input as string, { ...init, headers }));
    };
    return serverFetch;
  });

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin + "/api/";
  return (process.env.APP_URL || "http://localhost:3000") + "/api/";
};

let _apiClient: Client;

export function getApiClient(): Client {
  if (!_apiClient) {
    const customFetch = getServerFetch();
    _apiClient = hc<AppType>(getBaseUrl(), {
      init: { credentials: "include" },
      ...(customFetch && { fetch: customFetch }),
    });
  }
  return _apiClient;
}
