import { createMiddleware } from "hono/factory";
import { getAuth } from "../lib/auth.js";

type AuthSession = Awaited<ReturnType<ReturnType<typeof getAuth>["api"]["getSession"]>>;

type AuthEnv = {
  Variables: {
    user: NonNullable<AuthSession>["user"];
    session: NonNullable<AuthSession>["session"];
  };
};

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await getAuth().api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
