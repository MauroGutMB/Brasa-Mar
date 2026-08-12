"use client";

import { Button } from "@brasamar/ui";

import { deleteDishAction } from "@/lib/actions/dishes";

/**
 * Apagar é irreversível, então pede confirmação.
 *
 * `onSubmit` com `confirm()` é suficiente aqui — sem JavaScript o formulário
 * ainda funciona, e o pior caso é apagar um prato que pode ser recriado.
 */
export function DeleteDishForm({
  id,
  nome,
  imageUrl,
}: {
  id: string;
  nome: string;
  imageUrl: string | null;
}) {
  return (
    <form
      action={deleteDishAction}
      onSubmit={(event) => {
        if (!window.confirm(`Apagar "${nome}"? Isso não pode ser desfeito.`)) {
          event.preventDefault();
        }
      }}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />

      <div>
        <p className="text-[14.5px] text-creme">Apagar este prato</p>
        <p className="mt-1 text-[13px] text-creme/45">
          Para tirar do site temporariamente, prefira desligar “Aparecer no
          site”.
        </p>
      </div>

      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="border-brasa-500/50 normal-case tracking-normal text-brasa-400 hover:border-brasa-500 hover:text-brasa-400"
      >
        Apagar
      </Button>
    </form>
  );
}
