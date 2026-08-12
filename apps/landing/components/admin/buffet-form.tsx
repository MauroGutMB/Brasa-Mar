"use client";

import { useActionState, useState } from "react";

import type { SiteSettings } from "@brasamar/db";
import { Field, Input, Textarea } from "@brasamar/ui";

import { PhotoField } from "@/components/admin/photo-field";
import { SaveBar } from "@/components/admin/save-bar";
import { Secao } from "@/components/admin/secao";
import { initialFormState } from "@/lib/actions/form-state";
import { saveBuffet } from "@/lib/actions/settings";

const AJUDA_MARCADORES =
  "Destaques: *palavra* fica laranja, **palavra** fica em negrito claro.";

export function BuffetForm({ settings }: { settings: SiteSettings }) {
  const [estado, action] = useActionState(saveBuffet, initialFormState);
  const [erroFoto, setErroFoto] = useState<string>();

  return (
    <form action={action} className="flex flex-col gap-10">
      <Secao titulo="Textos">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Linha acima do título"
            error={estado.errors?.buffetEyebrow}
            required
          >
            {(props) => (
              <Input
                {...props}
                name="buffetEyebrow"
                defaultValue={settings.buffetEyebrow}
                required
              />
            )}
          </Field>

          <Field
            label="Faixa azul"
            error={estado.errors?.buffetBadge}
            required
          >
            {(props) => (
              <Input
                {...props}
                name="buffetBadge"
                defaultValue={settings.buffetBadge}
                required
              />
            )}
          </Field>
        </div>

        <Field
          label="Texto principal"
          error={estado.errors?.buffetText}
          hint={AJUDA_MARCADORES}
          required
        >
          {(props) => (
            <Textarea
              {...props}
              name="buffetText"
              defaultValue={settings.buffetText}
              rows={4}
              required
            />
          )}
        </Field>

        <Field
          label="Chamada acima dos diferenciais"
          error={estado.errors?.buffetFeaturesIntro}
          hint={AJUDA_MARCADORES}
        >
          {(props) => (
            <Input
              {...props}
              name="buffetFeaturesIntro"
              defaultValue={settings.buffetFeaturesIntro}
            />
          )}
        </Field>

        <Field
          label="Frase de encerramento"
          error={estado.errors?.buffetClosing}
          hint={AJUDA_MARCADORES}
        >
          {(props) => (
            <Textarea
              {...props}
              name="buffetClosing"
              defaultValue={settings.buffetClosing}
              rows={2}
            />
          )}
        </Field>
      </Secao>

      <Secao titulo="Listas">
        <Field
          label="Ocasiões atendidas"
          error={estado.errors?.occasions}
          hint="Uma por linha. Viram as etiquetas arredondadas."
        >
          {(props) => (
            <Textarea
              {...props}
              name="occasions"
              defaultValue={settings.buffetOccasions
                .map((item) => item.label)
                .join("\n")}
              rows={6}
            />
          )}
        </Field>

        <Field
          label="Diferenciais"
          error={estado.errors?.features}
          hint="Uma por linha. A numeração romana (I, II, III…) é aplicada na ordem em que estiverem aqui."
        >
          {(props) => (
            <Textarea
              {...props}
              name="features"
              defaultValue={settings.buffetFeatures
                .map((item) => item.title)
                .join("\n")}
              rows={6}
            />
          )}
        </Field>
      </Secao>

      <Secao titulo="Foto">
        <PhotoField atual={settings.buffetImageUrl} onErro={setErroFoto} />

        <Field
          label="Descrição da foto"
          error={estado.errors?.buffetImageAlt}
          hint="Lida por leitores de tela e usada pelo Google nas buscas por imagem."
          required
        >
          {(props) => (
            <Input
              {...props}
              name="buffetImageAlt"
              defaultValue={settings.buffetImageAlt}
              required
            />
          )}
        </Field>
      </Secao>

      <SaveBar estado={estado} bloqueado={Boolean(erroFoto)} />
    </form>
  );
}
