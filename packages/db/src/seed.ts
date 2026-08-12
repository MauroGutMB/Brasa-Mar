/**
 * Popula o banco com o conteúdo que hoje está hardcoded na landing.
 *
 * É o que torna a migração verificável: depois do seed, a página tem que ficar
 * idêntica à versão que lia de `apps/landing/lib/site.ts`.
 *
 * Rodar com: pnpm --filter @brasamar/db db:seed
 * É idempotente — pode rodar quantas vezes quiser.
 */

import { db, sql } from "./client";
import { dishCategories, dishes, openingHours, siteSettings } from "./schema";
import { categorias, horarios, pratos, settings } from "./seed-data";

async function seed(): Promise<void> {
  await db
    .insert(siteSettings)
    .values(settings)
    .onConflictDoUpdate({ target: siteSettings.id, set: settings });

  for (const dia of horarios) {
    await db
      .insert(openingHours)
      .values(dia)
      .onConflictDoUpdate({ target: openingHours.weekday, set: dia });
  }

  // As categorias precisam existir antes dos pratos, que apontam para elas.
  //
  // Só são criadas quando a tabela está vazia: a partir da primeira execução
  // elas passam a ser do dono, que pode renomear e recolorir. Recriar pelo
  // nome faria um "Carnes" renomeado virar duplicata a cada seed.
  const existentes = await db.select().from(dishCategories);

  const categoriasNoBanco = existentes.length
    ? existentes
    : await db.insert(dishCategories).values(categorias).returning();

  const idPorNome = new Map(categoriasNoBanco.map((c) => [c.name, c.id]));
  const primeira = categoriasNoBanco[0]?.id;

  if (!primeira) {
    throw new Error("Nenhuma categoria disponível para associar aos pratos.");
  }

  for (const { categoria, ...prato } of pratos) {
    // Categoria renomeada pelo dono: o prato vai para a primeira da lista em
    // vez de o seed falhar.
    const categoryId = idPorNome.get(categoria) ?? primeira;

    // `imageUrl` fica de fora do update: rodar o seed de novo não pode apagar
    // uma foto que já foi enviada pelo admin.
    const { imageUrl: _imageUrl, ...semFoto } = prato;

    await db
      .insert(dishes)
      .values({ ...prato, categoryId })
      .onConflictDoUpdate({
        target: dishes.slug,
        set: { ...semFoto, categoryId },
      });
  }

  console.warn(
    `Seed concluído: 1 configuração, ${horarios.length} horários, ${categorias.length} categorias, ${pratos.length} pratos.`,
  );
}

seed()
  .then(() => sql.end())
  .then(() => process.exit(0))
  .catch((erro: unknown) => {
    console.error("Falha no seed:", erro);
    void sql.end();
    process.exit(1);
  });
