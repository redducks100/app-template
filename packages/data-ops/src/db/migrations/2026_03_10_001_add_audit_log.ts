import type { Kysely } from "kysely";

import { sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("auditLog")
    .addColumn("id", "text", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("organizationId", "text", (col) =>
      col.notNull().references("organization.id").onDelete("cascade"),
    )
    .addColumn("actorId", "text", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("action", "text", (col) => col.notNull())
    .addColumn("resourceType", "text", (col) => col.notNull())
    .addColumn("resourceId", "text", (col) => col.notNull())
    .addColumn("metadata", "text")
    .addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex("idx_audit_log_org_created")
    .on("auditLog")
    .columns(["organizationId", "createdAt desc"])
    .execute();

  await db.schema
    .createTable("dismissedAuditLog")
    .addColumn("id", "text", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("userId", "text", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("auditLogId", "text", (col) =>
      col.notNull().references("auditLog.id").onDelete("cascade"),
    )
    .addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint("uq_dismissed_user_audit", ["userId", "auditLogId"])
    .execute();

  await db.schema
    .alterTable("member")
    .addColumn("notificationReadAt", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("member").dropColumn("notificationReadAt").execute();
  await db.schema.dropTable("dismissedAuditLog").ifExists().execute();
  await db.schema.dropTable("auditLog").ifExists().execute();
}
