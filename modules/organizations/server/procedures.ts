import { member } from "@/drizzle/auth";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createOrganizationSchema } from "@/modules/schemas/create-organization-schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const organizationsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, slug } = input;
      const { auth: session } = ctx;
      try {
        await auth.api.checkOrganizationSlug({
          body: {
            slug: slug,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization slug is already taken.",
        });
      }

      const response = await auth.api.createOrganization({
        body: {
          name: name,
          slug: slug,
          userId: session.user.id,
        },
      });

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while creating an organization",
        });
      }

      return response;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const userMember = await db.query.member.findMany({
      where: and(eq(member.userId, ctx.auth.session.userId)),
      with: {
        organization: true,
      },
    });

    return userMember.map((x) => ({ ...x.organization, role: x.role }));
  }),
  getActiveOrganization: protectedProcedure.query(async ({ ctx }) => {
    const userMember = await db.query.member.findFirst({
      where: and(
        eq(member.userId, ctx.auth.session.userId),
        eq(
          member.organizationId,
          ctx.auth.session.activeOrganizationId as string,
        ),
      ),
      with: {
        organization: true,
      },
    });

    if (!userMember) {
      return null;
    }

    return { ...userMember.organization, role: userMember.role };
  }),
});
