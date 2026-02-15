import { authRouter } from "@/modules/auth/server/procedures";
import { invitationsRouter } from "@/modules/invitations/server/procedures";
import { createTRPCRouter } from "../init";
import { organizationsRouter } from "@/modules/organizations/server/procedures";
import { userRouter } from "@/modules/user/server/procedures";

export const appRouter = createTRPCRouter({
  organizations: organizationsRouter,
  invitations: invitationsRouter,
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
