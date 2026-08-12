/**
 * Leituras puras — sem nenhuma noção de cache.
 *
 * Quem envolve isso em `use cache`/`cacheTag` é a camada `lib/data.ts` da
 * landing; assim o pacote continua utilizável pelo futuro app de pedidos, que
 * pode ter outra estratégia de cache.
 */

import { asc, eq, sql as sqlRaw } from "drizzle-orm";

import { db } from "./client";
import {
  adminUsers,
  dishCategories,
  dishes,
  openingHours,
  siteSettings,
  type AdminUser,
  type DishCategory,
  type DishWithCategory,
  type OpeningHour,
  type SiteSettings,
} from "./schema";

export const SETTINGS_ID = 1;

export async function getSiteSettings(): Promise<SiteSettings> {
  const [settings] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SETTINGS_ID))
    .limit(1);

  if (!settings) {
    throw new Error(
      "site_settings está vazia. Rode `pnpm --filter @brasamar/db db:seed` para popular o banco.",
    );
  }

  return settings;
}

/**
 * Pratos com a categoria embutida.
 *
 * O join sai daqui e não de quem chama porque o selo colorido do card precisa
 * do nome e da cor — sem isso, cada componente faria uma consulta extra.
 */
async function selectDishes(apenasVisiveis: boolean) {
  const query = db
    .select({ dish: dishes, category: dishCategories })
    .from(dishes)
    .innerJoin(dishCategories, eq(dishes.categoryId, dishCategories.id));

  const linhas = await (apenasVisiveis
    ? query.where(eq(dishes.visible, true))
    : query
  ).orderBy(asc(dishes.position), asc(dishes.name));

  return linhas.map(({ dish, category }) => ({ ...dish, category }));
}

/** Só os pratos visíveis, na ordem definida no admin — o que a landing usa. */
export async function getVisibleDishes(): Promise<DishWithCategory[]> {
  return selectDishes(true);
}

/** Todos os pratos, inclusive os escondidos — o que o admin usa. */
export async function getAllDishes(): Promise<DishWithCategory[]> {
  return selectDishes(false);
}

/** Categorias na ordem em que aparecem no admin. */
export async function getDishCategories(): Promise<DishCategory[]> {
  return db
    .select()
    .from(dishCategories)
    .orderBy(asc(dishCategories.position), asc(dishCategories.name));
}

/** Quantos pratos usam cada categoria — a lista do admin mostra, e a remoção depende. */
export async function countDishesByCategory(): Promise<Record<string, number>> {
  const linhas = await db
    .select({
      categoryId: dishes.categoryId,
      total: sqlRaw<number>`count(*)::int`,
    })
    .from(dishes)
    .groupBy(dishes.categoryId);

  return Object.fromEntries(linhas.map((l) => [l.categoryId, l.total]));
}

export async function getDishBySlug(
  slug: string,
): Promise<DishWithCategory | undefined> {
  const [linha] = await db
    .select({ dish: dishes, category: dishCategories })
    .from(dishes)
    .innerJoin(dishCategories, eq(dishes.categoryId, dishCategories.id))
    .where(eq(dishes.slug, slug))
    .limit(1);

  return linha ? { ...linha.dish, category: linha.category } : undefined;
}

/** Ordenado de segunda a domingo, como o layout apresenta. */
export async function getOpeningHours(): Promise<OpeningHour[]> {
  const rows = await db
    .select()
    .from(openingHours)
    .orderBy(asc(openingHours.weekday));

  const sunday = rows.filter((row) => row.weekday === 0);
  const monToSat = rows.filter((row) => row.weekday !== 0);

  return [...monToSat, ...sunday];
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return db.select().from(adminUsers).orderBy(asc(adminUsers.createdAt));
}

export async function getAdminUser(id: string): Promise<AdminUser | undefined> {
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, id))
    .limit(1);

  return user;
}
