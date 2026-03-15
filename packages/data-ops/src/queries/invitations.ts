import { sql } from "kysely";

import type { InvitationDetail, InvitationListItem } from "@app/shared/schemas/invitation";

import { getDb } from "../db";

interface FindInvitationsPaginatedParams {
  organizationId: string;
  page: number;
  pageSize: number;
  search: string;
}

export async function findInvitationsPaginated({
  organizationId,
  page,
  pageSize,
  search,
}: FindInvitationsPaginatedParams): Promise<{ invitations: InvitationListItem[]; total: number }> {
  const offset = (page - 1) * pageSize;

  let baseQuery = getDb()
    .selectFrom("invitation")
    .where("invitation.organizationId", "=", organizationId);

  if (search) {
    const pattern = `%${search}%`;
    baseQuery = baseQuery.where((eb) =>
      eb.or([
        eb("invitation.email", "ilike", pattern),
        eb("invitation.role", "ilike", pattern),
        eb("invitation.status", "ilike", pattern),
      ]),
    );
  }

  const [rows, countResult] = await Promise.all([
    baseQuery
      .select([
        "invitation.id",
        "invitation.email",
        "invitation.role",
        "invitation.status",
        "invitation.expiresAt",
      ])
      .orderBy("invitation.createdAt", "desc")
      .limit(pageSize)
      .offset(offset)
      .execute(),
    baseQuery.select(sql<number>`count(*)::int`.as("count")).executeTakeFirstOrThrow(),
  ]);

  const invitations: InvitationListItem[] = rows.map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    expiresAt: row.expiresAt,
  }));

  return { invitations, total: countResult.count };
}

export async function countPendingInvitations(organizationId: string): Promise<number> {
  const result = await getDb()
    .selectFrom("invitation")
    .where("invitation.organizationId", "=", organizationId)
    .where("invitation.status", "=", "pending")
    .select(sql<number>`count(*)::int`.as("count"))
    .executeTakeFirstOrThrow();

  return result.count;
}

export async function findInvitationDetails(id: string): Promise<InvitationDetail | null> {
  const result = await getDb()
    .selectFrom("invitation")
    .innerJoin("user", "user.id", "invitation.inviterId")
    .innerJoin("organization", "organization.id", "invitation.organizationId")
    .select([
      "invitation.id",
      "invitation.organizationId",
      "invitation.email",
      "invitation.role",
      "invitation.status",
      "invitation.expiresAt",
      "invitation.inviterId",
      "invitation.createdAt",
      "user.name as inviterName",
      "user.email as inviterEmail",
      "user.image as inviterImage",
      "organization.name as organizationName",
      "organization.slug as organizationSlug",
      "organization.logo as organizationLogo",
    ])
    .where("invitation.id", "=", id)
    .executeTakeFirst();

  if (!result) return null;

  return {
    id: result.id,
    organizationId: result.organizationId,
    email: result.email,
    role: result.role,
    status: result.status,
    expiresAt: result.expiresAt,
    inviterId: result.inviterId,
    createdAt: result.createdAt,
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
  };
}
