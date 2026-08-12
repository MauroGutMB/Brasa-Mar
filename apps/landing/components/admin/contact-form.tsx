"use client";

import { useActionState } from "react";

import type { SiteSettings } from "@brasamar/db";
import { Field, Input } from "@brasamar/ui";

import { SaveBar } from "@/components/admin/save-bar";
import { initialFormState } from "@/lib/actions/form-state";
import { saveContact } from "@/lib/actions/settings";

export function ContactForm({ settings }: { settings: SiteSettings }) {
  const [estado, action] = useActionState(saveContact, initialFormState);

  return (
    <form action={action} className="flex flex-col gap-6">
      <Field
        label="Telefone / WhatsApp"
        error={estado.errors?.phone}
        hint="Com DDD. O link do WhatsApp é montado a partir daqui."
        required
      >
        {(props) => (
          <Input
            {...props}
            name="phone"
            defaultValue={settings.phone}
            placeholder="86 99999-0000"
            required
          />
        )}
      </Field>

      <Field
        label="E-mail"
        error={estado.errors?.email}
        hint="Opcional. Aparece nos dados do Google, não no site."
      >
        {(props) => (
          <Input
            {...props}
            name="email"
            type="email"
            defaultValue={settings.email}
            placeholder="contato@brasaemar.com.br"
          />
        )}
      </Field>

      <SaveBar estado={estado} />
    </form>
  );
}
