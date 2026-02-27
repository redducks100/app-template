import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getAuth } from "../lib/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { z } from "zod";

export const memberRoutes = new Hono()
  .use(authMiddleware)
  .get("/list", async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      return c.json({ error: "No active organization selected." }, 400);
    }

    const response = await getAuth().api.listMembers({
      query: { organizationId },
      headers: c.req.raw.headers,
    });

    return c.json(response);
  })
  .get("/permissions", async (c) => {
    const headers = c.req.raw.headers;

    const [canUpdate, canDelete] = await Promise.all([
      getAuth()
        .api.hasPermission({
          headers,
          body: { permissions: { member: ["update"] } },
        })
        .then((r) => r.success),
      getAuth()
        .api.hasPermission({
          headers,
          body: { permissions: { member: ["delete"] } },
        })
        .then((r) => r.success),
    ]);

    return c.json({ canUpdate, canDelete });
  })
  .post(
    "/update-role",
    zValidator("json", z.object({ memberId: z.string(), role: z.string() })),
    async (c) => {
      const session = c.get("session");
      const input = c.req.valid("json");
      const organizationId = session.activeOrganizationId;

      if (!organizationId) {
        return c.json({ error: "No active organization selected." }, 400);
      }

      const response = await getAuth().api.updateMemberRole({
        body: {
          memberId: input.memberId,
          role: input.role,
          organizationId,
        },
        headers: c.req.raw.headers,
      });

      if (!response) {
        return c.json({ error: "Failed to update member role." }, 500);
      }

      return c.json(response);
    },
  )
  .post(
    "/remove",
    zValidator("json", z.object({ memberIdOrEmail: z.string() })),
    async (c) => {
      const session = c.get("session");
      const input = c.req.valid("json");
      const organizationId = session.activeOrganizationId;

      if (!organizationId) {
        return c.json({ error: "No active organization selected." }, 400);
      }

      const response = await getAuth().api.removeMember({
        body: {
          memberIdOrEmail: input.memberIdOrEmail,
          organizationId,
        },
        headers: c.req.raw.headers,
      });

      if (!response) {
        return c.json({ error: "Failed to remove member." }, 500);
      }

      return c.json(response);
    },
  );
