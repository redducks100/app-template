import { Hono } from "hono";
import { apiApp } from "@app/api";

const app = new Hono();

// Mount API on /api
app.route("/api", apiApp);

// SSR catch-all: TanStack Router handles all non-API routes
app.get("*", async (c) => {
  const { render } = await import("./src/entry-server");
  return render({ request: c.req.raw });
});

export default app;
