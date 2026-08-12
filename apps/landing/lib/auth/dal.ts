import "server-only";

import { getAdminUser, type AdminUser } from "@brasamar/db";
import { redirect } from "next/navigation";
import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/auth/supabase";

/**
 * Data Access Layer da autenticação.
 *
 * É aqui que a autorização acontece de verdade — `proxy.ts` só faz uma
 * checagem otimista de cookie, que não serve como barreira. Toda página de
 * admin e toda Server Action começa chamando `requireAdmin()`.
 *
 * Duas condições, não uma: a sessão precisa ser válida no Supabase Auth **e**
 * o usuário precisa ter linha em `admin_users`. Assim, remover alguém do
 * painel corta o acesso mesmo que o token dele ainda esteja válido.
 */

export interface Sessao {
  user: AdminUser;
}

/**
 * `cache` do React deduplica a verificação dentro da mesma requisição: o
 * layout, a página e a action chamam à vontade, e o Supabase é consultado
 * uma vez só.
 */
export const getSession = cache(async (): Promise<Sessao | null> => {
  const supabase = await createSupabaseServerClient();

  // `getUser` valida o token no servidor do Supabase. `getSession` só lê o
  // cookie, que o cliente pode ter forjado — por isso não serve aqui.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error ?? !user) return null;

  const admin = await getAdminUser(user.id);

  if (!admin) return null;

  return { user: admin };
});

/** Para páginas e actions do admin: corta o fluxo se não houver sessão. */
export async function requireAdmin(): Promise<AdminUser> {
  const sessao = await getSession();

  if (!sessao) {
    redirect("/admin/login");
  }

  return sessao.user;
}
