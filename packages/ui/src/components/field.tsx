import { useId, type ReactNode } from "react";

import { cn } from "../lib/cn";

export interface FieldProps {
  label: string;
  /** Texto de ajuda embaixo do campo — some quando há erro. */
  hint?: string;
  /** Mensagem vinda da validação Zod da Server Action. */
  error?: string;
  required?: boolean;
  className?: string;
  /**
   * Recebe os atributos que ligam o controle ao label e à mensagem de erro.
   * Fica como render prop porque o controle pode ser input, textarea, select
   * ou um grupo inteiro.
   */
  children: (props: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean | undefined;
  }) => ReactNode;
}

export function Field({
  label,
  hint,
  error,
  required = false,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const mensagemId = `${id}-msg`;
  const temMensagem = Boolean(error ?? hint);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="text-[11px] uppercase tracking-[0.2em] text-creme/50"
      >
        {label}
        {required ? (
          <span aria-hidden className="ml-1 text-brasa-500">
            *
          </span>
        ) : null}
      </label>

      {children({
        id,
        "aria-describedby": temMensagem ? mensagemId : undefined,
        "aria-invalid": error ? true : undefined,
      })}

      {temMensagem ? (
        <p
          id={mensagemId}
          className={cn(
            "text-[12.5px] leading-snug",
            error ? "text-brasa-400" : "text-creme/40",
          )}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
