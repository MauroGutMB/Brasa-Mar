import { getSiteSettings } from "@brasamar/db";

import { BuffetForm } from "@/components/admin/buffet-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth/dal";

/** Espera a sessão antes de renderizar; ver o layout do painel. */
export const instant = false;

export default async function BuffetPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        titulo="Buffet"
        descricao="A seção de eventos: textos, ocasiões atendidas e os diferenciais numerados."
      />
      <BuffetForm settings={settings} />
    </>
  );
}
