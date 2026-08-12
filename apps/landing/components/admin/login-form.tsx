"use client";

import { useActionState } from "react";

import { Button, Card, CardContent, Field, Input } from "@brasamar/ui";

import { signIn } from "@/lib/actions/auth";
import { initialFormState } from "@/lib/actions/form-state";
import { FormMessage } from "@/components/admin/form-message";

export function LoginForm({ proximo }: { proximo?: string }) {
  const [estado, action, pendente] = useActionState(signIn, initialFormState);

  return (
    <Card>
      <CardContent className="p-6">
        <form action={action} className="flex flex-col gap-5">
          {proximo ? <input type="hidden" name="proximo" value={proximo} /> : null}

          <Field label="E-mail" error={estado.errors?.email} required>
            {(props) => (
              <Input
                {...props}
                name="email"
                type="email"
                autoComplete="username"
                required
              />
            )}
          </Field>

          <Field label="Senha" error={estado.errors?.password} required>
            {(props) => (
              <Input
                {...props}
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            )}
          </Field>

          <FormMessage estado={estado} />

          <Button type="submit" disabled={pendente} className="w-full">
            {pendente ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
