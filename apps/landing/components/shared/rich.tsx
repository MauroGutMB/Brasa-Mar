import { Fragment } from "react";

/**
 * Renderiza os marcadores de destaque dos textos editáveis no admin:
 *
 *   *palavra*   → laranja da marca
 *   _palavra_   → azul da marca
 *   **palavra** → negrito claro
 *
 * É deliberadamente mínimo: nada de HTML vindo do banco, só três marcações
 * conhecidas viram elemento. Qualquer outra coisa sai como texto puro, então
 * não há como injetar markup pelo painel.
 */

const PADRAO = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;

export interface RichProps {
  text: string;
  /** Cor aplicada a `*texto*`. O hero usa brasa; o resto do site também. */
  accentClassName?: string;
  /** Cor aplicada a `_texto_`. */
  secondaryClassName?: string;
  /** Classe do `**texto**`. */
  strongClassName?: string;
}

export function Rich({
  text,
  accentClassName = "text-brasa-500",
  secondaryClassName = "text-mar-400",
  strongClassName = "font-semibold text-creme",
}: RichProps) {
  const partes = text.split(PADRAO).filter((parte) => parte !== "");

  return (
    <>
      {partes.map((parte, indice) => {
        const chave = `${indice}-${parte}`;

        if (parte.startsWith("**") && parte.endsWith("**")) {
          return (
            <strong key={chave} className={strongClassName}>
              {parte.slice(2, -2)}
            </strong>
          );
        }

        if (parte.startsWith("*") && parte.endsWith("*")) {
          return (
            <span key={chave} className={accentClassName}>
              {parte.slice(1, -1)}
            </span>
          );
        }

        if (parte.startsWith("_") && parte.endsWith("_")) {
          return (
            <span key={chave} className={secondaryClassName}>
              {parte.slice(1, -1)}
            </span>
          );
        }

        return <Fragment key={chave}>{parte}</Fragment>;
      })}
    </>
  );
}

/** Versão em texto puro — para `alt`, `title` e metadata. */
export function stripMarkers(text: string): string {
  return text.replace(/\*\*|\*|_/g, "");
}
