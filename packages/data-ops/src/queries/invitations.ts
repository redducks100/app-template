import type { InvitationDetail } from "@app/shared/types/invitations";

import { getDb } from "../db";

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
