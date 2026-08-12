"use server";

import {
  countDishesByCategory,
  createDishCategory,
  deleteDishCategory,
  getDishCategories,
  reorderDishCategories,
  updateDishCategory,
} from "@brasamar/db";
import { dishCategorySchema } from "@brasamar/db/validation";
import { revalidatePath, updateTag } from "next/cache";

import {
  erro,
  sucesso,
  zodErrors,
  type FormState,
} from "@/lib/actions/form-state";
import { requireAdmin } from "@/lib/auth/dal";
import { CACHE_TAGS } from "@/lib/cache-tags";

/**
 * Categorias do cardápio.
 *
 * Mudar nome ou cor muda o selo dos pratos no site, então tudo aqui invalida
 * a tag de pratos.
 */

function invalidar(): void {
  // A tag atualiza o cardápio no site; o revalidatePath atualiza a própria
  // lista do painel, que lê direto do banco e não passa por cache de tag.
  updateTag(CACHE_TAGS.dishes);
  revalidatePath("/admin/pratos");
}

export async function createCategoryAction(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = dishCategorySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return erro("Confira os campos.", zodErrors(parsed.error));
  }

  await createDishCategory(parsed.data);
  invalidar();

  return sucesso(`Categoria "${parsed.data.name}" criada.`);
}

export async function updateCategoryAction(
  id: string,
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = dishCategorySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return erro("Confira os campos.", zodErrors(parsed.error));
  }

  await updateDishCategory(id, parsed.data);
  invalidar();

  return sucesso("Categoria atualizada.");
}

/**
 * Apagar categoria.
 *
 * Duas travas: não deixar o cardápio sem nenhuma categoria (não haveria o que
 * escolher ao criar um prato) e não apagar uma que ainda está em uso — a FK
 * recusaria de qualquer forma, mas com um erro de banco ilegível.
 */
export async function deleteCategoryAction(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(formData.get("id"));
  const [categorias, usoPorCategoria] = await Promise.all([
    getDishCategories(),
    countDishesByCategory(),
  ]);

  if (categorias.length <= 1) {
    return erro("O cardápio precisa de pelo menos uma categoria.");
  }

  const emUso = usoPorCategoria[id] ?? 0;

  if (emUso > 0) {
    return erro(
      emUso === 1
        ? "Há 1 prato nessa categoria. Mova-o para outra antes de apagar."
        : `Há ${emUso} pratos nessa categoria. Mova-os para outra antes de apagar.`,
    );
  }

  await deleteDishCategory(id);
  invalidar();

  return sucesso("Categoria apagada.");
}

export async function reorderCategoriesAction(ids: string[]): Promise<void> {
  await requireAdmin();

  await reorderDishCategories(ids);
  invalidar();
}
