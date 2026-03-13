import type { QueryClient } from "@tanstack/react-query";

import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { DefaultNotFound } from "@/components/default-not-found";
import { Toaster } from "@app/ui/components/sonner";
import { sessionOptions } from "@/lib/queries/auth";
import { getLogger } from "@app/shared/logger";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const authData = await context.queryClient.ensureQueryData(sessionOptions());
    if (authData?.user) {
      getLogger().setUser({ id: authData.user.id, email: authData.user.email });
    }
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
