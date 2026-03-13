import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type {
  OrganizationPermissions,
  OrganizationWithRole,
} from "@app/shared/types/organizations";

import { createOrganizationSchema } from "@app/shared/schemas/create-organization-schema";
import { updateOrganizationSchema } from "@app/shared/schemas/update-organization-schema";

import {
  findActiveOrganization,
  findUserMembership,
  findUserOrganizations,
} from "@app/data-ops/queries/organizations";

import { getAuth } from "../lib/auth";
import { ok } from "../lib/result";
import { zv } from "../lib/validation";
import { authMiddleware } from "../middleware/auth";

export const organizationRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const session = c.get("session");
    const result = await findUserOrganizations(session.userId);
    return ok(c, result satisfies OrganizationWithRole[]);
  })
  .get("/permissions", async (c) => {
    const headers = c.req.raw.headers;

    const [canUpdate, canDelete] = await Promise.all([
      getAuth(c.env.R2)
        .api.hasPermission({
          headers,
          body: { permissions: { organization: ["update"] } },
        })
        .then((r) => r.success),
      getAuth(c.env.R2)
        .api.hasPermission({
          headers,
          body: { permissions: { organization: ["delete"] } },
        })
        .then((r) => r.success),
    ]);

    return ok(c, { canUpdate, canDelete } satisfies OrganizationPermissions);
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

      const currentMember = await findUserMembership(session.userId, organizationId);

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
    const data = await findActiveOrganization(
      session.userId,
      session.activeOrganizationId as string,
    );
    return ok(c, data satisfies OrganizationWithRole | null);
  });
