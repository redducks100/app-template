import { MutationCache, QueryClient } from "@tanstack/react-query";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { getLogger } from "@app/shared/logger";

import { DefaultCatchBoundary } from "./components/default-catch-boundary";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onError: (error) => {
        getLogger().error(error);
        toast.error(error.message);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
    },
  });

  return createTanstackRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    context: { queryClient },
    defaultErrorComponent: DefaultCatchBoundary,
    notFoundMode: "root",
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
