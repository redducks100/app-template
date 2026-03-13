import type { z } from "zod";

import { zValidator } from "@hono/zod-validator";

type ValidationTarget = "json" | "query" | "param" | "header" | "cookie" | "form";

export function zv<Target extends ValidationTarget, Schema extends z.ZodTypeAny>(
  target: Target,
  schema: Schema,
) {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      throw result.error;
    }
  });
}
