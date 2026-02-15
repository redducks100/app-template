import { user } from "@/drizzle/auth";
import { db } from "@/lib/db";
import { updateLanguageSchema } from "@/modules/schemas/update-language-schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const userRouter = createTRPCRouter({
  updateLanguage: protectedProcedure
    .input(updateLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      await db
        .update(user)
        .set({ locale: input.locale })
        .where(eq(user.id, ctx.auth.session.userId));

      const cookieStore = await cookies();
      cookieStore.set("NEXT_LOCALE", input.locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });

      return { success: true, locale: input.locale };
    }),
});
