import Link from "next/link";

import { getAllDishes, getSiteSettings } from "@brasamar/db";

import { DishList } from "@/components/admin/dish-list";
import { PageHeader } from "@/components/admin/page-header";
import { PricesToggle } from "@/components/admin/prices-toggle";
import { requireAdmin } from "@/lib/auth/dal";

/** Espera a sessão antes de renderizar; ver o layout do painel. */
export const instant = false;

export default async function PratosPage() {
  await requireAdmin();
  const [dishes, settings] = await Promise.all([
    getAllDishes(),
    getSiteSettings(),
  ]);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          titulo="Pratos"
          descricao="A ordem aqui é a ordem do cardápio no site."
        />
        <Link
          href="/admin/pratos/novo"
          className="rounded-md bg-brasa-500 px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-carvao-1000 transition-colors hover:bg-brasa-400 hover:text-carvao-1000"
        >
          Novo prato
        </Link>
      </div>

      <div className="mb-7">
        <PricesToggle showPrices={settings.showPrices} />
      </div>

      <DishList dishes={dishes} />
    </>
  );
}
