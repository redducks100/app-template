import { getDb } from "../db";

export async function updateUserLocale(userId: string, locale: string) {
  await getDb().updateTable("user").set({ locale }).where("id", "=", userId).execute();
}

export async function hasPasswordCredential(userId: string): Promise<boolean> {
  const accounts = await getDb()
    .selectFrom("account")
    .selectAll()
    .where("userId", "=", userId)
    .where("providerId", "=", "credential")
    .execute();

  return accounts != null && accounts.length > 0;
}

export async function updateUserAvatar(userId: string, imageUrl: string) {
  await getDb().updateTable("user").set({ image: imageUrl }).where("id", "=", userId).execute();
}

export async function deleteUserAvatar(userId: string) {
  await getDb().updateTable("user").set({ image: null }).where("id", "=", userId).execute();
}

export async function getUserLastOrganizationId(userId: string) {
  const row = await getDb()
    .selectFrom("user")
    .select("lastOrganizationId")
    .where("id", "=", userId)
    .executeTakeFirst();
  return row?.lastOrganizationId ?? null;
}

export async function getFirstMembership(userId: string) {
  const row = await getDb()
    .selectFrom("member")
    .select("organizationId")
    .where("userId", "=", userId)
    .orderBy("createdAt", "asc")
    .limit(1)
    .executeTakeFirst();
  return row?.organizationId ?? null;
}

export async function updateUserLastOrganizationId(userId: string, organizationId: string | null) {
  await getDb()
    .updateTable("user")
    .set({ lastOrganizationId: organizationId })
    .where("id", "=", userId)
    .execute();
}
