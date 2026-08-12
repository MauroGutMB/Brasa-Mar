"use client";

import { useActionState, useState } from "react";

import type { DishCategory } from "@brasamar/db";
import { Button, Input, cn } from "@brasamar/ui";

import { FormMessage } from "@/components/admin/form-message";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/categories";
import { initialFormState } from "@/lib/actions/form-state";
import { categoryBadgeStyle } from "@/lib/site";

/**
 * Atalhos com as cores da marca.
 *
 * O seletor de cor do sistema continua disponível para qualquer cor; estes são
 * só os valores que já combinam com o tema escuro do site.
 */
const PALETA = [
  { cor: "#e2571f", nome: "Brasa" },
  { cor: "#f0821e", nome: "Brasa clara" },
  { cor: "#4e8cb4", nome: "Mar" },
  { cor: "#7eb3d3", nome: "Mar clara" },
  { cor: "#f2ebdd", nome: "Creme" },
  { cor: "#7ba05b", nome: "Verde" },
  { cor: "#c9a227", nome: "Dourado" },
  { cor: "#b0413e", nome: "Vinho" },
];

export function CategoryManager({
  categories,
  usoPorCategoria,
}: {
  categories: DishCategory[];
  /** Quantos pratos usam cada categoria, por id. */
  usoPorCategoria: Record<string, number>;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <section className="rounded-md border border-creme/12 bg-carvao-850">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
      >
        <span>
          <span className="text-[14.5px] text-creme">Categorias</span>
          <span className="mt-1 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <span
                key={c.id}
                style={categoryBadgeStyle(c.color)}
                className="rounded px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]"
              >
                {c.name}
              </span>
            ))}
          </span>
        </span>
        <span aria-hidden className="text-creme/45">
          {aberto ? "▲" : "▼"}
        </span>
      </button>

      {aberto ? (
        <div className="flex flex-col gap-2.5 border-t border-creme/10 p-4">
          {categories.map((categoria) => (
            <CategoryRow
              key={categoria.id}
              categoria={categoria}
              emUso={usoPorCategoria[categoria.id] ?? 0}
              podeApagar={categories.length > 1}
            />
          ))}

          <NovaCategoria />
        </div>
      ) : null}
    </section>
  );
}

function CategoryRow({
  categoria,
  emUso,
  podeApagar,
}: {
  categoria: DishCategory;
  emUso: number;
  podeApagar: boolean;
}) {
  const [estado, salvar] = useActionState(
    updateCategoryAction.bind(null, categoria.id),
    initialFormState,
  );
  const [estadoApagar, apagar] = useActionState(
    deleteCategoryAction,
    initialFormState,
  );
  const [cor, setCor] = useState(categoria.color);

  return (
    <div className="rounded-md border border-creme/10 p-3.5">
      <div className="flex flex-wrap items-end gap-3">
        <form
          action={salvar}
          className="flex flex-1 flex-wrap items-end gap-3"
          id={`cat-${categoria.id}`}
        >
          <ColorPicker cor={cor} onChange={setCor} />

          <label className="min-w-[140px] flex-1">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-creme/50">
              Nome
            </span>
            <Input
              name="name"
              defaultValue={categoria.name}
              required
              maxLength={60}
              className="py-2"
            />
          </label>

          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="normal-case tracking-normal"
          >
            Salvar
          </Button>
        </form>

        <form action={apagar}>
          <input type="hidden" name="id" value={categoria.id} />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!podeApagar || emUso > 0}
            title={
              emUso > 0
                ? `${emUso} prato(s) usam esta categoria`
                : !podeApagar
                  ? "É a única categoria do cardápio"
                  : undefined
            }
            className="normal-case tracking-normal"
          >
            Apagar
          </Button>
        </form>
      </div>

      <p className="mt-2 text-[12.5px] text-creme/40">
        {emUso === 0
          ? "Nenhum prato usa esta categoria."
          : emUso === 1
            ? "1 prato usa esta categoria."
            : `${emUso} pratos usam esta categoria.`}
      </p>

      <FormMessage estado={estado} className="mt-2.5" />
      <FormMessage estado={estadoApagar} className="mt-2.5" />
    </div>
  );
}

function NovaCategoria() {
  const [estado, criar] = useActionState(
    createCategoryAction,
    initialFormState,
  );
  const [cor, setCor] = useState("#e2571f");

  return (
    <form
      action={criar}
      className="rounded-md border border-dashed border-creme/20 p-3.5"
    >
      <div className="flex flex-wrap items-end gap-3">
        <ColorPicker cor={cor} onChange={setCor} />

        <label className="min-w-[140px] flex-1">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-creme/50">
            Nova categoria
          </span>
          <Input
            name="name"
            placeholder="Ex.: Sobremesas"
            required
            maxLength={60}
            className="py-2"
          />
        </label>

        <Button type="submit" size="sm" className="normal-case tracking-normal">
          Adicionar
        </Button>
      </div>

      <FormMessage estado={estado} className="mt-2.5" />
    </form>
  );
}

/** Seletor do sistema mais os atalhos da paleta da marca. */
function ColorPicker({
  cor,
  onChange,
}: {
  cor: string;
  onChange: (valor: string) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-creme/50">
        Cor
      </span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          name="color"
          value={cor}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Cor da categoria"
          className="size-9 cursor-pointer rounded border border-creme/20 bg-transparent p-0.5"
        />
        <div className="flex flex-wrap gap-1">
          {PALETA.map((opcao) => (
            <button
              key={opcao.cor}
              type="button"
              onClick={() => onChange(opcao.cor)}
              title={opcao.nome}
              aria-label={`Usar a cor ${opcao.nome}`}
              style={{ backgroundColor: opcao.cor }}
              className={cn(
                "size-5 rounded-full border transition-transform hover:scale-110",
                cor.toLowerCase() === opcao.cor
                  ? "border-creme"
                  : "border-creme/25",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
