import type { InputHTMLAttributes } from "react";

import { cn } from "../lib/cn";

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
}

/**
 * Chave liga/desliga.
 *
 * É um `<input type="checkbox">` de verdade, só escondido: assim funciona
 * dentro de um `<form>` sem JavaScript e chega na Server Action como "on",
 * que é o que o schema Zod espera.
 */
export function Toggle({ label, hint, className, ...props }: ToggleProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3.5 rounded-md border border-creme/12 bg-carvao-950 px-4 py-3.5 transition-colors hover:border-creme/25 has-[:focus-visible]:border-brasa-500",
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />

      {/* O botão é irmão do input (por isso `peer-checked:` funciona aqui),
          mas a bolinha é filha — daí o seletor explícito para o filho. */}
      <span
        aria-hidden
        className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-creme/20 transition-colors peer-checked:bg-brasa-500 peer-checked:[&>span]:translate-x-4"
      >
        <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-creme transition-transform" />
      </span>

      <span className="flex flex-col gap-1">
        <span className="text-[14.5px] leading-none text-creme">{label}</span>
        {hint ? (
          <span className="text-[12.5px] leading-snug text-creme/45">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  );
}
