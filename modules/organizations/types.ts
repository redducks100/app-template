import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type OrganizationActive =
  inferRouterOutputs<AppRouter>["organizations"]["getActiveOrganization"];
