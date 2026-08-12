"use client";

import { useActionState } from "react";

import { Button, Card, CardContent, Field, Input } from "@brasamar/ui";

import { signIn } from "@/lib/actions/auth";
import { initialFormState } from "@/lib/actions/form-state";
import { FormMessage } from "@/components/admin/form-message";

export interface LoginFormProps {
  proximo?: string;
  /** Entrou no Supabase Auth mas a conta não está liberada no painel. */
  semAcesso?: boolean;
}

export function LoginForm({ proximo, semAcesso = false }: LoginFormProps) {
  const [estado, action, pendente] = useActionState(signIn, initialFormState);

  return (
    <Card>
      <CardContent className="p-6">
        {semAcesso ? (
          <p
            role="status"
            className="mb-5 rounded-md border border-brasa-500/45 bg-brasa-500/10 px-3.5 py-2.5 text-[13.5px] leading-snug text-brasa-400"
          >
            Esta conta existe, mas ainda não tem acesso ao painel. Peça a quem
            administra o site para liberá-la em Usuários.
          </p>
        ) : null}

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
