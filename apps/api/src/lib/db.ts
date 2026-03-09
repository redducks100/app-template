import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import { neon } from "@neondatabase/serverless";
import type { Database } from "../db/types.js";

let _db: Kysely<Database>;

function createDb() {
  return new Kysely<Database>({
    dialect: new NeonDialect({
      neon: neon(process.env.DATABASE_URL!),
    }),
  });
}

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}
