import { authRouter } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";
import { organizationsRouter } from "@/modules/organizations/server/procedures";

export const appRouter = createTRPCRouter({
  organizations: organizationsRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
