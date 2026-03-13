import type { OrganizationWithRole } from "@app/shared/types/organizations";

import { getDb } from "../db";

export async function findUserOrganizations(userId: string): Promise<OrganizationWithRole[]> {
  const userMembers = await getDb()
    .selectFrom("member")
    .innerJoin("organization", "organization.id", "member.organizationId")
    .selectAll("organization")
    .select("member.role")
    .where("member.userId", "=", userId)
    .execute();

  return userMembers.map((x) => ({
    id: x.id,
    name: x.name,
    slug: x.slug,
    logo: x.logo,
    createdAt: x.createdAt,
    metadata: x.metadata,
    role: x.role,
  }));
}

export async function findUserMembership(userId: string, organizationId: string) {
  return getDb()
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
    .where("member.userId", "=", userId)
    .where("member.organizationId", "=", organizationId)
    .executeTakeFirst();
}

export async function findActiveOrganization(
  userId: string,
  organizationId: string,
): Promise<OrganizationWithRole | null> {
  const userMember = await getDb()
    .selectFrom("member")
    .innerJoin("organization", "organization.id", "member.organizationId")
    .selectAll("organization")
    .select("member.role")
    .where("member.userId", "=", userId)
    .where("member.organizationId", "=", organizationId)
    .executeTakeFirst();

  if (!userMember) return null;

  return {
    id: userMember.id,
    name: userMember.name,
    slug: userMember.slug,
    logo: userMember.logo,
    createdAt: userMember.createdAt,
    metadata: userMember.metadata,
    role: userMember.role,
  };
}
