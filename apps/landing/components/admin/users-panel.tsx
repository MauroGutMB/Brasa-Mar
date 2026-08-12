"use client";

import { useActionState } from "react";

import type { AdminUser } from "@brasamar/db";
import { Button, Card, CardContent, Field, Input } from "@brasamar/ui";

import { FormMessage } from "@/components/admin/form-message";
import { Secao } from "@/components/admin/secao";
import { initialFormState } from "@/lib/actions/form-state";
import { createUserAction, deleteUserAction } from "@/lib/actions/users";
import { changePassword } from "@/lib/actions/auth";

export function UsersPanel({
  users,
  atualId,
}: {
  users: AdminUser[];
  atualId: string;
}) {
  const [estadoNovo, criar] = useActionState(createUserAction, initialFormState);
  const [estadoRemocao, remover] = useActionState(
    async (_estado: unknown, formData: FormData) => deleteUserAction(formData),
    initialFormState,
  );
  const [estadoSenha, trocarSenha] = useActionState(
    changePassword,
    initialFormState,
  );

  return (
    <div className="flex flex-col gap-12">
      <Secao titulo="Quem tem acesso">
        <ul className="flex flex-col gap-2.5">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-creme/12 bg-carvao-850 px-4 py-3.5"
            >
              <div>
                <p className="text-[14.5px] text-creme">
                  {user.name}
                  {user.id === atualId ? (
                    <span className="ml-2.5 rounded bg-creme/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-creme/50">
                      Você
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-[13px] text-creme/45">{user.email}</p>
              </div>

              {user.id === atualId ? null : (
                <form action={remover}>
                  <input type="hidden" name="id" value={user.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="normal-case tracking-normal"
                  >
                    Remover
                  </Button>
                </form>
              )}
            </li>
          ))}
        </ul>

        <FormMessage estado={estadoRemocao} />
      </Secao>

      <Secao titulo="Dar acesso a alguém">
        <Card>
          <CardContent className="p-6">
            <form action={criar} className="flex flex-col gap-5">
              <Field label="Nome" error={estadoNovo.errors?.name} required>
                {(props) => <Input {...props} name="name" required />}
              </Field>

              <Field label="E-mail" error={estadoNovo.errors?.email} required>
                {(props) => (
                  <Input {...props} name="email" type="email" required />
                )}
              </Field>

              <Field
                label="Senha"
                error={estadoNovo.errors?.password}
                hint="Mínimo de 8 caracteres. Combine com a pessoa — ela pode trocar depois de entrar."
                required
              >
                {(props) => (
                  <Input
                    {...props}
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                )}
              </Field>

              <FormMessage estado={estadoNovo} />

              <Button type="submit" className="self-start">
                Criar acesso
              </Button>
            </form>
          </CardContent>
        </Card>
      </Secao>

      <Secao titulo="Trocar a minha senha">
        <Card>
          <CardContent className="p-6">
            <form action={trocarSenha} className="flex flex-col gap-5">
              <Field
                label="Nova senha"
                error={estadoSenha.errors?.password}
                required
              >
                {(props) => (
                  <Input
                    {...props}
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                )}
              </Field>

              <Field
                label="Repita a nova senha"
                error={estadoSenha.errors?.confirm}
                required
              >
                {(props) => (
                  <Input
                    {...props}
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                )}
              </Field>

              <FormMessage estado={estadoSenha} />

              <Button type="submit" className="self-start">
                Trocar senha
              </Button>
            </form>
          </CardContent>
        </Card>
      </Secao>
    </div>
  );
}
