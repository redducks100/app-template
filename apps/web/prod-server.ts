import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { apiApp } from "@app/api";

const app = new Hono();

// Serve static assets from client build
app.use("/*", serveStatic({ root: "./dist/client" }));

// Mount API
app.route("/api", apiApp);

// SSR catch-all
app.get("*", async (c) => {
  const { render } = await import("./dist/server/index.js");
  return render({ request: c.req.raw });
});

serve(
  { fetch: app.fetch, port: Number(process.env.PORT || 3000) },
  (info) => {
    console.log(`Server running at http://localhost:${info.port}`);
  }
);
