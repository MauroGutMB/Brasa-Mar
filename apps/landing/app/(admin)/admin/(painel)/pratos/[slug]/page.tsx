import { getDishBySlug } from "@brasamar/db";
import { notFound } from "next/navigation";

import { DeleteDishForm } from "@/components/admin/delete-dish-form";
import { DishForm } from "@/components/admin/dish-form";
import { PageHeader } from "@/components/admin/page-header";
import { VoltarPara } from "@/components/admin/voltar-para";
import { requireAdmin } from "@/lib/auth/dal";

export default async function EditarPratoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();

  const { slug } = await params;
  const dish = await getDishBySlug(slug);

  if (!dish) notFound();

  return (
    <>
      <VoltarPara href="/admin/pratos">Pratos</VoltarPara>
      <PageHeader titulo={dish.name} />
      <DishForm dish={dish} />

      <div className="mt-14 border-t border-creme/10 pt-8">
        <DeleteDishForm id={dish.id} nome={dish.name} imageUrl={dish.imageUrl} />
      </div>
    </>
  );
}
