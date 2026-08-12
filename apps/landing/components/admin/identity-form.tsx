"use client";

import { useActionState } from "react";

import type { SiteSettings } from "@brasamar/db";
import { Field, Input, Textarea, Toggle } from "@brasamar/ui";

import { SaveBar } from "@/components/admin/save-bar";
import { Secao } from "@/components/admin/secao";
import { initialFormState } from "@/lib/actions/form-state";
import { saveIdentity } from "@/lib/actions/settings";

const AJUDA_MARCADORES =
  "Destaques: *palavra* fica laranja, _palavra_ fica azul, **palavra** fica em negrito claro.";

export function IdentityForm({ settings }: { settings: SiteSettings }) {
  const [estado, action] = useActionState(saveIdentity, initialFormState);

  return (
    <form action={action} className="flex flex-col gap-10">
      <Secao titulo="Identidade">
        <Field label="Nome do restaurante" error={estado.errors?.name} required>
          {(props) => (
            <Input {...props} name="name" defaultValue={settings.name} required />
          )}
        </Field>

        <Field
          label="Assinatura"
          error={estado.errors?.tagline}
          hint="Vem logo depois do nome na aba do navegador e no compartilhamento."
          required
        >
          {(props) => (
            <Input
              {...props}
              name="tagline"
              defaultValue={settings.tagline}
              required
            />
          )}
        </Field>

        <Field
          label="Linha de apoio da marca"
          error={estado.errors?.kicker}
          hint="O texto pequeno embaixo de BRASA & MAR, no topo e no rodapé."
          required
        >
          {(props) => (
            <Input {...props} name="kicker" defaultValue={settings.kicker} required />
          )}
        </Field>
      </Secao>

      <Secao titulo="Topo do site">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Título — primeira linha"
            error={estado.errors?.heroTitleLine1}
            required
          >
            {(props) => (
              <Input
                {...props}
                name="heroTitleLine1"
                defaultValue={settings.heroTitleLine1}
                required
              />
            )}
          </Field>

          <Field
            label="Título — segunda linha"
            error={estado.errors?.heroTitleLine2}
            hint={AJUDA_MARCADORES}
            required
          >
            {(props) => (
              <Input
                {...props}
                name="heroTitleLine2"
                defaultValue={settings.heroTitleLine2}
                required
              />
            )}
          </Field>
        </div>

        <Field
          label="Selo acima do título"
          error={estado.errors?.heroBadge}
          required
        >
          {(props) => (
            <Input
              {...props}
              name="heroBadge"
              defaultValue={settings.heroBadge}
              required
            />
          )}
        </Field>

        <Field
          label="Texto de apresentação"
          error={estado.errors?.heroText}
          required
        >
          {(props) => (
            <Textarea
              {...props}
              name="heroText"
              defaultValue={settings.heroText}
              rows={3}
              required
            />
          )}
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Foto principal (URL)"
            error={estado.errors?.heroImageUrl}
            hint="Deixe vazio para manter o placeholder tracejado."
          >
            {(props) => (
              <Input
                {...props}
                name="heroImageUrl"
                defaultValue={settings.heroImageUrl ?? ""}
                placeholder="https://…"
              />
            )}
          </Field>

          <Field
            label="Descrição da foto principal"
            error={estado.errors?.heroImageAlt}
            hint="Lida por leitores de tela e pelo Google."
            required
          >
            {(props) => (
              <Input
                {...props}
                name="heroImageAlt"
                defaultValue={settings.heroImageAlt}
                required
              />
            )}
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Foto secundária (URL)"
            error={estado.errors?.heroSecondaryImageUrl}
          >
            {(props) => (
              <Input
                {...props}
                name="heroSecondaryImageUrl"
                defaultValue={settings.heroSecondaryImageUrl ?? ""}
                placeholder="https://…"
              />
            )}
          </Field>

          <Field
            label="Descrição da foto secundária"
            error={estado.errors?.heroSecondaryImageAlt}
            required
          >
            {(props) => (
              <Input
                {...props}
                name="heroSecondaryImageAlt"
                defaultValue={settings.heroSecondaryImageAlt}
                required
              />
            )}
          </Field>
        </div>
      </Secao>

      <Secao titulo="Cardápio">
        <Field
          label="Observação do cardápio"
          error={estado.errors?.dishesNote}
          hint="Aparece ao lado do título “Pratos da casa”. Deixe vazio para esconder."
        >
          {(props) => (
            <Textarea
              {...props}
              name="dishesNote"
              defaultValue={settings.dishesNote}
              rows={2}
            />
          )}
        </Field>

        <Toggle
          name="showPrices"
          defaultChecked={settings.showPrices}
          label="Mostrar preços no cardápio"
          hint="Desligando, os valores somem de todos os pratos de uma vez."
        />
      </Secao>

      <Secao titulo="Busca e compartilhamento">
        <Field
          label="Descrição do site"
          error={estado.errors?.description}
          hint="É o texto que aparece embaixo do link no Google e no WhatsApp. Entre 120 e 160 caracteres funciona melhor."
          required
        >
          {(props) => (
            <Textarea
              {...props}
              name="description"
              defaultValue={settings.description}
              rows={3}
              required
            />
          )}
        </Field>

        <Field
          label="Palavras-chave"
          error={estado.errors?.seoKeywords}
          hint="Separadas por vírgula."
        >
          {(props) => (
            <Textarea
              {...props}
              name="seoKeywords"
              defaultValue={settings.seoKeywords.join(", ")}
              rows={2}
            />
          )}
        </Field>

        <Field
          label="Imagem de compartilhamento"
          error={estado.errors?.ogImageUrl}
          hint="A imagem que aparece ao mandar o link no WhatsApp. Ideal 1200×630."
          required
        >
          {(props) => (
            <Input
              {...props}
              name="ogImageUrl"
              defaultValue={settings.ogImageUrl}
              required
            />
          )}
        </Field>
      </Secao>

      <SaveBar estado={estado} />
    </form>
  );
}
