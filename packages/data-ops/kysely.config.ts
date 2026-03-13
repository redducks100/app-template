import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { defineConfig } from "kysely-ctl";
import { NeonDialect } from "kysely-neon";

// Load .dev.vars for local development; in CI, DATABASE_URL is already set via env
config({ path: "../../apps/api/.dev.vars" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  dialect: new NeonDialect({
    neon: neon(process.env.DATABASE_URL),
  }),
  migrations: {
    migrationFolder: "src/db/migrations",
  },
});
