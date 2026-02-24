import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { auth } from "../lib/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { owner, admin, member } from "@app/shared/permissions";
import {
  createRoleSchema,
  updateRoleSchema,
  deleteRoleSchema,
} from "@app/shared/schemas/create-role-schema";
import type { RoleData } from "@app/shared/types/roles";

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

export const roleRoutes = new Hono()
  .use(authMiddleware)
  .get("/list", async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      return c.json(staticRoles);
    }

    try {
      const dynamicRoles = await auth.api.listOrgRoles({
        query: { organizationId },
        headers: c.req.raw.headers,
      });

      const dynamicRoleData: RoleData[] = (dynamicRoles ?? []).map((r) => ({
        id: r.id,
        role: r.role,
        permission: r.permission,
        isDefault: false,
        organizationId: r.organizationId,
        createdAt: r.createdAt,
      }));

      return c.json([...staticRoles, ...dynamicRoleData]);
    } catch {
      return c.json(staticRoles);
    }
  })
  .post(
    "/create",
    zValidator("json", createRoleSchema),
    async (c) => {
      const session = c.get("session");
      const input = c.req.valid("json");
      const organizationId = session.activeOrganizationId;

      if (!organizationId) {
        return c.json(
          { error: "No active organization selected." },
          400
        );
      }

      const response = await auth.api.createOrgRole({
        body: {
          role: input.name,
          permission: input.permission,
          organizationId,
        },
        headers: c.req.raw.headers,
      });

      if (!response) {
        return c.json({ error: "Failed to create role." }, 500);
      }

      return c.json(response, 201);
    }
  )
  .post(
    "/update",
    zValidator("json", updateRoleSchema),
    async (c) => {
      const session = c.get("session");
      const input = c.req.valid("json");
      const organizationId = session.activeOrganizationId;

      if (!organizationId) {
        return c.json(
          { error: "No active organization selected." },
          400
        );
      }

      const response = await auth.api.updateOrgRole({
        body: {
          roleId: input.roleId,
          organizationId,
          data: input.data,
        },
        headers: c.req.raw.headers,
      });

      if (!response) {
        return c.json({ error: "Failed to update role." }, 500);
      }

      return c.json(response);
    }
  )
  .post(
    "/delete",
    zValidator("json", deleteRoleSchema),
    async (c) => {
      const session = c.get("session");
      const input = c.req.valid("json");
      const organizationId = session.activeOrganizationId;

      if (!organizationId) {
        return c.json(
          { error: "No active organization selected." },
          400
        );
      }

      const response = await auth.api.deleteOrgRole({
        body: { roleId: input.roleId, organizationId },
        headers: c.req.raw.headers,
      });

      if (!response) {
        return c.json({ error: "Failed to delete role." }, 500);
      }

      return c.json(response);
    }
  );
