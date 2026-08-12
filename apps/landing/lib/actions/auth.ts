"use server";

import { loginSchema, passwordSchema } from "@brasamar/db/validation";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/dal";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import {
  erro,
  sucesso,
  zodErrors,
  type FormState,
} from "@/lib/actions/form-state";

export async function signIn(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return erro("Confira os campos.", zodErrors(parsed.error));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Mensagem genérica de propósito: dizer "esse e-mail não existe" entrega
    // quais endereços têm conta.
    return erro("E-mail ou senha incorretos.");
  }

  const proximo = formData.get("proximo");
  const destino =
    typeof proximo === "string" && proximo.startsWith("/admin")
      ? proximo
      : "/admin";

  redirect(destino);
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  redirect("/admin/login");
}

export async function changePassword(
  _estado: FormState,
  formData: FormData,
): Promise<FormState> {
  const sessao = await getSession();

  if (!sessao) {
    return erro("Sessão expirada. Entre de novo.");
  }

  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return erro("Confira os campos.", zodErrors(parsed.error));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return erro(`Não foi possível trocar a senha: ${error.message}`);
  }

  return sucesso("Senha alterada.");
}
