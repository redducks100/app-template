import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getAuth } from "../lib/auth.js";
import { getDb } from "../lib/db.js";
import { authMiddleware } from "../middleware/auth.js";
import { createInvitationSchema } from "@app/shared/schemas/create-invitation-schema";
import { z } from "zod";

export const invitationRoutes = new Hono()
  .get(
    "/get/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const result = await getDb()
        .selectFrom("invitation")
        .innerJoin("user", "user.id", "invitation.inviterId")
        .innerJoin(
          "organization",
          "organization.id",
          "invitation.organizationId"
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
        return c.json({ error: "Invitation not found" }, 404);
      }

      return c.json(
        {
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
        },
        200
      );
    }
  )
  .use(authMiddleware)
  .get("/list", async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      return c.json(
        { error: "No active organization selected." },
        400
      );
    }

    const response = await getAuth().api.listInvitations({
      query: { organizationId },
      headers: c.req.raw.headers,
    });

    return c.json(response, 200);
  })
  .post(
    "/create",
    zValidator("json", createInvitationSchema),
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

      const response = await getAuth().api.createInvitation({
        body: {
          email: input.email,
          role: input.role as "admin" | "member" | "owner",
          organizationId,
        },
        headers: c.req.raw.headers,
      });

      if (!response) {
        return c.json(
          {
            error:
              "Something went wrong while creating the invitation.",
          },
          500
        );
      }

      return c.json(response, 201);
    }
  )
  .post(
    "/cancel",
    zValidator("json", z.object({ invitationId: z.string() })),
    async (c) => {
      const { invitationId } = c.req.valid("json");

      const response = await getAuth().api.cancelInvitation({
        body: { invitationId },
        headers: c.req.raw.headers,
      });

      if (!response) {
        return c.json(
          {
            error:
              "Something went wrong while canceling the invitation.",
          },
          500
        );
      }

      return c.json(response, 200);
    }
  );
