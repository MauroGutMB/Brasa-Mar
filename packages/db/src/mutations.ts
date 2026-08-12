/**
 * Escritas puras.
 *
 * Quem chama é sempre uma Server Action, que já validou a entrada com os
 * schemas de `validation.ts` e já checou a sessão. Aqui não há verificação de
 * permissão — é a camada de dados, não a de autorização.
 */

import { eq, inArray, sql as raw } from "drizzle-orm";

import { db } from "./client";
import { SETTINGS_ID } from "./queries";
import {
  adminUsers,
  dishes,
  openingHours,
  siteSettings,
  type BuffetFeature,
  type BuffetOccasion,
  type Dish,
  type NewDish,
  type SiteSettingsUpdate,
} from "./schema";
import type {
  BuffetInput,
  ContactInput,
  DishInput,
  IdentityInput,
  LocationInput,
  OpeningHourInput,
} from "./validation";

async function patchSettings(patch: SiteSettingsUpdate): Promise<void> {
  await db
    .update(siteSettings)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(siteSettings.id, SETTINGS_ID));
}

/** URLs resolvidas pelos uploads da Server Action, não pelo formulário. */
export interface IdentityImages {
  heroImageUrl: string | null;
  heroSecondaryImageUrl: string | null;
  ogImageUrl: string;
}

export async function updateIdentity(
  input: IdentityInput,
  imagens: IdentityImages,
): Promise<void> {
  await patchSettings({
    name: input.name,
    tagline: input.tagline,
    kicker: input.kicker,
    description: input.description,
    heroTitleLine1: input.heroTitleLine1,
    heroTitleLine2: input.heroTitleLine2,
    heroBadge: input.heroBadge,
    heroText: input.heroText,
    heroImageUrl: imagens.heroImageUrl,
    heroImageAlt: input.heroImageAlt,
    heroSecondaryImageUrl: imagens.heroSecondaryImageUrl,
    heroSecondaryImageAlt: input.heroSecondaryImageAlt,
    dishesNote: input.dishesNote,
    seoKeywords: input.seoKeywords,
    ogImageUrl: imagens.ogImageUrl,
  });
}

/** Liga e desliga os preços do cardápio inteiro. Botão próprio no painel. */
export async function setShowPrices(showPrices: boolean): Promise<void> {
  await patchSettings({ showPrices });
}

export async function updateContact(input: ContactInput): Promise<void> {
  await patchSettings({ phone: input.phone, email: input.email });
}

export async function updateLocation(input: LocationInput): Promise<void> {
  await patchSettings({
    street: input.street,
    number: input.number,
    district: input.district,
    city: input.city,
    state: input.state,
    zip: input.zip,
    lat: input.lat,
    lng: input.lng,
    locationNote: input.locationNote,
  });
}

/** `imageUrl` vem do upload, não do formulário — ver a action que chama. */
export async function updateBuffet(
  input: BuffetInput,
  imageUrl: string | null,
): Promise<void> {
  const occasions: BuffetOccasion[] = input.occasions.map((label) => ({
    label,
  }));

  // A numeração romana é posicional: reordenar a lista renumera sozinho.
  const features: BuffetFeature[] = input.features.map((title, indice) => ({
    numeral: toRoman(indice + 1),
    title,
  }));

  await patchSettings({
    buffetEyebrow: input.buffetEyebrow,
    buffetBadge: input.buffetBadge,
    buffetText: input.buffetText,
    buffetFeaturesIntro: input.buffetFeaturesIntro,
    buffetClosing: input.buffetClosing,
    buffetImageUrl: imageUrl,
    buffetImageAlt: input.buffetImageAlt,
    buffetOccasions: occasions,
    buffetFeatures: features,
  });
}

export async function updateOpeningHours(
  input: OpeningHourInput[],
): Promise<void> {
  await db.transaction(async (tx) => {
    for (const dia of input) {
      await tx
        .update(openingHours)
        .set({
          label: dia.label,
          opensAt: dia.closed ? "" : dia.opensAt,
          closesAt: dia.closed ? "" : dia.closesAt,
          closed: dia.closed,
        })
        .where(eq(openingHours.weekday, dia.weekday));
    }
  });
}

/** `imageUrl` vem do upload, não do formulário — ver a action que chama. */
export async function createDish(
  input: DishInput,
  imageUrl: string | null,
): Promise<Dish> {
  // Entra no fim da lista, como no admin de qualquer CMS.
  const [{ next } = { next: 0 }] = await db
    .select({ next: raw<number>`coalesce(max(${dishes.position}), -1) + 1` })
    .from(dishes);

  const novo: NewDish = { ...input, imageUrl, position: next };
  const [criado] = await db.insert(dishes).values(novo).returning();

  if (!criado) {
    throw new Error("Não foi possível criar o prato.");
  }

  return criado;
}

export async function updateDish(
  id: string,
  input: DishInput,
  imageUrl: string | null,
): Promise<void> {
  await db
    .update(dishes)
    .set({ ...input, imageUrl })
    .where(eq(dishes.id, id));
}

export async function deleteDish(id: string): Promise<void> {
  await db.delete(dishes).where(eq(dishes.id, id));
}

export async function setDishVisibility(
  id: string,
  visible: boolean,
): Promise<void> {
  await db.update(dishes).set({ visible }).where(eq(dishes.id, id));
}

export async function setDishImage(
  id: string,
  imageUrl: string | null,
  imageAlt?: string,
): Promise<void> {
  await db
    .update(dishes)
    .set(imageAlt === undefined ? { imageUrl } : { imageUrl, imageAlt })
    .where(eq(dishes.id, id));
}

/** Recebe os ids na ordem desejada e regrava `position` de todos. */
export async function reorderDishes(ids: string[]): Promise<void> {
  if (ids.length === 0) return;

  const existentes = await db
    .select({ id: dishes.id })
    .from(dishes)
    .where(inArray(dishes.id, ids));

  if (existentes.length !== ids.length) {
    throw new Error("A lista de ordenação não bate com os pratos do banco.");
  }

  await db.transaction(async (tx) => {
    for (const [indice, id] of ids.entries()) {
      await tx.update(dishes).set({ position: indice }).where(eq(dishes.id, id));
    }
  });
}

export async function createAdminUser(input: {
  id: string;
  email: string;
  name: string;
}): Promise<void> {
  await db.insert(adminUsers).values(input);
}

export async function deleteAdminUser(id: string): Promise<void> {
  await db.delete(adminUsers).where(eq(adminUsers.id, id));
}

export async function countAdminUsers(): Promise<number> {
  const [row] = await db
    .select({ total: raw<number>`count(*)::int` })
    .from(adminUsers);

  return row?.total ?? 0;
}

const romanos = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Só precisa cobrir listas curtas; acima de 10 cai no próprio número. */
function toRoman(numero: number): string {
  return romanos[numero - 1] ?? String(numero);
}
