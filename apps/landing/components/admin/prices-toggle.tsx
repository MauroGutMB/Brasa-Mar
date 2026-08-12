"use client";

import { useOptimistic, useTransition } from "react";

import { Button, cn } from "@brasamar/ui";

import { toggleShowPricesAction } from "@/lib/actions/settings";

/**
 * Liga e desliga os preços do cardápio inteiro.
 *
 * Age na hora, sem botão de salvar: é uma decisão de uma tecla só ("hoje não
 * vou mostrar valores"), e obrigar a abrir um formulário longo para isso seria
 * atrito à toa. O estado muda na tela antes da resposta chegar e volta sozinho
 * se a escrita falhar.
 */
export function PricesToggle({ showPrices }: { showPrices: boolean }) {
  const [pendente, startTransition] = useTransition();
  const [ligado, aplicar] = useOptimistic(showPrices);

  function alternar() {
    startTransition(async () => {
      aplicar(!ligado);
      await toggleShowPricesAction(!ligado);
    });
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-md border px-4 py-3.5 transition-colors",
        ligado
          ? "border-creme/12 bg-carvao-850"
          : "border-brasa-500/35 bg-brasa-500/8",
        pendente && "opacity-70",
      )}
    >
      <div>
        <p className="flex items-center gap-2.5 text-[14.5px] text-creme">
          Preços no cardápio
          <span
            className={cn(
              "rounded px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]",
              ligado
                ? "bg-creme/10 text-creme/60"
                : "bg-brasa-500/20 text-brasa-400",
            )}
          >
            {ligado ? "Aparecendo" : "Escondidos"}
          </span>
        </p>
        <p className="mt-1 text-[13px] text-creme/45">
          {ligado
            ? "Os valores estão visíveis para quem acessa o site."
            : "Nenhum valor aparece no site — os pratos seguem no cardápio."}
        </p>
      </div>

      <Button
        type="button"
        onClick={alternar}
        disabled={pendente}
        variant={ligado ? "outline" : "primary"}
        size="sm"
        className="normal-case tracking-normal"
        aria-pressed={ligado}
      >
        {ligado ? "Desativar preços" : "Ativar preços"}
      </Button>
    </div>
  );
}
