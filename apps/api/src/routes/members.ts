import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { getAuth } from "../lib/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { ok } from "../lib/result.js";
import { zv } from "../lib/validation.js";

export const memberRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, { message: "No active organization selected." });
    }

    const response = await getAuth(c.env.R2).api.listMembers({
      query: { organizationId },
      headers: c.req.raw.headers,
    });

    return ok(c, response);
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

    return ok(c, { canUpdate, canDelete });
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
  .delete(
    "/:id",
    zv("param", z.object({ id: z.string() })),
    async (c) => {
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
    },
  );
