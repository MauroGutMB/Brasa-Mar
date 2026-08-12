/**
 * Camada de leitura da landing.
 *
 * As queries de `@brasamar/db` são puras; é aqui que elas ganham cache. Cada
 * getter é um escopo `use cache` com uma tag — as Server Actions do admin
 * chamam `updateTag` com a mesma tag e a página se atualiza na hora, sem
 * rebuild e sem consultar o Postgres a cada visita.
 *
 * As tags vivem em `lib/cache-tags.ts` para leitura e escrita não saírem de
 * sincronia.
 */

import {
  getOpeningHours as queryOpeningHours,
  getSiteSettings as querySiteSettings,
  getVisibleDishes as queryVisibleDishes,
  type Dish,
  type OpeningHour,
  type SiteSettings,
} from "@brasamar/db";
import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(CACHE_TAGS.settings);
  // `max` porque a invalidação é sempre explícita, vinda do admin.
  cacheLife("max");

  return querySiteSettings();
}

export async function getDishes(): Promise<Dish[]> {
  "use cache";
  cacheTag(CACHE_TAGS.dishes);
  cacheLife("max");

  return queryVisibleDishes();
}

export async function getHours(): Promise<OpeningHour[]> {
  "use cache";
  cacheTag(CACHE_TAGS.hours);
  cacheLife("max");

  return queryOpeningHours();
}

/**
 * Ano do copyright.
 *
 * Ler o relógio direto no componente quebraria o build (`cacheComponents` não
 * deixa o shell estático conter valor que envelhece). Dentro de um escopo
 * cacheado o valor passa a ter validade explícita: `days` faz a virada de ano
 * acontecer sozinha, no máximo um dia depois.
 */
export async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}
