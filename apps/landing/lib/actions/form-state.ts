import { flattenIssues } from "@brasamar/db/validation";

/**
 * Formato de retorno de toda Server Action de formulário.
 *
 * `useActionState` guarda esse objeto e o formulário mostra os erros campo a
 * campo. `status: "idle"` é o estado inicial, antes de qualquer envio.
 */
export interface FormState {
  status: "idle" | "ok" | "erro";
  message?: string;
  /** Erros por nome de campo, no formato que os inputs esperam. */
  errors?: Record<string, string>;
}

export const initialFormState: FormState = { status: "idle" };

/** Reexportado para as actions não precisarem conhecer o Zod. */
export const zodErrors = flattenIssues;

export function erro(
  message: string,
  errors?: Record<string, string>,
): FormState {
  return { status: "erro", message, errors };
}

export function sucesso(message = "Alterações salvas."): FormState {
  return { status: "ok", message };
}
