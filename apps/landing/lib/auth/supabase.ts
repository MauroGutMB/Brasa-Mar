import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function env(nome: string): string {
  const valor = process.env[nome];

  if (!valor) {
    throw new Error(
      `${nome} não definida. Veja .env.example para a lista de variáveis.`,
    );
  }

  return valor;
}

/**
 * Cliente ligado à sessão do visitante.
 *
 * Usa a chave anon e lê/escreve os cookies da requisição — é ele que sabe
 * quem está logado. Componentes de servidor não podem escrever cookies; por
 * isso o `setAll` engole o erro, e a renovação do token acaba acontecendo no
 * `proxy.ts`, que pode escrever.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component: o proxy renova a sessão na próxima requisição.
          }
        },
      },
    },
  );
}

/**
 * Cliente administrativo, com a service role key.
 *
 * Ignora RLS e pode criar/remover usuários, então só pode ser chamado depois
 * de `requireAdmin()`. Nunca importar isso de um componente de cliente — a
 * chave dá acesso total ao banco.
 */
export function createSupabaseAdminClient() {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
