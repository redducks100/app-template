import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { setCookie } from "hono/cookie";
import { getAuth } from "../lib/auth.js";
import { getDb } from "../lib/db.js";
import { authMiddleware } from "../middleware/auth.js";
import { ok } from "../lib/result.js";
import { zv } from "../lib/validation.js";
import { updateLanguageSchema } from "@app/shared/schemas/update-language-schema";

export const userRoutes = new Hono<{ Bindings: CloudflareBindings }>()
  .use(authMiddleware)
  .patch(
    "/language",
    zv("json", updateLanguageSchema),
    async (c) => {
      const sessionData = c.get("session");
      const input = c.req.valid("json");

      await getDb()
        .updateTable("user")
        .set({ locale: input.locale })
        .where("id", "=", sessionData.userId)
        .execute();

      setCookie(c, "NEXT_LOCALE", input.locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "Lax",
      });

      return ok(c, { success: true, locale: input.locale });
    },
  )
  .get("/password", async (c) => {
    const sessionData = c.get("session");
    const accounts = await getDb()
      .selectFrom("account")
      .selectAll()
      .where("userId", "=", sessionData.userId)
      .where("providerId", "=", "credential")
      .execute();

    return ok(c, { hasPassword: accounts && accounts.length > 0 });
  })
  .get("/linked-accounts", async (c) => {
    const accounts = await getAuth(c.env.R2).api.listUserAccounts({
      headers: c.req.raw.headers,
    });

    const filtered = accounts.filter((x) => x.providerId !== "credential");
    return ok(c, filtered);
  })
  .get("/sessions", async (c) => {
    const sessionData = c.get("session");
    const sessions = await getAuth(c.env.R2).api.listSessions({
      headers: c.req.raw.headers,
    });

    const result = sessions.map((s) => ({
      ...s,
      current: sessionData.token === s.token,
    }));

    return ok(c, result);
  })
  .delete("/sessions/others", async (c) => {
    await getAuth(c.env.R2).api.revokeOtherSessions({
      headers: c.req.raw.headers,
    });
    return ok(c, { success: true });
  })
  .delete(
    "/sessions/:token",
    zv("param", z.object({ token: z.string() })),
    async (c) => {
      const { token } = c.req.valid("param");
      await getAuth(c.env.R2).api.revokeSession({
        body: { token },
        headers: c.req.raw.headers,
      });
      return ok(c, { success: true });
    },
  )
  .put(
    "/avatar",
    zv(
      "json",
      z.object({
        image: z.string(),
      }),
    ),
    async (c) => {
      const sessionData = c.get("session");
      const { image } = c.req.valid("json");

      const match = image.match(
        /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/,
      );
      if (!match) {
        throw new HTTPException(400, { message: "Invalid image format" });
      }

      const contentType = match[1];
      const base64Data = match[2];

      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      if (bytes.length > 200 * 1024) {
        throw new HTTPException(400, { message: "Image too large (max 200KB)" });
      }

      const key = `profile-pictures/${sessionData.userId}.webp`;
      await c.env.R2.put(key, bytes, {
        httpMetadata: {
          contentType,
          cacheControl: "public, max-age=31536000",
        },
      });

      const url = `${process.env.ASSETS_URL}/${key}?v=${Date.now()}`;
      await getDb()
        .updateTable("user")
        .set({ image: url })
        .where("id", "=", sessionData.userId)
        .execute();

      return ok(c, { url });
    },
  )
  .delete("/avatar", async (c) => {
    const sessionData = c.get("session");
    const key = `profile-pictures/${sessionData.userId}.webp`;

    await c.env.R2.delete(key);
    await getDb()
      .updateTable("user")
      .set({ image: null })
      .where("id", "=", sessionData.userId)
      .execute();

    return ok(c, { success: true });
  });
