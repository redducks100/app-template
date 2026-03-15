import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type { InvitationDetail, InvitationPermissions } from "@app/shared/schemas/invitation";

import {
  countPendingInvitations,
  findInvitationDetails,
  findInvitationsPaginated,
} from "@app/data-ops/queries/invitations";
import { createInvitationSchema } from "@app/shared/schemas/create-invitation-schema";
import { SearchPaginationParams } from "@app/shared/types/result";

import { getAuth } from "../lib/auth";
import { ok, okPaginated } from "../lib/result";
import { zv } from "../lib/validation";
import { authMiddleware } from "../middleware/auth";

// Public routes (no auth required)
const publicInvitationRoutes = new Hono().get(
  "/:id",
  zv("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param");
    const result = await findInvitationDetails(id);

    if (!result) {
      throw new HTTPException(404, { message: "Invitation not found" });
    }

    return ok(c, result satisfies InvitationDetail);
  },
);

// Authenticated routes
const authedInvitationRoutes = new Hono()
  .use(authMiddleware)
  .get("/count", async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, { message: "No active organization selected." });
    }

    const count = await countPendingInvitations(organizationId);
    return ok(c, { count });
  })
  .get("/", zv("query", SearchPaginationParams), async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, {
        message: "No active organization selected.",
      });
    }

    const { page, pageSize, search } = c.req.valid("query");
    const { invitations, total } = await findInvitationsPaginated({
      organizationId,
      page,
      pageSize,
      search,
    });

    return okPaginated(c, {
      data: invitations,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  })
  .get("/permissions", async (c) => {
    const headers = c.req.raw.headers;

    const [canCreate, canCancel] = await Promise.all([
      getAuth(c.env.R2)
        .api.hasPermission({
          headers,
          body: { permissions: { invitation: ["create"] } },
        })
        .then((r) => r.success),
      getAuth(c.env.R2)
        .api.hasPermission({
          headers,
          body: { permissions: { invitation: ["cancel"] } },
        })
        .then((r) => r.success),
    ]);

    return ok(c, { canCreate, canCancel } satisfies InvitationPermissions);
  })
  .post("/", zv("json", createInvitationSchema), async (c) => {
    const session = c.get("session");
    const input = c.req.valid("json");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      throw new HTTPException(400, {
        message: "No active organization selected.",
      });
    }

    const response = await getAuth(c.env.R2).api.createInvitation({
      body: {
        email: input.email,
        role: input.role as "member" | "owner" | "admin", // BA types don't reflect dynamicAccessControl custom roles
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
  .delete("/:id", zv("param", z.object({ id: z.string() })), async (c) => {
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
  });

// Compose: authed first so static paths win, then public /:id as fallback
export const invitationRoutes = new Hono()
  .route("/", authedInvitationRoutes)
  .route("/", publicInvitationRoutes);
