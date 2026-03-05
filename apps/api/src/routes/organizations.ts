import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getAuth } from "../lib/auth.js";
import { getDb } from "../lib/db.js";
import { authMiddleware } from "../middleware/auth.js";
import { createOrganizationSchema } from "@app/shared/schemas/create-organization-schema";
import { updateOrganizationSchema } from "@app/shared/schemas/update-organization-schema";

export const organizationRoutes = new Hono()
  .use(authMiddleware)
  .get("/list", async (c) => {
    const session = c.get("session");
    const userMembers = await getDb()
      .selectFrom("member")
      .innerJoin("organization", "organization.id", "member.organizationId")
      .selectAll("organization")
      .select("member.role")
      .where("member.userId", "=", session.userId)
      .execute();
    const result = userMembers.map((x) => ({
      id: x.id,
      name: x.name,
      slug: x.slug,
      logo: x.logo,
      createdAt: x.createdAt,
      metadata: x.metadata,
      role: x.role,
    }));
    return c.json(result, 200);
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

      const currentMember = await getDb()
        .selectFrom("member")
        .innerJoin("organization", "organization.id", "member.organizationId")
        .selectAll("member")
        .select([
          "organization.name as orgName",
          "organization.slug as orgSlug",
          "organization.logo as orgLogo",
          "organization.createdAt as orgCreatedAt",
          "organization.metadata as orgMetadata",
        ])
        .where("member.userId", "=", session.userId)
        .where("member.organizationId", "=", organizationId)
        .executeTakeFirst();

      if (!currentMember) {
        return c.json({ error: "Organization not found." }, 404);
      }

      if (slug !== currentMember.orgSlug) {
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

      return c.json(response, 200);
    }
  )
  .get("/active", async (c) => {
    const session = c.get("session");
    const userMember = await getDb()
      .selectFrom("member")
      .innerJoin("organization", "organization.id", "member.organizationId")
      .selectAll("organization")
      .select("member.role")
      .where("member.userId", "=", session.userId)
      .where("member.organizationId", "=", session.activeOrganizationId as string)
      .executeTakeFirst();

    if (!userMember) return c.json(null, 200);

    return c.json({
      id: userMember.id,
      name: userMember.name,
      slug: userMember.slug,
      logo: userMember.logo,
      createdAt: userMember.createdAt,
      metadata: userMember.metadata,
      role: userMember.role,
    }, 200);
  });
