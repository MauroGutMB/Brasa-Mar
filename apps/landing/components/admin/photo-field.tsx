"use client";

import Image from "next/image";
import { useState } from "react";

import { Field } from "@brasamar/ui";

/** Mesmo limite validado no servidor, em lib/storage.ts. */
const LIMITE_BYTES = 5 * 1024 * 1024;

const ACEITOS = "image/jpeg,image/png,image/webp,image/avif";

export interface PhotoFieldProps {
  /** Foto salva hoje; `null` mostra o aviso de placeholder. */
  atual: string | null;
  /** Nome do campo no formulário — a action lê `foto` e `remover-foto`. */
  name?: string;
  /** Texto mostrado quando ainda não há foto. */
  vazio?: string;
  /** Reportado para fora para travar o botão de salvar. */
  onErro?: (mensagem?: string) => void;
}

/**
 * Envio de foto: prévia do que está salvo, opção de remover e seleção de
 * arquivo novo.
 *
 * A checagem de tamanho acontece aqui no navegador para a pessoa não esperar
 * o upload inteiro só para descobrir que passou do limite. O servidor valida
 * de novo — isto é conveniência, não é a barreira.
 */
export function PhotoField({
  atual,
  name = "foto",
  vazio = "Sem foto — aparece o placeholder tracejado no site.",
  onErro,
}: PhotoFieldProps) {
  const [remover, setRemover] = useState(false);
  const [erro, setErro] = useState<string>();

  function reportar(mensagem?: string) {
    setErro(mensagem);
    onErro?.(mensagem);
  }

  return (
    <>
      {atual ? (
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative h-[110px] w-[160px] overflow-hidden rounded-md border border-creme/15">
            <Image
              src={atual}
              alt=""
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-[13.5px] text-creme/70">
            <input
              type="checkbox"
              name={`remover-${name}`}
              checked={remover}
              onChange={(event) => setRemover(event.target.checked)}
              className="size-4 accent-brasa-500"
            />
            Remover a foto atual
          </label>
        </div>
      ) : (
        <p className="text-[13.5px] text-creme/40">{vazio}</p>
      )}

      <Field
        label={atual ? "Trocar por outra foto" : "Enviar foto"}
        hint="JPG, PNG, WebP ou AVIF, até 5 MB. Fotos deitadas ficam melhores."
        error={erro}
      >
        {(props) => (
          <input
            {...props}
            type="file"
            name={name}
            accept={ACEITOS}
            disabled={remover}
            onChange={(event) => {
              const arquivo = event.target.files?.[0];
              const excedeu = arquivo ? arquivo.size > LIMITE_BYTES : false;

              reportar(
                excedeu
                  ? `Essa imagem tem ${(arquivo!.size / 1024 / 1024).toFixed(1)} MB — o limite é 5 MB.`
                  : undefined,
              );

              if (excedeu) event.target.value = "";
            }}
            className="w-full text-[13.5px] text-creme/60 file:mr-4 file:rounded-md file:border-0 file:bg-creme/10 file:px-4 file:py-2 file:text-[13px] file:text-creme hover:file:bg-creme/15 disabled:opacity-40"
          />
        )}
      </Field>
    </>
  );
}
