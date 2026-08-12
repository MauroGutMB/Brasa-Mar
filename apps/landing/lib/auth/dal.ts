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

/**
 * Para páginas e actions do admin: corta o fluxo se não houver sessão.
 *
 * Distingue os dois motivos de recusa. "Sessão válida, mas sem acesso" é o
 * estado de quem foi criado no Supabase Auth e ainda não recebeu a linha em
 * `admin_users` — sem essa distinção a pessoa via só uma página em branco,
 * porque o proxy devolvia o login para `/admin` num ciclo.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const sessao = await getSession();

  if (!sessao) {
    const autenticado = await temSessaoSupabase();
    redirect(autenticado ? "/admin/login?erro=sem-acesso" : "/admin/login");
  }

  return sessao.user;
}

/** Há alguém logado no Supabase Auth, mesmo que sem acesso ao painel? */
async function temSessaoSupabase(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return Boolean(user);
}
