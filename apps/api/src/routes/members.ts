import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type { MemberPermissions } from "@app/shared/schemas/member";

import { countMembers, findMemberById, findMembersPaginated } from "@app/data-ops/queries/members";
import { SearchPaginationParams } from "@app/shared/types/result";

import { getAuth } from "../lib/auth";
import { ok, okPaginated } from "../lib/result";
import { zv } from "../lib/validation";
import { authMiddleware } from "../middleware/auth";

export const memberRoutes = new Hono()
  .use(authMiddleware)
  .get("/", zv("query", SearchPaginationParams), async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, { message: "No active organization selected." });
    }

    const { page, pageSize, search } = c.req.valid("query");
    const { members, total } = await findMembersPaginated({
      organizationId,
      page,
      pageSize,
      search,
    });

    return okPaginated(c, {
      data: members,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  })
  .get("/count", async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, { message: "No active organization selected." });
    }

    const count = await countMembers(organizationId);
    return ok(c, { count });
  })
  .get("/permissions", async (c) => {
    const headers = c.req.raw.headers;

    const [canUpdate, canDelete] = await Promise.all([
      getAuth(c.env.R2)
        .api.hasPermission({
          headers,
          body: { permissions: { member: ["update"] } },
        })
        .then((r) => r.success),
      getAuth(c.env.R2)
        .api.hasPermission({
          headers,
          body: { permissions: { member: ["delete"] } },
        })
        .then((r) => r.success),
    ]);

    return ok(c, { canUpdate, canDelete } satisfies MemberPermissions);
  })
  .get("/:id", zv("param", z.object({ id: z.string() })), async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, { message: "No active organization selected." });
    }

    const { id } = c.req.valid("param");
    const member = await findMemberById(id, organizationId);

    if (!member) {
      throw new HTTPException(404, { message: "Member not found." });
    }

    return ok(c, member);
  })
  .patch(
    "/:id/role",
    zv("param", z.object({ id: z.string() })),
    zv("json", z.object({ role: z.string() })),
    async (c) => {
      const session = c.get("session");
      const { id: memberId } = c.req.valid("param");
      const { role } = c.req.valid("json");
      const organizationId = session.activeOrganizationId;

      if (!organizationId) {
        throw new HTTPException(400, { message: "No active organization selected." });
      }

      const response = await getAuth(c.env.R2).api.updateMemberRole({
        body: {
          memberId,
          role,
          organizationId,
        },
        headers: c.req.raw.headers,
      });

      if (!response) {
        throw new HTTPException(500, { message: "Failed to update member role." });
      }

      return ok(c, response);
    },
  )
  .delete("/:id", zv("param", z.object({ id: z.string() })), async (c) => {
    const session = c.get("session");
    const { id: memberIdOrEmail } = c.req.valid("param");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, { message: "No active organization selected." });
    }

    const response = await getAuth(c.env.R2).api.removeMember({
      body: {
        memberIdOrEmail,
        organizationId,
      },
      headers: c.req.raw.headers,
    });

    if (!response) {
      throw new HTTPException(500, { message: "Failed to remove member." });
    }

    return ok(c, response);
  });
