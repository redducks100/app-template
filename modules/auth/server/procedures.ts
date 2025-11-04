import { account, session } from "@/drizzle/auth";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export const authRouter = createTRPCRouter({
  hasPasswordAccount: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await db.query.account.findMany({
      where: and(
        eq(account.userId, ctx.auth.session.userId),
        eq(account.providerId, "credential")
      ),
    });

    return accounts && accounts.length > 0;
  }),
  getSessions: protectedProcedure.query(async ({ ctx }) => {
    const sessions = await db.query.session.findMany({
      where: and(eq(session.userId, ctx.auth.session.userId)),
    });

    return sessions.map((session) => ({
      ...session,
      current: ctx.auth.session.token === session.token,
    }));
  }),
});
