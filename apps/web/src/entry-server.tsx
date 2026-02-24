import {
  createRequestHandler,
  defaultStreamHandler,
} from "@tanstack/react-router/ssr/server";
import { createRouter } from "./router";

export async function render({ request }: { request: Request }) {
  const cookie = request.headers.get("cookie") ?? undefined;

  const handler = createRequestHandler({
    request,
    createRouter: () => {
      const router = createRouter();
      router.update({
        context: { ...router.options.context, cookie },
      });
      return router;
    },
  });
  return await handler(defaultStreamHandler);
}
