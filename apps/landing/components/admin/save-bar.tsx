"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@brasamar/ui";

import { FormMessage } from "@/components/admin/form-message";
import type { FormState } from "@/lib/actions/form-state";

/**
 * Barra de salvar, fixa no rodapé do formulário.
 *
 * Usa `useFormStatus` em vez do `pending` do `useActionState` para o botão
 * poder ficar num componente próprio sem o formulário ter que repassar estado.
 */
export function SaveBar({
  estado,
  bloqueado = false,
}: {
  estado: FormState;
  /** Trava o envio enquanto há erro detectado no navegador (ex.: foto grande). */
  bloqueado?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-4 border-t border-creme/10 bg-carvao-950/95 px-1 py-4 backdrop-blur">
      <Button type="submit" disabled={pending || bloqueado}>
        {pending ? "Salvando…" : "Salvar"}
      </Button>
      <FormMessage estado={estado} className="flex-1" />
    </div>
  );
}
