import { getSiteSettings } from "@brasamar/db";

import { ContactForm } from "@/components/admin/contact-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth/dal";

/** Espera a sessão antes de renderizar; ver o layout do painel. */
export const instant = false;

export default async function ContatoPage() {
  await requireAdmin();
  // Leitura sem cache: o painel tem que mostrar o valor recém-salvo, não o
  // que está publicado no site.
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        titulo="Contato"
        descricao="O telefone aparece no topo, na seção de localização e no rodapé, e é o número usado no botão do WhatsApp."
      />
      <ContactForm settings={settings} />
    </>
  );
}
