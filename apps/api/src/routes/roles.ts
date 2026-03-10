import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { getAuth } from "../lib/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { ok } from "../lib/result.js";
import { zv } from "../lib/validation.js";
import { owner, admin, member } from "@app/shared/permissions";
import {
  createRoleSchema,
  updateRoleSchema,
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
  .get("/", async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      return ok(c, staticRoles);
    }

    try {
      const dynamicRoles = await getAuth(c.env.R2).api.listOrgRoles({
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

      return ok(c, [...staticRoles, ...dynamicRoleData]);
    } catch {
      return ok(c, staticRoles);
    }
  })
  .get("/permissions", async (c) => {
    const headers = c.req.raw.headers;

    const [canCreate, canUpdate, canDelete] = await Promise.all([
      getAuth(c.env.R2)
        .api.hasPermission({
          headers,
          body: { permissions: { role: ["create"] } },
        })
        .then((r) => r.success),
      getAuth(c.env.R2)
        .api.hasPermission({
          headers,
          body: { permissions: { role: ["update"] } },
        })
        .then((r) => r.success),
      getAuth(c.env.R2)
        .api.hasPermission({
          headers,
          body: { permissions: { role: ["delete"] } },
        })
        .then((r) => r.success),
    ]);

    return ok(c, { canCreate, canUpdate, canDelete });
  })
  .post("/", zv("json", createRoleSchema), async (c) => {
    const session = c.get("session");
    const input = c.req.valid("json");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, { message: "No active organization selected." });
    }

    const hasPermission = await getAuth(c.env.R2).api.hasPermission({
      headers: c.req.raw.headers,
      body: { permissions: { role: ["create"] } },
    });

    if (!hasPermission.success) {
      throw new HTTPException(403, { message: "You do not have permission to create roles." });
    }

    const response = await getAuth(c.env.R2).api.createOrgRole({
      body: {
        role: input.name,
        permission: input.permission,
        organizationId,
      },
      headers: c.req.raw.headers,
    });

    if (!response) {
      throw new HTTPException(500, { message: "Failed to create role." });
    }

    return ok(c, response, 201);
  })
  .patch(
    "/:id",
    zv("param", z.object({ id: z.string() })),
    zv("json", updateRoleSchema),
    async (c) => {
      const session = c.get("session");
      const { id: roleId } = c.req.valid("param");
      const input = c.req.valid("json");
      const organizationId = session.activeOrganizationId;

      if (!organizationId) {
        throw new HTTPException(400, { message: "No active organization selected." });
      }

      const hasPermission = await getAuth(c.env.R2).api.hasPermission({
        headers: c.req.raw.headers,
        body: { permissions: { role: ["update"] } },
      });

      if (!hasPermission.success) {
        throw new HTTPException(403, { message: "You do not have permission to update roles." });
      }

      const response = await getAuth(c.env.R2).api.updateOrgRole({
        body: {
          roleId,
          organizationId,
          data: input.data,
        },
        headers: c.req.raw.headers,
      });

      if (!response) {
        throw new HTTPException(500, { message: "Failed to update role." });
      }

      return ok(c, response);
    },
  )
  .delete(
    "/:id",
    zv("param", z.object({ id: z.string() })),
    async (c) => {
      const session = c.get("session");
      const { id: roleId } = c.req.valid("param");
      const organizationId = session.activeOrganizationId;

      if (!organizationId) {
        throw new HTTPException(400, { message: "No active organization selected." });
      }

      const hasPermission = await getAuth(c.env.R2).api.hasPermission({
        headers: c.req.raw.headers,
        body: { permissions: { role: ["delete"] } },
      });

      if (!hasPermission.success) {
        throw new HTTPException(403, { message: "You do not have permission to delete roles." });
      }

      const response = await getAuth(c.env.R2).api.deleteOrgRole({
        body: { roleId, organizationId },
        headers: c.req.raw.headers,
      });

      if (!response) {
        throw new HTTPException(500, { message: "Failed to delete role." });
      }

      return ok(c, response);
    },
  );
