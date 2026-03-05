import { Hono } from "hono";
import { getAuth } from "./lib/auth.js";
import { organizationRoutes } from "./routes/organizations.js";
import { invitationRoutes } from "./routes/invitations.js";
import { memberRoutes } from "./routes/members.js";
import { roleRoutes } from "./routes/roles.js";
import { userRoutes } from "./routes/user.js";
import { cors } from "hono/cors";

const routes = new Hono()
  .route("/organizations", organizationRoutes)
  .route("/invitations", invitationRoutes)
  .route("/members", memberRoutes)
  .route("/roles", roleRoutes)
  .route("/user", userRoutes);

const app = new Hono()
  .use(
    "*",
    cors({
      origin: process.env.APP_URL!,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .on(["POST", "GET"], "/api/auth/*", async (c) => {
    const res = await getAuth().handler(c.req.raw);
    return res;
  })
  .route("/api", routes);

export type AppType = typeof routes;

export { app as apiApp };
