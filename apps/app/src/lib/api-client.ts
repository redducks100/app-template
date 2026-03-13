import type { ClientResponse } from "hono/client";

import { hc } from "hono/client";

import type { AppType } from "@app/api";
import type {
  ApiCursorResponse,
  ApiError,
  ApiPaginatedResponse,
  ApiResponse,
} from "@app/shared/types/result";

import { getLogger } from "@app/shared/logger";

const API_URL = `${import.meta.env.VITE_API_URL}/api/`;

type InferCursor<T> = T extends ApiCursorResponse<infer U> ? ApiCursorResponse<U> : never;
type InferPaginated<T> = T extends ApiPaginatedResponse<infer U> ? ApiPaginatedResponse<U> : never;
type InferSimple<T> = T extends ApiResponse<infer U> ? ApiResponse<U> : never;

type UnwrapResponse<T> = [InferCursor<T>] extends [never]
  ? [InferPaginated<T>] extends [never]
    ? InferSimple<T>
    : InferPaginated<T>
  : InferCursor<T>;

export const callRPC = async <T>(rpc: Promise<ClientResponse<T>>): Promise<UnwrapResponse<T>> => {
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

export const apiClient = hc<AppType>(API_URL, {
  init: { credentials: "include" },
});
