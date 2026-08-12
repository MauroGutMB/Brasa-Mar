import { getOpeningHours, getSiteSettings } from "@brasamar/db";

import { HoursForm } from "@/components/admin/hours-form";
import { LocationForm } from "@/components/admin/location-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth/dal";

/** Espera a sessão antes de renderizar; ver o layout do painel. */
export const instant = false;

export default async function LocalPage() {
  await requireAdmin();
  const [settings, hours] = await Promise.all([
    getSiteSettings(),
    getOpeningHours(),
  ]);

  return (
    <>
      <PageHeader
        titulo="Local e horários"
        descricao="Endereço, ponto no mapa e horário de funcionamento. Estes dados também alimentam a ficha do restaurante no Google."
      />

      <LocationForm settings={settings} />

      <div className="mt-14 border-t border-creme/10 pt-10">
        <h3 className="mb-6 font-display text-[21px] text-creme">
          Horário de funcionamento
        </h3>
        <HoursForm hours={hours} />
      </div>
    </>
  );
}
