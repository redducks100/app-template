import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { sessionOptions } from "@/lib/query-options/auth";
import { DefaultNotFound } from "@/components/default-not-found";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const authData =
      await context.queryClient.ensureQueryData(sessionOptions());
    return { authData };
  },
  component: () => (
    <>
      <Toaster />
      <Outlet />
    </>
  ),
  notFoundComponent: DefaultNotFound,
});
