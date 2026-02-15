import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type Invitation =
  inferRouterOutputs<AppRouter>["invitations"]["getMany"][number];
