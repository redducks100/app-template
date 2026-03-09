import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { getAuth } from "../lib/auth.js";

type AuthSession = Awaited<
  ReturnType<ReturnType<typeof getAuth>["api"]["getSession"]>
>;

type AuthEnv = {
  Variables: {
    user: NonNullable<AuthSession>["user"];
    session: NonNullable<AuthSession>["session"];
  };
  Bindings: CloudflareBindings;
};

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await getAuth(c.env.R2).api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
