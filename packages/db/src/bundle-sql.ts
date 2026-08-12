/**
 * Gera um arquivo SQL único, pronto para colar no SQL Editor do Supabase.
 *
 * Existe porque nem todo ambiente consegue conectar no banco de produção pela
 * linha de comando — a connection string *Direct* do Supabase resolve só para
 * IPv6, e o WSL não tem IPv6. Sem isso, `db:migrate` e `db:seed` ficam
 * inutilizáveis e não haveria como preparar o banco.
 *
 * O arquivo traz, nesta ordem:
 *   1. as migrations ainda não registradas, na ordem do journal;
 *   2. o registro delas em `drizzle.__drizzle_migrations`, com o mesmo hash que
 *      o drizzle-kit gravaria — sem isso um `db:migrate` futuro tentaria
 *      aplicar tudo de novo;
 *   3. o conteúdo inicial (o mesmo do `db:seed`).
 *
 * Rodar com: pnpm --filter @brasamar/db db:bundle
 * Não precisa de banco: lê só os arquivos do repositório.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { categorias, horarios, pratos, settings } from "./seed-data";

const RAIZ = join(import.meta.dirname, "..");
const MIGRATIONS = join(RAIZ, "migrations");
const SAIDA = join(RAIZ, "producao.sql");

interface EntradaJournal {
  idx: number;
  when: number;
  tag: string;
}

/** Escapa um valor para literal SQL. */
function lit(valor: unknown): string {
  if (valor === null || valor === undefined) return "null";
  if (typeof valor === "number") return String(valor);
  if (typeof valor === "boolean") return valor ? "true" : "false";
  if (typeof valor === "object") {
    return `'${JSON.stringify(valor).replaceAll("'", "''")}'::jsonb`;
  }
  return `'${String(valor).replaceAll("'", "''")}'`;
}

function colunaSql(chave: string): string {
  return chave.replace(/[A-Z]/g, (letra) => `_${letra.toLowerCase()}`);
}

function insert(tabela: string, linha: Record<string, unknown>): string {
  const colunas = Object.keys(linha).map(colunaSql).join(", ");
  const valores = Object.values(linha).map(lit).join(", ");
  return `insert into ${tabela} (${colunas}) values (${valores});`;
}

function migrations(): string[] {
  const journal = JSON.parse(
    readFileSync(join(MIGRATIONS, "meta", "_journal.json"), "utf8"),
  ) as { entries: EntradaJournal[] };

  const partes: string[] = [];

  for (const entrada of journal.entries) {
    const arquivo = join(MIGRATIONS, `${entrada.tag}.sql`);
    const conteudo = readFileSync(arquivo, "utf8");
    const hash = createHash("sha256").update(conteudo).digest("hex");

    // Cada migration é envolvida numa checagem do próprio hash: rodar o
    // arquivo de novo depois de acrescentar uma migration aplica só a nova.
    // A marca de dólar é personalizada porque as migrations já usam `$$`.
    partes.push(
      `-- ${"═".repeat(68)}`,
      `-- Migration ${entrada.tag}`,
      `-- ${"═".repeat(68)}`,
      "do $brasamar$",
      "begin",
      `  if exists (select 1 from drizzle.__drizzle_migrations where hash = ${lit(hash)}) then`,
      `    raise notice 'migration ${entrada.tag} já aplicada, pulando';`,
      "  else",
      "",
      // Os marcadores servem ao drizzle-kit, não ao Postgres.
      conteudo.replaceAll("--> statement-breakpoint", ""),
      "",
      `    insert into drizzle.__drizzle_migrations (hash, created_at) values (${lit(hash)}, ${entrada.when});`,
      "  end if;",
      "end",
      "$brasamar$;",
      "",
    );
  }

  return partes;
}

/**
 * Conteúdo inicial, com as mesmas garantias do `db:seed`:
 *
 * - tudo é idempotente, então rodar o arquivo duas vezes não duplica nada;
 * - as categorias só são criadas se a tabela estiver vazia. A migration 0003 já
 *   insere as três originais ao converter o enum em tabela, e recriá-las aqui
 *   geraria duplicatas — e o `select` que liga o prato à categoria passaria a
 *   devolver mais de uma linha.
 */
function seed(): string[] {
  const partes: string[] = [
    `-- ${"═".repeat(68)}`,
    "-- Conteúdo inicial (equivalente ao db:seed)",
    `-- ${"═".repeat(68)}`,
    "",
    `${insert("site_settings", settings).slice(0, -1)}\n  on conflict (id) do nothing;`,
    "",
  ];

  for (const dia of horarios) {
    partes.push(
      `${insert("opening_hours", dia).slice(0, -1)} on conflict (weekday) do nothing;`,
    );
  }
  partes.push("");

  const linhas = categorias
    .map((c) => `(${lit(c.name)}, ${lit(c.color)}, ${c.position})`)
    .join(",\n         ");

  partes.push(
    "-- só quando ainda não há nenhuma: depois disso as categorias são do dono",
    "insert into dish_categories (name, color, position)",
    `  select * from (values ${linhas}) as v(name, color, position)`,
    "  where not exists (select 1 from dish_categories);",
    "",
  );

  for (const { categoria, ...prato } of pratos) {
    const colunas = [...Object.keys(prato).map(colunaSql), "category_id"];
    const valores = [
      ...Object.values(prato).map(lit),
      `(select id from dish_categories where name = ${lit(categoria)} limit 1)`,
    ];
    partes.push(
      `insert into dishes (${colunas.join(", ")})`,
      `  values (${valores.join(", ")})`,
      "  on conflict (slug) do nothing;",
    );
  }

  return partes;
}

const conteudo = [
  "-- Brasa & Mar — preparação do banco de produção",
  "--",
  "-- Cole tudo no SQL Editor do Supabase e execute de uma vez.",
  "-- Gerado por `pnpm --filter @brasamar/db db:bundle` — não edite à mão.",
  "--",
  "-- Roda dentro de uma transação: qualquer erro desfaz tudo, e dá para",
  "-- corrigir e rodar de novo sem sobrar meia configuração.",
  "",
  "begin;",
  "",
  "create schema if not exists drizzle;",
  "create table if not exists drizzle.__drizzle_migrations (",
  "  id serial primary key,",
  "  hash text not null,",
  "  created_at bigint",
  ");",
  "",
  ...migrations(),
  ...seed(),
  "",
  "commit;",
  "",
].join("\n");

writeFileSync(SAIDA, conteudo);

const linhas = conteudo.split("\n").length;
console.warn(`✔ producao.sql gerado (${linhas} linhas)`);
console.warn("  Cole em Supabase → SQL Editor → New query e clique em Run.");
