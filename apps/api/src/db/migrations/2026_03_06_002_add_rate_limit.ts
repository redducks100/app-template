import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("rateLimit")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("key", "text", (col) => col.notNull())
    .addColumn("count", "integer", (col) => col.notNull())
    .addColumn("lastRequest", "bigint", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("rateLimit").execute();
}
