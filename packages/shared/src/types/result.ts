import { z } from "zod";

export const PaginationParams = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationParams = z.infer<typeof PaginationParams>;

export const Pagination = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
export type Pagination = z.infer<typeof Pagination>;

export const PaginatedResponse = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: Pagination,
  });

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiPaginatedSuccess<T> {
  success: true;
  data: T[];
  pagination: z.infer<typeof Pagination>;
}

export type ApiError = {
  success: false;
  error: { message: string };
};

export interface ApiCursorSuccess<T> {
  success: true;
  data: T[];
  nextCursor: string | null;
}

export type ApiCursorResponse<T> = ApiCursorSuccess<T> | ApiError;
export type ApiPaginatedResponse<T> = ApiPaginatedSuccess<T> | ApiError;
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
