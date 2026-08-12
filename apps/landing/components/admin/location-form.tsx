"use client";

import { useActionState, useState } from "react";

import type { SiteSettings } from "@brasamar/db";
import { Field, Input } from "@brasamar/ui";

import { SaveBar } from "@/components/admin/save-bar";
import { initialFormState } from "@/lib/actions/form-state";
import { saveLocation } from "@/lib/actions/settings";
import { mapEmbedUrl } from "@/lib/site";

export function LocationForm({ settings }: { settings: SiteSettings }) {
  const [estado, action] = useActionState(saveLocation, initialFormState);

  // O mapa acompanha o que está sendo digitado: sem isso não há como saber se
  // as coordenadas apontam para o lugar certo antes de salvar.
  const [lat, setLat] = useState(String(settings.lat));
  const [lng, setLng] = useState(String(settings.lng));

  const coordenadasValidas =
    Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-[2fr_1fr]">
        <Field label="Rua / avenida" error={estado.errors?.street} required>
          {(props) => (
            <Input {...props} name="street" defaultValue={settings.street} required />
          )}
        </Field>

        <Field label="Número" error={estado.errors?.number} required>
          {(props) => (
            <Input {...props} name="number" defaultValue={settings.number} required />
          )}
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Bairro" error={estado.errors?.district} required>
          {(props) => (
            <Input
              {...props}
              name="district"
              defaultValue={settings.district}
              required
            />
          )}
        </Field>

        <Field label="CEP" error={estado.errors?.zip} hint="Opcional.">
          {(props) => (
            <Input
              {...props}
              name="zip"
              defaultValue={settings.zip}
              placeholder="64000-000"
            />
          )}
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-[2fr_1fr]">
        <Field label="Cidade" error={estado.errors?.city} required>
          {(props) => (
            <Input {...props} name="city" defaultValue={settings.city} required />
          )}
        </Field>

        <Field label="Estado" error={estado.errors?.state} hint="Sigla, ex.: PI" required>
          {(props) => (
            <Input
              {...props}
              name="state"
              defaultValue={settings.state}
              maxLength={2}
              required
            />
          )}
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Latitude"
          error={estado.errors?.lat}
          hint="No Google Maps: clique com o botão direito no local e copie os números."
          required
        >
          {(props) => (
            <Input
              {...props}
              name="lat"
              value={lat}
              onChange={(event) => setLat(event.target.value)}
              inputMode="decimal"
              required
            />
          )}
        </Field>

        <Field label="Longitude" error={estado.errors?.lng} required>
          {(props) => (
            <Input
              {...props}
              name="lng"
              value={lng}
              onChange={(event) => setLng(event.target.value)}
              inputMode="decimal"
              required
            />
          )}
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-creme/50">
          Prévia do mapa
        </p>
        {coordenadasValidas ? (
          <iframe
            title="Prévia do mapa com as coordenadas informadas"
            src={mapEmbedUrl({ lat: Number(lat), lng: Number(lng) })}
            className="h-[260px] w-full rounded-md border border-creme/15"
          />
        ) : (
          <p className="rounded-md border border-creme/15 px-3.5 py-6 text-center text-[13.5px] text-creme/40">
            Informe latitude e longitude para ver o mapa.
          </p>
        )}
      </div>

      <Field
        label="Aviso sobre o local"
        error={estado.errors?.locationNote}
        hint="Aparece na plaquinha sobre o mapa. Deixe vazio para esconder."
      >
        {(props) => (
          <Input
            {...props}
            name="locationNote"
            defaultValue={settings.locationNote}
            placeholder="Estacionamento na frente · Delivery na região"
          />
        )}
      </Field>

      <SaveBar estado={estado} />
    </form>
  );
}
