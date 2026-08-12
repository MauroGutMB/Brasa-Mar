import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  // O Supabase mantém schemas próprios (auth, storage, realtime…) que não são
  // nossos; sem isso o drizzle-kit tentaria versionar tudo.
  schemaFilter: ["public"],
  verbose: true,
  strict: true,
});
