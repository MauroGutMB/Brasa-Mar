/**
 * Leituras puras — sem nenhuma noção de cache.
 *
 * Quem envolve isso em `use cache`/`cacheTag` é a camada `lib/data.ts` da
 * landing; assim o pacote continua utilizável pelo futuro app de pedidos, que
 * pode ter outra estratégia de cache.
 */

import { asc, eq } from "drizzle-orm";

import { db } from "./client";
import {
  adminUsers,
  dishes,
  openingHours,
  siteSettings,
  type AdminUser,
  type Dish,
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

/** Só os pratos visíveis, na ordem definida no admin — o que a landing usa. */
export async function getVisibleDishes(): Promise<Dish[]> {
  return db
    .select()
    .from(dishes)
    .where(eq(dishes.visible, true))
    .orderBy(asc(dishes.position), asc(dishes.name));
}

/** Todos os pratos, inclusive os escondidos — o que o admin usa. */
export async function getAllDishes(): Promise<Dish[]> {
  return db
    .select()
    .from(dishes)
    .orderBy(asc(dishes.position), asc(dishes.name));
}

export async function getDishBySlug(slug: string): Promise<Dish | undefined> {
  const [dish] = await db
    .select()
    .from(dishes)
    .where(eq(dishes.slug, slug))
    .limit(1);

  return dish;
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
