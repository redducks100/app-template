import { hc } from "hono/client";
import type { AppType } from "@app/api";
import { getLogger } from "@app/shared/logger";

import type {
  ApiError,
  ApiPaginatedResponse,
  ApiResponse,
} from "@app/shared/types/result";
import type { ClientResponse } from "hono/client";

type UnwrapResponse<T> =
  T extends ApiPaginatedResponse<infer U>
    ? ApiPaginatedResponse<U>
    : T extends ApiResponse<infer U>
      ? ApiResponse<U>
      : never;

export const callRPC = async <T>(
  rpc: Promise<ClientResponse<T>>,
): Promise<UnwrapResponse<T>> => {
  try {
    const data = await rpc;
    if (!data.ok) {
      const error = (await data.json()) as ApiError;
      return error as UnwrapResponse<T>;
    }
    const res = await data.json();
    return res as UnwrapResponse<T>;
  } catch (error) {
    getLogger().error(error as Error, { source: "callRPC" });
    const message = (error as Error).message;
    return { success: false, error: { message } } as UnwrapResponse<T>;
  }
};

const API_URL = `${import.meta.env.VITE_API_URL}/api/`;

export const apiClient = hc<AppType>(API_URL, {
  init: { credentials: "include" },
});
