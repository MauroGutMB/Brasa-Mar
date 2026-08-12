import { DishForm } from "@/components/admin/dish-form";
import { PageHeader } from "@/components/admin/page-header";
import { VoltarPara } from "@/components/admin/voltar-para";
import { requireAdmin } from "@/lib/auth/dal";

/** Espera a sessão antes de renderizar; ver o layout do painel. */
export const instant = false;

export default async function NovoPratoPage() {
  await requireAdmin();

  return (
    <>
      <VoltarPara href="/admin/pratos">Pratos</VoltarPara>
      <PageHeader
        titulo="Novo prato"
        descricao="Ele entra no fim do cardápio; a ordem pode ser ajustada na lista."
      />
      <DishForm />
    </>
  );
}
