import { config } from "dotenv";
import { defineConfig } from "kysely-ctl";
import { NeonDialect } from "kysely-neon";
import { neon } from "@neondatabase/serverless";

config({ path: ".dev.vars" });

export default defineConfig({
  dialect: new NeonDialect({
    neon: neon(process.env.DATABASE_URL!),
  }),
  migrations: {
    migrationFolder: "src/db/migrations",
  },
});
