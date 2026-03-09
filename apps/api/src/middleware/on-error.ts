import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";

export function onError(err: Error, c: Context): Response {
  if (err instanceof HTTPException) {
    const status = err.getResponse().status as ContentfulStatusCode;
    return c.json(
      { success: false as const, error: { message: err.message } },
      status,
    );
  }

  if (err instanceof z.ZodError) {
    const message = err.issues.map((e) => e.message).join("\n");
    return c.json(
      { success: false as const, error: { message } },
      400,
    );
  }

  console.error(err);
  return c.json(
    { success: false as const, error: { message: "Internal server error" } },
    500,
  );
}
