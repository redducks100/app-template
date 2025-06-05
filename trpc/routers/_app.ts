import { createTRPCRouter } from "../init";
import { organizationsRouter } from "@/modules/organizations/server/procedures";

export const appRouter = createTRPCRouter({
  organizations: organizationsRouter,
});

export type AppRouter = typeof appRouter;
