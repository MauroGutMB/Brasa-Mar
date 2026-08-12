import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function connectionString(): string {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL não definida. Copie .env.example para .env.local e preencha com a connection string do Supabase.",
    );
  }

  return url;
}

/**
 * O `next dev` recarrega os módulos a cada alteração; sem guardar a conexão
 * num global, cada recarga abriria um pool novo e o Postgres derrubaria por
 * excesso de conexões.
 */
const globalForDb = globalThis as unknown as {
  __brasamarSql?: ReturnType<typeof postgres>;
};

const sql =
  globalForDb.__brasamarSql ??
  postgres(connectionString(), {
    // O pooler do Supabase (porta 6543) não suporta prepared statements.
    prepare: false,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__brasamarSql = sql;
}

export const db = drizzle(sql, { schema });
export { sql };
