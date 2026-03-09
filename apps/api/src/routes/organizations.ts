import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { getAuth } from "../lib/auth.js";
import { getDb } from "../lib/db.js";
import { authMiddleware } from "../middleware/auth.js";
import { ok } from "../lib/result.js";
import { zv } from "../lib/validation.js";
import { createOrganizationSchema } from "@app/shared/schemas/create-organization-schema";
import { updateOrganizationSchema } from "@app/shared/schemas/update-organization-schema";

export const organizationRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
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
    return ok(c, result);
  })
  .post("/", zv("json", createOrganizationSchema), async (c) => {
    const { name, slug } = c.req.valid("json");
    const user = c.get("user");

    try {
      await getAuth(c.env.R2).api.checkOrganizationSlug({ body: { slug } });
    } catch {
      throw new HTTPException(400, { message: "Organization slug is already taken." });
    }

    const response = await getAuth(c.env.R2).api.createOrganization({
      body: { name, slug, userId: user.id },
    });

    if (!response) {
      throw new HTTPException(500, {
        message: "Something went wrong while creating an organization",
      });
    }

    return ok(c, response, 201);
  })
  .patch(
    "/:id",
    zv("param", z.object({ id: z.string() })),
    zv("json", updateOrganizationSchema),
    async (c) => {
      const { id: organizationId } = c.req.valid("param");
      const { name, slug } = c.req.valid("json");
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
        throw new HTTPException(404, { message: "Organization not found." });
      }

      if (slug !== currentMember.orgSlug) {
        try {
          await getAuth(c.env.R2).api.checkOrganizationSlug({
            body: { slug },
          });
        } catch {
          throw new HTTPException(400, { message: "Organization slug is already taken." });
        }
      }

      const response = await getAuth(c.env.R2).api.updateOrganization({
        body: { data: { name, slug }, organizationId },
        headers: c.req.raw.headers,
      });

      if (!response) {
        throw new HTTPException(500, {
          message: "Something went wrong while updating the organization.",
        });
      }

      return ok(c, response);
    },
  )
  .get("/active", async (c) => {
    const session = c.get("session");
    const userMember = await getDb()
      .selectFrom("member")
      .innerJoin("organization", "organization.id", "member.organizationId")
      .selectAll("organization")
      .select("member.role")
      .where("member.userId", "=", session.userId)
      .where(
        "member.organizationId",
        "=",
        session.activeOrganizationId as string,
      )
      .executeTakeFirst();

    const data = userMember
      ? {
          id: userMember.id,
          name: userMember.name,
          slug: userMember.slug,
          logo: userMember.logo,
          createdAt: userMember.createdAt,
          metadata: userMember.metadata,
          role: userMember.role,
        }
      : null;

    return ok(c, data);
  });
