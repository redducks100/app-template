import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { invitation } from "@/drizzle/auth";
import { createInvitationSchema } from "@/modules/schemas/create-invitation-schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

export const invitationsRouter = createTRPCRouter({
  getInvitation: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db.query.invitation.findFirst({
        where: eq(invitation.id, input.id),
        with: {
          inviter: true,
          organization: true,
        },
      });

      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found" });
      }

      return result;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const organizationId = ctx.auth.session.activeOrganizationId;

    if (!organizationId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active organization selected.",
      });
    }

    const response = await auth.api.listInvitations({
      query: { organizationId },
      headers: await headers(),
    });

    return response;
  }),

  create: protectedProcedure
    .input(createInvitationSchema)
    .mutation(async ({ input, ctx }) => {
      const organizationId = ctx.auth.session.activeOrganizationId;

      if (!organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active organization selected.",
        });
      }

      const response = await auth.api.createInvitation({
        body: {
          email: input.email,
          role: input.role as "admin" | "member" | "owner",
          organizationId,
        },
        headers: await headers(),
      });

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while creating the invitation.",
        });
      }

      return response;
    }),

  cancel: protectedProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ input }) => {
      const response = await auth.api.cancelInvitation({
        body: { invitationId: input.invitationId },
        headers: await headers(),
      });

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while canceling the invitation.",
        });
      }

      return response;
    }),
});
