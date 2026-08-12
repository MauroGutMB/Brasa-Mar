import { getAdminUsers } from "@brasamar/db";

import { PageHeader } from "@/components/admin/page-header";
import { UsersPanel } from "@/components/admin/users-panel";
import { requireAdmin } from "@/lib/auth/dal";

export default async function UsuariosPage() {
  const atual = await requireAdmin();
  const users = await getAdminUsers();

  return (
    <>
      <PageHeader
        titulo="Usuários"
        descricao="Todo mundo aqui pode editar tudo, inclusive dar e tirar acesso de outras pessoas."
      />
      <UsersPanel users={users} atualId={atual.id} />
    </>
  );
}
