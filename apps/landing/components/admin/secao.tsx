import type { ReactNode } from "react";

/** Agrupamento de campos dentro de um formulário longo. */
export function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="border-b border-creme/10 pb-2.5 text-[11px] uppercase tracking-[0.24em] text-creme/40">
        {titulo}
      </h3>
      {children}
    </section>
  );
}
