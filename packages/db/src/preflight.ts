/**
 * Confere a conexão antes de migrar ou semear.
 *
 * O drizzle-kit engole o erro do driver e falha só com "exit code 1", o que
 * esconde as três causas usuais: banco local desligado, projeto do Supabase
 * pausado e connection string errada. Este passo roda antes e diz qual é.
 */

import postgres from "postgres";

function alvo(url: string): string {
  try {
    const { hostname, port } = new URL(url);
    return `${hostname}:${port || "5432"}`;
  } catch {
    return "(connection string ilegível)";
  }
}

function encerrar(mensagem: string): never {
  console.error(`\n✖ ${mensagem}\n`);
  process.exit(1);
}

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;

  if (!url) {
    encerrar(
      "DATABASE_URL não definida.\n" +
        "  Local:     copie packages/db/.env.example para packages/db/.env\n" +
        "  Produção:  DATABASE_URL=\"postgresql://...\" pnpm --filter @brasamar/db db:migrate",
    );
  }

  const onde = alvo(url);
  const local = /^(localhost|127\.0\.0\.1|\[::1\])/.test(onde);
  const sql = postgres(url, {
    connect_timeout: 10,
    max: 1,
    ...(local || url.includes("sslmode=") ? {} : { ssl: "require" as const }),
  });

  try {
    await sql`select 1`;
    console.warn(`✔ Conectado em ${onde}`);
  } catch (falha) {
    const erro = falha as { code?: string; message?: string };

    const dica =
      erro.code === "ECONNREFUSED" && local
        ? "O banco local não está no ar. Rode `npx supabase start` e tente de novo."
        : erro.code === "ECONNREFUSED" || erro.code === "ETIMEDOUT"
          ? "Sem resposta do servidor. Se for o Supabase, confira se o projeto não está pausado e se a connection string é a Direct (porta 5432)."
          : erro.code === "ENOTFOUND"
            ? "Host não encontrado — confira o endereço na connection string."
            : erro.message?.includes("password")
              ? "Senha recusada. É a senha do banco definida na criação do projeto, não a da sua conta Supabase."
              : (erro.message ?? "Erro desconhecido.");

    encerrar(`Não foi possível conectar em ${onde}.\n  ${dica}`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((falha: unknown) => {
  console.error(falha);
  process.exit(1);
});
