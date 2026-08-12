/**
 * Cria o primeiro usuário do painel.
 *
 * Só é necessário uma vez: a partir daí os acessos são criados dentro do
 * próprio admin, em /admin/usuarios. Também serve para recuperar o acesso se
 * o último usuário for removido por engano.
 *
 *   pnpm --filter landing criar-admin "Nome" email@exemplo.com senhaSegura
 *
 * Lê as variáveis de .env.local — inclusive a SUPABASE_SERVICE_ROLE_KEY, que
 * é o que permite criar usuário sem estar logado.
 */

import { createAdminUser, getAdminUser, sql } from "@brasamar/db";
import { createClient } from "@supabase/supabase-js";

function obrigatorio(nome: string): string {
  const valor = process.env[nome];

  if (!valor) {
    console.error(`Falta a variável ${nome}. Veja .env.example.`);
    process.exit(1);
  }

  return valor;
}

async function main(): Promise<void> {
  const [nome, email, senha] = process.argv.slice(2);

  if (!nome || !email || !senha) {
    console.error(
      'Uso: pnpm --filter landing criar-admin "Nome Sobrenome" email@exemplo.com senha',
    );
    process.exit(1);
  }

  if (senha.length < 8) {
    console.error("A senha precisa de pelo menos 8 caracteres.");
    process.exit(1);
  }

  const supabase = createClient(
    obrigatorio("NEXT_PUBLIC_SUPABASE_URL"),
    obrigatorio("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // Se a conta já existe no Auth, reaproveita em vez de falhar — é o caso de
  // quem perdeu a linha em admin_users e está recuperando o acesso.
  const { data: existentes } = await supabase.auth.admin.listUsers();
  const jaExiste = existentes?.users.find((user) => user.email === email);

  let id = jaExiste?.id;

  if (id) {
    console.warn(`Usuário ${email} já existe no Auth; atualizando a senha.`);
    await supabase.auth.admin.updateUserById(id, { password: senha });
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    if (error ?? !data.user) {
      console.error("Falha ao criar no Supabase Auth:", error?.message);
      process.exit(1);
    }

    id = data.user.id;
  }

  if (await getAdminUser(id)) {
    console.warn(`${email} já tinha acesso ao painel. Senha atualizada.`);
  } else {
    await createAdminUser({ id, email, name: nome });
    console.warn(`Pronto: ${email} agora entra em /admin.`);
  }

  await sql.end();
}

main().catch((erro: unknown) => {
  console.error(erro);
  process.exit(1);
});
