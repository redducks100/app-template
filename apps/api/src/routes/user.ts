import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { account, user } from "../db/schema.js";
import { getAuth } from "../lib/auth.js";
import { getDb } from "../lib/db.js";
import { authMiddleware } from "../middleware/auth.js";
import { updateLanguageSchema } from "@app/shared/schemas/update-language-schema";

export const userRoutes = new Hono()
  .use(authMiddleware)
  .post(
    "/update-language",
    zValidator("json", updateLanguageSchema),
    async (c) => {
      const sessionData = c.get("session");
      const input = c.req.valid("json");

      await getDb()
        .update(user)
        .set({ locale: input.locale })
        .where(eq(user.id, sessionData.userId));

      setCookie(c, "NEXT_LOCALE", input.locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "Lax",
      });

      return c.json({ success: true, locale: input.locale }, 200);
    }
  )
  .get("/has-password", async (c) => {
    const sessionData = c.get("session");
    const accounts = await getDb().query.account.findMany({
      where: and(
        eq(account.userId, sessionData.userId),
        eq(account.providerId, "credential")
      ),
    });

    return c.json(accounts && accounts.length > 0, 200);
  })
  .get("/linked-accounts", async (c) => {
    const accounts = await getAuth().api.listUserAccounts({
      headers: c.req.raw.headers,
    });

    const filtered = accounts.filter((x) => x.providerId !== "credential");
    return c.json(filtered, 200);
  })
  .get("/sessions", async (c) => {
    const sessionData = c.get("session");
    const sessions = await getAuth().api.listSessions({
      headers: c.req.raw.headers,
    });

    const result = sessions.map((s) => ({
      ...s,
      current: sessionData.token === s.token,
    }));

    return c.json(result, 200);
  })
  .post(
    "/sessions/revoke",
    zValidator("json", z.object({ token: z.string() })),
    async (c) => {
      const { token } = c.req.valid("json");
      await getAuth().api.revokeSession({
        body: { token },
        headers: c.req.raw.headers,
      });
      return c.json({ success: true }, 200);
    }
  )
  .post("/sessions/revoke-others", async (c) => {
    await getAuth().api.revokeOtherSessions({
      headers: c.req.raw.headers,
    });
    return c.json({ success: true }, 200);
  });
