import { cn } from "@brasamar/ui";

import type { FormState } from "@/lib/actions/form-state";

/**
 * Aviso de sucesso ou erro do formulário.
 *
 * `role="status"` faz o leitor de tela anunciar a mensagem sem roubar o foco
 * de onde a pessoa estava.
 */
export function FormMessage({
  estado,
  className,
}: {
  estado: FormState;
  className?: string;
}) {
  if (estado.status === "idle" || !estado.message) return null;

  return (
    <p
      role="status"
      className={cn(
        "rounded-md border px-3.5 py-2.5 text-[13.5px] leading-snug",
        estado.status === "ok"
          ? "border-mar-500/40 bg-mar-500/10 text-mar-300"
          : "border-brasa-500/45 bg-brasa-500/10 text-brasa-400",
        className,
      )}
    >
      {estado.message}
    </p>
  );
}
