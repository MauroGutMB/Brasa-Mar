import { getSiteSettings } from "@brasamar/db";

import { IdentityForm } from "@/components/admin/identity-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth/dal";

export default async function IdentidadePage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        titulo="Identidade e SEO"
        descricao="Nome, textos do topo do site e o que aparece quando alguém compartilha o link ou encontra o restaurante no Google."
      />
      <IdentityForm settings={settings} />
    </>
  );
}
