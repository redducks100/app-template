import { Hono } from "hono";
import { auth } from "./lib/auth.js";
import { organizationRoutes } from "./routes/organizations.js";
import { invitationRoutes } from "./routes/invitations.js";
import { memberRoutes } from "./routes/members.js";
import { roleRoutes } from "./routes/roles.js";
import { userRoutes } from "./routes/user.js";
import { cors } from "hono/cors";

const app = new Hono()
  .use(
    "*",
    cors({
      origin: "http://localhost:3000", // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .route("/organizations", organizationRoutes)
  .route("/invitations", invitationRoutes)
  .route("/members", memberRoutes)
  .route("/roles", roleRoutes)
  .route("/user", userRoutes);

export type AppType = typeof app;

export { app as apiApp };
