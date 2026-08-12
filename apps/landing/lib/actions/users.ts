"use server";

import { countAdminUsers, createAdminUser, deleteAdminUser } from "@brasamar/db";
import { newUserSchema } from "@brasamar/db/validation";
import { revalidatePath } from "next/cache";

import {
  erro,
  sucesso,
  zodErrors,
  type FormState,
} from "@/lib/actions/form-state";
import { requireAdmin } from "@/lib/auth/dal";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

/**
 * Usuários do painel.
 *
 * Todo mundo aqui tem o mesmo poder, inclusive o de criar e remover outros —
 * é o combinado para um time pequeno. A única trava é não deixar a casa sem
 * dono: o último usuário não pode se remover.
 */

export async function createUserAction(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = newUserSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return erro("Confira os campos destacados.", zodErrors(parsed.error));
  }

  const { name, email, password } = parsed.data;
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    // Sem confirmação por e-mail: a senha é combinada na hora do cadastro,
    // então o painel não depende de servidor de e-mail configurado.
    email_confirm: true,
  });

  if (error ?? !data.user) {
    return erro(error?.message ?? "Não foi possível criar o usuário.");
  }

  try {
    await createAdminUser({ id: data.user.id, email, name });
  } catch (falha) {
    // Sem a linha em admin_users o login não funcionaria, e sobraria um
    // usuário fantasma no Auth — melhor desfazer.
    await supabase.auth.admin.deleteUser(data.user.id);
    throw falha;
  }

  revalidatePath("/admin/usuarios");

  return sucesso(`${name} agora tem acesso ao painel.`);
}

export async function deleteUserAction(formData: FormData): Promise<FormState> {
  const atual = await requireAdmin();
  const id = String(formData.get("id"));

  if (id === atual.id) {
    return erro("Você não pode remover o seu próprio acesso.");
  }

  if ((await countAdminUsers()) <= 1) {
    return erro("O painel precisa de pelo menos um usuário.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    return erro(`Não foi possível remover: ${error.message}`);
  }

  // A FK para auth.users tem ON DELETE CASCADE num banco Supabase, mas apagar
  // aqui também mantém o comportamento correto em Postgres puro.
  await deleteAdminUser(id);
  revalidatePath("/admin/usuarios");

  return sucesso("Acesso removido.");
}
