"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import type { Dish } from "@brasamar/db";
import { slugify } from "@brasamar/db/validation";
import { Field, Input, Select, Textarea, Toggle } from "@brasamar/ui";

import { SaveBar } from "@/components/admin/save-bar";
import { Secao } from "@/components/admin/secao";
import { createDishAction, updateDishAction } from "@/lib/actions/dishes";
import { initialFormState } from "@/lib/actions/form-state";

const TAGS = [
  { value: "carnes", label: "Carnes" },
  { value: "mar", label: "Mar" },
  { value: "para-dividir", label: "Para dividir" },
];

/** Mesmo limite validado no servidor, em lib/storage.ts. */
const LIMITE_BYTES = 5 * 1024 * 1024;

/** Centavos → "89" / "89,50", que é como o campo aceita de volta. */
function precoParaCampo(priceCents: number): string {
  return (priceCents / 100).toFixed(2).replace(".", ",").replace(",00", "");
}

export function DishForm({ dish }: { dish?: Dish }) {
  const action = dish
    ? updateDishAction.bind(null, dish)
    : createDishAction;

  const [estado, formAction] = useActionState(action, initialFormState);

  // No prato novo, o endereço acompanha o nome até a pessoa mexer nele.
  const [slug, setSlug] = useState(dish?.slug ?? "");
  const [slugManual, setSlugManual] = useState(Boolean(dish));
  const [removerFoto, setRemoverFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState<string>();

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <Secao titulo="Prato">
        <Field label="Nome" error={estado.errors?.name} required>
          {(props) => (
            <Input
              {...props}
              name="name"
              defaultValue={dish?.name}
              onChange={(event) => {
                if (!slugManual) setSlug(slugify(event.target.value));
              }}
              required
            />
          )}
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Preço"
            error={estado.errors?.priceCents}
            hint="Só o valor, ex.: 89 ou 89,50."
            required
          >
            {(props) => (
              <Input
                {...props}
                name="priceCents"
                defaultValue={dish ? precoParaCampo(dish.priceCents) : ""}
                inputMode="decimal"
                placeholder="89"
                required
              />
            )}
          </Field>

          <Field label="Categoria" error={estado.errors?.tag} required>
            {(props) => (
              <Select {...props} name="tag" defaultValue={dish?.tag ?? "carnes"}>
                {TAGS.map((tag) => (
                  <option key={tag.value} value={tag.value}>
                    {tag.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <Field label="Descrição" error={estado.errors?.description} required>
          {(props) => (
            <Textarea
              {...props}
              name="description"
              defaultValue={dish?.description}
              rows={3}
              required
            />
          )}
        </Field>

        <Field
          label="Endereço interno"
          error={estado.errors?.slug}
          hint="Identifica o prato. Só letras minúsculas, números e hífens."
          required
        >
          {(props) => (
            <Input
              {...props}
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugManual(true);
                setSlug(event.target.value);
              }}
              required
            />
          )}
        </Field>

        <Toggle
          name="visible"
          defaultChecked={dish?.visible ?? true}
          label="Aparecer no site"
          hint="Desligue para esconder o prato sem apagar — útil quando o ingrediente acaba."
        />
      </Secao>

      <Secao titulo="Foto">
        {dish?.imageUrl ? (
          <div className="flex flex-wrap items-center gap-5">
            <div className="relative h-[110px] w-[160px] overflow-hidden rounded-md border border-creme/15">
              <Image
                src={dish.imageUrl}
                alt={dish.imageAlt || dish.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-[13.5px] text-creme/70">
              <input
                type="checkbox"
                name="remover-foto"
                checked={removerFoto}
                onChange={(event) => setRemoverFoto(event.target.checked)}
                className="size-4 accent-brasa-500"
              />
              Remover a foto atual
            </label>
          </div>
        ) : (
          <p className="text-[13.5px] text-creme/40">
            Sem foto — o card aparece com o placeholder tracejado.
          </p>
        )}

        <Field
          label={dish?.imageUrl ? "Trocar por outra foto" : "Enviar foto"}
          hint="JPG, PNG, WebP ou AVIF, até 5 MB. Fotos deitadas ficam melhores."
          error={erroFoto}
        >
          {(props) => (
            <input
              {...props}
              type="file"
              name="foto"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={removerFoto}
              onChange={(event) => {
                // Checagem no navegador para a pessoa não esperar o upload
                // inteiro só para receber "passou do limite".
                const arquivo = event.target.files?.[0];
                const excedeu = arquivo ? arquivo.size > LIMITE_BYTES : false;

                setErroFoto(
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

        <Field
          label="Descrição da foto"
          error={estado.errors?.imageAlt}
          hint="Lida por leitores de tela e usada pelo Google nas buscas por imagem."
        >
          {(props) => (
            <Input
              {...props}
              name="imageAlt"
              defaultValue={dish?.imageAlt}
              placeholder="Picanha fatiada na brasa"
            />
          )}
        </Field>
      </Secao>

      <SaveBar estado={estado} bloqueado={Boolean(erroFoto)} />
    </form>
  );
}
