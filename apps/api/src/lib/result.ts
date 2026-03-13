import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function ok<T>(c: Context, data: T, status: ContentfulStatusCode = 200) {
  return c.json({ success: true as const, data }, status);
}

export function okCursor<T>(
  c: Context,
  { data, nextCursor }: { data: T[]; nextCursor: string | null },
) {
  return c.json({ success: true as const, data, nextCursor });
}
