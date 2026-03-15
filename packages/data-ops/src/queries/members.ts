import { sql } from "kysely";

import type { MemberListItem } from "@app/shared/schemas/member";

import { getDb } from "../db";

interface FindMembersPaginatedParams {
  organizationId: string;
  page: number;
  pageSize: number;
  search: string;
}

export async function findMembersPaginated({
  organizationId,
  page,
  pageSize,
  search,
}: FindMembersPaginatedParams): Promise<{ members: MemberListItem[]; total: number }> {
  const offset = (page - 1) * pageSize;

  let baseQuery = getDb()
    .selectFrom("member")
    .innerJoin("user", "user.id", "member.userId")
    .where("member.organizationId", "=", organizationId);

  if (search) {
    const pattern = `%${search}%`;
    baseQuery = baseQuery.where((eb) =>
      eb.or([
        eb("user.name", "ilike", pattern),
        eb("user.email", "ilike", pattern),
        eb("member.role", "ilike", pattern),
      ]),
    );
  }

  const [rows, countResult] = await Promise.all([
    baseQuery
      .select([
        "member.id",
        "member.userId",
        "member.role",
        "member.createdAt",
        "user.name as user_name",
        "user.email as user_email",
        "user.image as user_image",
      ])
      .orderBy("member.createdAt", "desc")
      .limit(pageSize)
      .offset(offset)
      .execute(),
    baseQuery.select(sql<number>`count(*)::int`.as("count")).executeTakeFirstOrThrow(),
  ]);

  const members: MemberListItem[] = rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    role: row.role,
    createdAt: row.createdAt,
    user: {
      name: row.user_name,
      email: row.user_email,
      image: row.user_image,
    },
  }));

  return { members, total: countResult.count };
}

export async function countMembers(organizationId: string): Promise<number> {
  const result = await getDb()
    .selectFrom("member")
    .where("member.organizationId", "=", organizationId)
    .select(sql<number>`count(*)::int`.as("count"))
    .executeTakeFirstOrThrow();

  return result.count;
}

export async function findMemberById(
  memberId: string,
  organizationId: string,
): Promise<MemberListItem | null> {
  const row = await getDb()
    .selectFrom("member")
    .innerJoin("user", "user.id", "member.userId")
    .where("member.id", "=", memberId)
    .where("member.organizationId", "=", organizationId)
    .select([
      "member.id",
      "member.userId",
      "member.role",
      "member.createdAt",
      "user.name as user_name",
      "user.email as user_email",
      "user.image as user_image",
    ])
    .executeTakeFirst();

  if (!row) return null;

  return {
    id: row.id,
    userId: row.userId,
    role: row.role,
    createdAt: row.createdAt,
    user: {
      name: row.user_name,
      email: row.user_email,
      image: row.user_image,
    },
  };
}
