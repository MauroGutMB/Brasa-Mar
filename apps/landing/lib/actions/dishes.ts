"use server";

import {
  createDish,
  deleteDish,
  getDishBySlug,
  reorderDishes,
  setDishVisibility,
  updateDish,
  type Dish,
} from "@brasamar/db";
import { dishSchema } from "@brasamar/db/validation";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  erro,
  sucesso,
  zodErrors,
  type FormState,
} from "@/lib/actions/form-state";
import { requireAdmin } from "@/lib/auth/dal";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { UploadError, removerImagem, resolverFoto } from "@/lib/storage";

function invalidar(): void {
  updateTag(CACHE_TAGS.dishes);
}

export async function createDishAction(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = dishSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return erro("Confira os campos destacados.", zodErrors(parsed.error));
  }

  if (await getDishBySlug(parsed.data.slug)) {
    return erro("Já existe um prato com esse endereço.", {
      slug: "Esse endereço já está em uso",
    });
  }

  let imageUrl: string | null = null;

  try {
    imageUrl = await resolverFoto(formData, `pratos/${parsed.data.slug}`, null);
  } catch (falha) {
    if (falha instanceof UploadError) return erro(falha.message);
    throw falha;
  }

  await createDish(parsed.data, imageUrl);
  invalidar();

  redirect("/admin/pratos");
}

export async function updateDishAction(
  dish: Dish,
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = dishSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return erro("Confira os campos destacados.", zodErrors(parsed.error));
  }

  if (parsed.data.slug !== dish.slug) {
    const existente = await getDishBySlug(parsed.data.slug);

    if (existente && existente.id !== dish.id) {
      return erro("Já existe um prato com esse endereço.", {
        slug: "Esse endereço já está em uso",
      });
    }
  }

  let imageUrl: string | null;

  try {
    imageUrl = await resolverFoto(
      formData,
      `pratos/${parsed.data.slug}`,
      dish.imageUrl,
    );
  } catch (falha) {
    if (falha instanceof UploadError) return erro(falha.message);
    throw falha;
  }

  await updateDish(dish.id, parsed.data, imageUrl);
  invalidar();

  return sucesso("Prato atualizado.");
}

export async function deleteDishAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id"));
  const imageUrl = formData.get("imageUrl");

  await deleteDish(id);
  await removerImagem(typeof imageUrl === "string" ? imageUrl : null);
  invalidar();

  redirect("/admin/pratos");
}

export async function toggleDishAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id"));
  // O formulário manda o estado desejado, não o atual: assim dois cliques
  // rápidos não invertem duas vezes em cima de leituras defasadas.
  const visible = formData.get("visible") === "true";

  await setDishVisibility(id, visible);
  invalidar();
}

export async function reorderDishesAction(ids: string[]): Promise<void> {
  await requireAdmin();

  await reorderDishes(ids);
  invalidar();
}
