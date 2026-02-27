import { createFileRoute } from "@tanstack/react-router";
import { apiApp } from "@app/api";

const serve = async ({ request }: { request: Request }) => {
  return apiApp.fetch(request);
};

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: serve,
      POST: serve,
      PUT: serve,
      DELETE: serve,
      PATCH: serve,
      OPTIONS: serve,
      HEAD: serve,
    },
  },
});
