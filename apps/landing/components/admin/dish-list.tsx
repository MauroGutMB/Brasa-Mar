"use client";

import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";

import type { Dish } from "@brasamar/db";
import { Button, cn } from "@brasamar/ui";

import { reorderDishesAction, toggleDishAction } from "@/lib/actions/dishes";
import { dishTagLabels, formatPrice } from "@/lib/site";

/**
 * Lista de pratos do painel.
 *
 * A ordem é mudada por botões de subir/descer em vez de arrastar: funciona no
 * teclado e no celular, e não precisa de biblioteca de drag and drop.
 */
export function DishList({ dishes }: { dishes: Dish[] }) {
  const [pendente, startTransition] = useTransition();

  // A reordenação aparece na hora; se a escrita falhar, o React devolve a
  // lista do servidor.
  const [ordem, aplicarOrdem] = useOptimistic(
    dishes,
    (_atual: Dish[], nova: Dish[]) => nova,
  );

  function mover(indice: number, direcao: -1 | 1) {
    const destino = indice + direcao;
    if (destino < 0 || destino >= ordem.length) return;

    const nova = [...ordem];
    const [item] = nova.splice(indice, 1);
    nova.splice(destino, 0, item!);

    startTransition(async () => {
      aplicarOrdem(nova);
      await reorderDishesAction(nova.map((dish) => dish.id));
    });
  }

  if (ordem.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-creme/20 px-5 py-10 text-center text-[14px] text-creme/45">
        Nenhum prato cadastrado ainda.
      </p>
    );
  }

  return (
    <ul
      className={cn(
        "flex flex-col gap-2.5 transition-opacity",
        pendente && "opacity-70",
      )}
    >
      {ordem.map((dish, indice) => (
        <li
          key={dish.id}
          className="flex flex-wrap items-center gap-4 rounded-md border border-creme/12 bg-carvao-850 p-3.5"
        >
          <div className="relative h-[58px] w-[84px] shrink-0 overflow-hidden rounded border border-creme/10 bg-creme/[0.04]">
            {dish.imageUrl ? (
              <Image
                src={dish.imageUrl}
                alt=""
                fill
                sizes="84px"
                className="object-cover"
              />
            ) : (
              <span className="grid size-full place-items-center text-[10px] uppercase tracking-wider text-creme/30">
                Sem foto
              </span>
            )}
          </div>

          <div className="min-w-[160px] flex-1">
            <p className="flex flex-wrap items-center gap-2.5 text-[15px] text-creme">
              {dish.name}
              {!dish.visible ? (
                <span className="rounded bg-creme/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-creme/50">
                  Escondido
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-[13px] text-creme/45">
              {formatPrice(dish.priceCents)} · {dishTagLabels[dish.tag]}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <BotaoOrdem
              rotulo={`Subir ${dish.name}`}
              simbolo="↑"
              disabled={indice === 0}
              onClick={() => mover(indice, -1)}
            />
            <BotaoOrdem
              rotulo={`Descer ${dish.name}`}
              simbolo="↓"
              disabled={indice === ordem.length - 1}
              onClick={() => mover(indice, 1)}
            />

            <form action={toggleDishAction}>
              <input type="hidden" name="id" value={dish.id} />
              <input
                type="hidden"
                name="visible"
                value={String(!dish.visible)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="normal-case tracking-normal"
              >
                {dish.visible ? "Esconder" : "Mostrar"}
              </Button>
            </form>

            <Link
              href={`/admin/pratos/${dish.slug}`}
              className="rounded-full border border-creme/20 px-4 py-2 text-[12.5px] text-creme/80 transition-colors hover:border-brasa-500 hover:text-brasa-400"
            >
              Editar
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

function BotaoOrdem({
  rotulo,
  simbolo,
  disabled,
  onClick,
}: {
  rotulo: string;
  simbolo: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 place-items-center rounded border border-creme/15 text-creme/70 transition-colors hover:border-creme/35 hover:text-creme disabled:opacity-25"
    >
      <span aria-hidden>{simbolo}</span>
    </button>
  );
}
