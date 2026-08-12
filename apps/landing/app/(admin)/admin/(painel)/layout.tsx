import Link from "next/link";

import { Wordmark } from "@/components/shared/logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { requireAdmin } from "@/lib/auth/dal";

/**
 * Shell das telas autenticadas.
 *
 * `requireAdmin()` aqui garante que nenhuma página filha renderize sem sessão,
 * mas cada página e cada action chama de novo: layout não é fronteira de
 * segurança no App Router — ele não roda de novo em navegações parciais.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-dvh bg-carvao-950 lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="flex flex-col gap-8 border-creme/10 px-6 py-7 lg:h-dvh lg:sticky lg:top-0 lg:border-r">
        <div>
          <Link href="/" className="text-inherit">
            <Wordmark className="block text-[17px]" />
          </Link>
          <p className="mt-2 text-[9.5px] uppercase tracking-[0.3em] text-creme/40">
            Painel
          </p>
        </div>

        <AdminNav />

        <div className="mt-auto flex flex-col gap-2.5 border-t border-creme/10 pt-5">
          <p className="text-[13px] leading-tight text-creme">{user.name}</p>
          <p className="truncate text-[12px] text-creme/40">{user.email}</p>
          <SignOutButton />
        </div>
      </aside>

      <main className="px-6 py-9 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[760px]">{children}</div>
      </main>
    </div>
  );
}
