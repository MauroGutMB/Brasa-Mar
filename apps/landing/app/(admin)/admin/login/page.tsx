import Link from "next/link";

import { Wordmark } from "@/components/shared/logo";
import { LoginForm } from "@/components/admin/login-form";

/**
 * O `instant = false` do grupo `(admin)` cobre o bloqueio que acontece nos
 * layouts, mas esta página lê `searchParams` nela mesma — e isso é validado no
 * segmento da própria página. Aqui não há o que pré-renderizar: a tela de login
 * depende do `?proximo=` para devolver a pessoa ao lugar certo depois de entrar.
 */
export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ proximo?: string; erro?: string }>;
}) {
  const { proximo, erro } = await searchParams;

  return (
    <div className="grid min-h-dvh place-items-center bg-carvao-950 px-6 py-12">
      <div className="w-full max-w-[380px]">
        <div className="mb-9 text-center">
          <Wordmark className="block text-2xl" />
          <p className="mt-2.5 text-[10px] uppercase tracking-[0.3em] text-creme/40">
            Painel de conteúdo
          </p>
        </div>

        <LoginForm proximo={proximo} semAcesso={erro === "sem-acesso"} />

        <p className="mt-8 text-center text-[13px] text-creme/40">
          <Link href="/" className="text-inherit hover:text-brasa-500">
            Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
