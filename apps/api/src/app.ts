/// <reference path="./env.d.ts" />

import { Hono } from "hono";
import { getAuth } from "./lib/auth.js";
import { organizationRoutes } from "./routes/organizations.js";
import { invitationRoutes } from "./routes/invitations.js";
import { memberRoutes } from "./routes/members.js";
import { roleRoutes } from "./routes/roles.js";
import { userRoutes } from "./routes/user.js";
import { cors } from "hono/cors";
import { onError } from "./middleware/on-error.js";

const routes = new Hono<{ Bindings: CloudflareBindings }>()
  .route("/organizations", organizationRoutes)
  .route("/invitations", invitationRoutes)
  .route("/members", memberRoutes)
  .route("/roles", roleRoutes)
  .route("/user", userRoutes);

const app = new Hono<{ Bindings: CloudflareBindings }>()
  .onError(onError)
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
    const res = await getAuth(c.env.R2).handler(c.req.raw);
    return res;
  })
  .get("/api/assets/:key{.+}", async (c) => {
    const key = c.req.param("key");
    const object = await c.env.R2.get(key);

    if (!object) {
      return c.notFound();
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("ETag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(object.body, { headers });
  })
  .route("/api", routes);

export type AppType = typeof routes;

export { app as apiApp };
