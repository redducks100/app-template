import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { getAuth } from "../lib/auth.js";
import { getDb } from "../lib/db.js";
import { authMiddleware } from "../middleware/auth.js";
import { ok } from "../lib/result.js";
import { zv } from "../lib/validation.js";
import { createInvitationSchema } from "@app/shared/schemas/create-invitation-schema";

export const invitationRoutes = new Hono()
  .get(
    "/:id",
    zv("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const result = await getDb()
        .selectFrom("invitation")
        .innerJoin("user", "user.id", "invitation.inviterId")
        .innerJoin(
          "organization",
          "organization.id",
          "invitation.organizationId",
        )
        .select([
          "invitation.id",
          "invitation.organizationId",
          "invitation.email",
          "invitation.role",
          "invitation.status",
          "invitation.expiresAt",
          "invitation.inviterId",
          "user.name as inviterName",
          "user.email as inviterEmail",
          "user.image as inviterImage",
          "organization.name as organizationName",
          "organization.slug as organizationSlug",
          "organization.logo as organizationLogo",
        ])
        .where("invitation.id", "=", id)
        .executeTakeFirst();

      if (!result) {
        throw new HTTPException(404, { message: "Invitation not found" });
      }

      return ok(c, {
        ...result,
        inviter: {
          id: result.inviterId,
          name: result.inviterName,
          email: result.inviterEmail,
          image: result.inviterImage,
        },
        organization: {
          id: result.organizationId,
          name: result.organizationName,
          slug: result.organizationSlug,
          logo: result.organizationLogo,
        },
      });
    },
  )
  .use(authMiddleware)
  .get("/", async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, { message: "No active organization selected." });
    }

    const response = await getAuth(c.env.R2).api.listInvitations({
      query: { organizationId },
      headers: c.req.raw.headers,
    });

    return ok(c, response);
  })
  .post("/", zv("json", createInvitationSchema), async (c) => {
    const session = c.get("session");
    const input = c.req.valid("json");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, { message: "No active organization selected." });
    }

    const response = await getAuth(c.env.R2).api.createInvitation({
      body: {
        email: input.email,
        role: input.role as "admin" | "member" | "owner",
        organizationId,
      },
      headers: c.req.raw.headers,
    });

    if (!response) {
      throw new HTTPException(500, {
        message: "Something went wrong while creating the invitation.",
      });
    }

    return ok(c, response, 201);
  })
  .delete(
    "/:id",
    zv("param", z.object({ id: z.string() })),
    async (c) => {
      const { id: invitationId } = c.req.valid("param");

      const response = await getAuth(c.env.R2).api.cancelInvitation({
        body: { invitationId },
        headers: c.req.raw.headers,
      });

      if (!response) {
        throw new HTTPException(500, {
          message: "Something went wrong while canceling the invitation.",
        });
      }

      return ok(c, response);
    },
  );
