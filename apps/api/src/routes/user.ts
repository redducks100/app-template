import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { account, session, user } from "../db/schema.js";
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

      return c.json({ success: true, locale: input.locale });
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

    return c.json(accounts && accounts.length > 0);
  })
  .get("/linked-accounts", async (c) => {
    const accounts = await getAuth().api.listUserAccounts({
      headers: c.req.raw.headers,
    });

    const filtered = accounts.filter((x) => x.providerId !== "credential");
    return c.json(filtered);
  })
  .get("/sessions", async (c) => {
    const sessionData = c.get("session");
    const sessions = await getDb().query.session.findMany({
      where: eq(session.userId, sessionData.userId),
    });

    const result = sessions.map((s) => ({
      ...s,
      current: sessionData.token === s.token,
    }));

    return c.json(result);
  });
