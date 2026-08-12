"use client";

import { useActionState, useState } from "react";

import type { DishCategory, DishWithCategory } from "@brasamar/db";
import { slugify } from "@brasamar/db/validation";
import { Field, Input, Select, Textarea, Toggle } from "@brasamar/ui";

import { PhotoField } from "@/components/admin/photo-field";
import { SaveBar } from "@/components/admin/save-bar";
import { Secao } from "@/components/admin/secao";
import { createDishAction, updateDishAction } from "@/lib/actions/dishes";
import { initialFormState } from "@/lib/actions/form-state";

/** Centavos → "89" / "89,50", que é como o campo aceita de volta. */
function precoParaCampo(priceCents: number): string {
  return (priceCents / 100).toFixed(2).replace(".", ",").replace(",00", "");
}

export interface DishFormProps {
  dish?: DishWithCategory;
  /** Opções do seletor — gerenciadas na lista de pratos. */
  categories: DishCategory[];
}

export function DishForm({ dish, categories }: DishFormProps) {
  const action = dish
    ? updateDishAction.bind(null, dish)
    : createDishAction;

  const [estado, formAction] = useActionState(action, initialFormState);

  // No prato novo, o endereço acompanha o nome até a pessoa mexer nele.
  const [slug, setSlug] = useState(dish?.slug ?? "");
  const [slugManual, setSlugManual] = useState(Boolean(dish));
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

          <Field
            label="Categoria"
            error={estado.errors?.categoryId}
            hint="Nome e cor se ajustam na lista de pratos."
            required
          >
            {(props) => (
              <Select
                {...props}
                name="categoryId"
                defaultValue={dish?.categoryId ?? categories[0]?.id}
                required
              >
                {categories.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.name}
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
        <PhotoField
          atual={dish?.imageUrl ?? null}
          vazio="Sem foto — o card aparece com o placeholder tracejado."
          onErro={setErroFoto}
        />

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
