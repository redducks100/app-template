import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { member } from "../db/schema.js";
import { getAuth } from "../lib/auth.js";
import { getDb } from "../lib/db.js";
import { authMiddleware } from "../middleware/auth.js";
import { createOrganizationSchema } from "@app/shared/schemas/create-organization-schema";
import { updateOrganizationSchema } from "@app/shared/schemas/update-organization-schema";

export const organizationRoutes = new Hono()
  .use(authMiddleware)
  .get("/list", async (c) => {
    const session = c.get("session");
    const userMembers = await getDb().query.member.findMany({
      where: eq(member.userId, session.userId),
      with: { organization: true },
    });
    const result = userMembers.map((x) => ({
      ...x.organization,
      role: x.role,
    }));
    return c.json(result);
  })
  .post(
    "/create",
    zValidator("json", createOrganizationSchema),
    async (c) => {
      const { name, slug } = c.req.valid("json");
      const session = c.get("session");
      const user = c.get("user");

      try {
        await getAuth().api.checkOrganizationSlug({ body: { slug } });
      } catch {
        return c.json(
          { error: "Organization slug is already taken." },
          400
        );
      }

      const response = await getAuth().api.createOrganization({
        body: { name, slug, userId: user.id },
      });

      if (!response) {
        return c.json(
          {
            error:
              "Something went wrong while creating an organization",
          },
          500
        );
      }

      return c.json(response, 201);
    }
  )
  .post(
    "/update",
    zValidator("json", updateOrganizationSchema),
    async (c) => {
      const { name, slug, organizationId } = c.req.valid("json");
      const session = c.get("session");

      const currentMember = await getDb().query.member.findFirst({
        where: and(
          eq(member.userId, session.userId),
          eq(member.organizationId, organizationId)
        ),
        with: { organization: true },
      });

      if (!currentMember) {
        return c.json({ error: "Organization not found." }, 404);
      }

      if (slug !== currentMember.organization.slug) {
        try {
          await getAuth().api.checkOrganizationSlug({ body: { slug } });
        } catch {
          return c.json(
            { error: "Organization slug is already taken." },
            400
          );
        }
      }

      const response = await getAuth().api.updateOrganization({
        body: { data: { name, slug }, organizationId },
        headers: c.req.raw.headers,
      });

      if (!response) {
        return c.json(
          {
            error:
              "Something went wrong while updating the organization.",
          },
          500
        );
      }

      return c.json(response);
    }
  )
  .get("/active", async (c) => {
    const session = c.get("session");
    const userMember = await getDb().query.member.findFirst({
      where: and(
        eq(member.userId, session.userId),
        eq(
          member.organizationId,
          session.activeOrganizationId as string
        )
      ),
      with: { organization: true },
    });

    if (!userMember) return c.json(null);

    return c.json({ ...userMember.organization, role: userMember.role });
  });
