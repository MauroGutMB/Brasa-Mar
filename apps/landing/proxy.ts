import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * No Next 16 o antigo middleware se chama proxy.
 *
 * Duas funções aqui, nenhuma delas é segurança:
 *
 * 1. Renovar o token do Supabase. Server Components não conseguem escrever
 *    cookies; o proxy consegue, então é ele que mantém a sessão viva.
 * 2. Mandar quem não tem cookie direto para o login, sem renderizar a página.
 *
 * A checagem que vale é `requireAdmin()` em `lib/auth/dal.ts` — só ela
 * confirma que o usuário existe e ainda está em `admin_users`.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          response = NextResponse.next({ request });

          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (!user && !isLogin) {
    const login = new URL("/admin/login", request.url);
    // Depois de entrar, volta para onde a pessoa tentou ir.
    login.searchParams.set("proximo", pathname);
    return NextResponse.redirect(login);
  }

  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  // Só o painel: a landing não passa por aqui e continua servida do cache.
  matcher: ["/admin/:path*"],
};
