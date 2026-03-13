import { neon } from "@neondatabase/serverless";
import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";

import type { DB } from "@app/shared/types/db.generated";

let _db: Kysely<DB>;

function createDb() {
  return new Kysely<DB>({
    dialect: new NeonDialect({
      neon: neon(process.env.DATABASE_URL!),
    }),
  });
}

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}
