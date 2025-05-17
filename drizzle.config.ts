import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/*.ts",
  out: "./drizzle/generated",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
