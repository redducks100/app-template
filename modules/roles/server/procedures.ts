import { auth } from "@/lib/auth/auth";
import { owner, admin, member } from "@/lib/auth/permissions";
import {
  createRoleSchema,
  updateRoleSchema,
  deleteRoleSchema,
} from "@/modules/schemas/create-role-schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import type { RoleData } from "../types";

const staticRoles: RoleData[] = [
  {
    id: "static-owner",
    role: "owner",
    permission: owner.statements as Record<string, string[]>,
    isDefault: true,
  },
  {
    id: "static-admin",
    role: "admin",
    permission: admin.statements as Record<string, string[]>,
    isDefault: true,
  },
  {
    id: "static-member",
    role: "member",
    permission: member.statements as Record<string, string[]>,
    isDefault: true,
  },
];

export const rolesRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const organizationId = ctx.auth.session.activeOrganizationId;

    if (!organizationId) {
      return staticRoles;
    }

    try {
      const dynamicRoles = await auth.api.listOrgRoles({
        query: { organizationId },
        headers: await headers(),
      });

      const dynamicRoleData: RoleData[] = (dynamicRoles ?? []).map((r) => ({
        id: r.id,
        role: r.role,
        permission: r.permission,
        isDefault: false,
        organizationId: r.organizationId,
        createdAt: r.createdAt,
      }));

      return [...staticRoles, ...dynamicRoleData];
    } catch {
      return staticRoles;
    }
  }),

  create: protectedProcedure
    .input(createRoleSchema)
    .mutation(async ({ input, ctx }) => {
      const organizationId = ctx.auth.session.activeOrganizationId;

      if (!organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active organization selected.",
        });
      }

      const response = await auth.api.createOrgRole({
        body: {
          role: input.name,
          permission: input.permission,
          organizationId,
        },
        headers: await headers(),
      });

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create role.",
        });
      }

      return response;
    }),

  update: protectedProcedure
    .input(updateRoleSchema)
    .mutation(async ({ input, ctx }) => {
      const organizationId = ctx.auth.session.activeOrganizationId;

      if (!organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active organization selected.",
        });
      }

      const response = await auth.api.updateOrgRole({
        body: {
          roleId: input.roleId,
          organizationId,
          data: input.data,
        },
        headers: await headers(),
      });

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update role.",
        });
      }

      return response;
    }),

  delete: protectedProcedure
    .input(deleteRoleSchema)
    .mutation(async ({ input, ctx }) => {
      const organizationId = ctx.auth.session.activeOrganizationId;

      if (!organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active organization selected.",
        });
      }

      const response = await auth.api.deleteOrgRole({
        body: {
          roleId: input.roleId,
          organizationId,
        },
        headers: await headers(),
      });

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete role.",
        });
      }

      return response;
    }),
});
