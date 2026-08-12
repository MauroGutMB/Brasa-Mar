"use server";

import {
  buffetSchema,
  contactSchema,
  identitySchema,
  locationSchema,
  openingHoursSchema,
} from "@brasamar/db/validation";
import {
  getSiteSettings,
  setShowPrices,
  updateBuffet,
  updateContact,
  updateIdentity,
  updateLocation,
  updateOpeningHours,
} from "@brasamar/db";
import { updateTag } from "next/cache";

import { UploadError, resolverFoto } from "@/lib/storage";

import {
  erro,
  sucesso,
  zodErrors,
  type FormState,
} from "@/lib/actions/form-state";
import { requireAdmin } from "@/lib/auth/dal";
import { CACHE_TAGS } from "@/lib/cache-tags";

/**
 * Server Actions das configurações do site.
 *
 * Toda action segue o mesmo roteiro: `requireAdmin()` (autorização de
 * verdade), validação com o schema Zod, escrita e `updateTag` — que expira o
 * cache na hora, para o dono ver a mudança no site imediatamente.
 */

/** Imagem de compartilhamento padrão, servida de `public/`. */
const OG_PADRAO = "/og.jpg";

export async function saveIdentity(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = identitySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return erro("Confira os campos destacados.", zodErrors(parsed.error));
  }

  const atual = await getSiteSettings();
  let imagens;

  try {
    // A og fica no bucket só quando foi enviada; removida, volta para o
    // arquivo estático em public/ — a coluna não aceita nulo.
    const og = await resolverFoto(
      formData,
      "site/compartilhamento",
      atual.ogImageUrl.startsWith("http") ? atual.ogImageUrl : null,
      "foto-og",
    );

    imagens = {
      heroImageUrl: await resolverFoto(
        formData,
        "hero/principal",
        atual.heroImageUrl,
        "foto-hero",
      ),
      heroSecondaryImageUrl: await resolverFoto(
        formData,
        "hero/secundaria",
        atual.heroSecondaryImageUrl,
        "foto-hero-2",
      ),
      ogImageUrl: og ?? OG_PADRAO,
    };
  } catch (falha) {
    if (falha instanceof UploadError) return erro(falha.message);
    throw falha;
  }

  await updateIdentity(parsed.data, imagens);
  updateTag(CACHE_TAGS.settings);

  return sucesso("Identidade e SEO atualizados.");
}

/**
 * Liga/desliga os preços do cardápio.
 *
 * Ação própria, sem formulário: o botão manda o estado desejado e o efeito é
 * imediato no site.
 */
export async function toggleShowPricesAction(
  showPrices: boolean,
): Promise<void> {
  await requireAdmin();

  await setShowPrices(showPrices);
  updateTag(CACHE_TAGS.settings);
}

export async function saveContact(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return erro("Confira os campos destacados.", zodErrors(parsed.error));
  }

  await updateContact(parsed.data);
  updateTag(CACHE_TAGS.settings);

  return sucesso("Contato atualizado.");
}

export async function saveLocation(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = locationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return erro("Confira os campos destacados.", zodErrors(parsed.error));
  }

  await updateLocation(parsed.data);
  updateTag(CACHE_TAGS.settings);

  return sucesso("Endereço atualizado.");
}

export async function saveBuffet(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = buffetSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return erro("Confira os campos destacados.", zodErrors(parsed.error));
  }

  // A foto atual vem do banco, não do formulário: é ela que diz qual arquivo
  // apagar do bucket quando a pessoa troca ou remove a imagem.
  const { buffetImageUrl: atual } = await getSiteSettings();
  let imageUrl: string | null;

  try {
    imageUrl = await resolverFoto(formData, "buffet/buffet", atual);
  } catch (falha) {
    if (falha instanceof UploadError) return erro(falha.message);
    throw falha;
  }

  await updateBuffet(parsed.data, imageUrl);
  updateTag(CACHE_TAGS.settings);

  return sucesso("Buffet atualizado.");
}

export async function saveOpeningHours(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  // Os 7 dias vêm num formulário só, com os campos indexados por dia da
  // semana: `dia-2-abre`, `dia-2-fecha`, `dia-2-fechado`…
  const dias = [1, 2, 3, 4, 5, 6, 0].map((weekday) => ({
    weekday,
    label: formData.get(`dia-${weekday}-label`),
    opensAt: formData.get(`dia-${weekday}-abre`) ?? "",
    closesAt: formData.get(`dia-${weekday}-fecha`) ?? "",
    closed: formData.get(`dia-${weekday}-fechado`),
  }));

  const parsed = openingHoursSchema.safeParse(dias);

  if (!parsed.success) {
    const problemas = parsed.error.issues.map((issue) => issue.message);
    return erro(problemas[0] ?? "Confira os horários.");
  }

  await updateOpeningHours(parsed.data);
  updateTag(CACHE_TAGS.hours);

  return sucesso("Horários atualizados.");
}
