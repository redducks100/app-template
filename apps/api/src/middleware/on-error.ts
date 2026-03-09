import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { getLogger } from "@app/shared/logger";

export function onError(err: Error, c: Context): Response {
  const reqContext = { path: c.req.path, method: c.req.method };

  if (err instanceof HTTPException) {
    const status = err.getResponse().status as ContentfulStatusCode;
    if (status >= 500) {
      getLogger().error(err, reqContext);
    } else {
      getLogger().warn(err.message, reqContext);
    }
    return c.json(
      { success: false as const, error: { message: err.message } },
      status,
    );
  }

  if (err instanceof z.ZodError) {
    const message = err.issues.map((e) => e.message).join("\n");
    getLogger().warn(message, reqContext);
    return c.json(
      { success: false as const, error: { message } },
      400,
    );
  }

  getLogger().error(err, reqContext);
  return c.json(
    { success: false as const, error: { message: "Internal server error" } },
    500,
  );
}
