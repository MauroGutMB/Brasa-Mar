# Brasa & Mar

Site institucional do restaurante **Brasa & Mar** — churrasco e frutos do mar,
em Teresina/PI.

A página é pública e pré-renderizada, feita para carregar rápido e aparecer bem
nas buscas locais. Todo o conteúdo dela — contato, endereço, horários, cardápio,
fotos e textos — vem do banco e é editado pelo próprio restaurante em `/admin`,
sem precisar de programador nem de novo deploy: o que é salvo no painel aparece
no site imediatamente.

---

## Tecnologias

| Camada | Escolha | Versão |
| --- | --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router, Cache Components) | 16.3 |
| Interface | React | 19.2 |
| Linguagem | TypeScript, em modo estrito | 5.9 |
| Estilo | [Tailwind CSS](https://tailwindcss.com) v4 (configuração em CSS) | 4.3 |
| Banco | PostgreSQL com [Drizzle ORM](https://orm.drizzle.team) | 0.44 |
| Auth e arquivos | [Supabase](https://supabase.com) (Auth + Storage) | 2.86 |
| Validação | [Zod](https://zod.dev) | 4.1 |
| Monorepo | [Turborepo](https://turborepo.dev) + [pnpm workspaces](https://pnpm.io/workspaces) | 2.10 |
| Qualidade | ESLint 9 (flat config) | 9.39 |

Requisitos: **Node 20+**, **pnpm 11** e **Docker** (só para o ambiente de
desenvolvimento).

### Organização

```
BrasaMarWeb/
├── apps/
│   ├── landing/          # site público + painel /admin
│   └── pedidos/          # reservado para o futuro app de pedidos
├── packages/
│   ├── db/               # schema, queries, validações e seed
│   ├── ui/               # componentes compartilhados
│   └── config/           # ESLint, TypeScript e tema da marca
└── supabase/             # configuração do ambiente local
```

---

## Como rodar

### Desenvolvimento

O ambiente local sobe um Supabase completo em Docker — banco, autenticação e
armazenamento de arquivos — separado de produção. Dá para editar, apagar e
testar à vontade sem tocar em dados reais.

```bash
# 1. Dependências
pnpm install

# 2. Sobe Postgres, Auth e Storage locais (imprime as chaves ao final)
npx supabase start

# 3. Configura o ambiente com as chaves do passo anterior
cp apps/landing/.env.example apps/landing/.env.local
cp packages/db/.env.example packages/db/.env

# 4. Cria as tabelas e carrega o conteúdo inicial
pnpm --filter @brasamar/db db:migrate
pnpm --filter @brasamar/db db:seed

# 5. Cria o primeiro acesso ao painel
pnpm --filter landing criar-admin "Seu Nome" voce@exemplo.com suaSenhaSegura

# 6. Sobe o site
pnpm dev
```

| Endereço | O que é |
| --- | --- |
| <http://localhost:3000> | o site |
| <http://localhost:3000/admin> | o painel |
| <http://127.0.0.1:54323> | banco de dados local, em interface visual |

`npx supabase stop` desliga o ambiente sem perder os dados.

### Comandos

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | modo desenvolvimento |
| `pnpm build` | build de produção |
| `pnpm lint` | ESLint em todos os pacotes |
| `pnpm check-types` | checagem de tipos em todos os pacotes |
| `pnpm clean` | limpa artefatos e dependências |

No pacote de banco (`pnpm --filter @brasamar/db`): `db:generate` cria uma
migration a partir do schema, `db:migrate` aplica, `db:seed` carrega o conteúdo
inicial e `db:studio` abre as tabelas no navegador.

Para um pacote específico: `pnpm --filter landing dev`.

Antes de subir mudanças: `pnpm lint && pnpm check-types && pnpm build`.

---

## Produção

O site roda na **Vercel** e o banco, a autenticação e as fotos ficam no
**Supabase**.

### 1. Criar o projeto no Supabase

Escolha a região **South America (São Paulo)** e guarde a senha do banco pedida
na criação — ela não pode ser vista depois, só redefinida.

Em seguida, colete estes valores:

| Onde, no painel do Supabase | Valor |
| --- | --- |
| Project Settings → API | Project URL |
| Project Settings → API | chave `anon` |
| Project Settings → API | chave `service_role` |
| Project Settings → Database | connection string **Direct** (porta 5432) |
| Project Settings → Database | connection string **Transaction pooler** (porta 6543) |

> A chave `service_role` tem acesso irrestrito ao banco. Ela só existe no
> servidor — nunca deve ir para o navegador nem ser compartilhada.

**As duas connection strings têm usos diferentes e não são intercambiáveis:**
a *direct* aguenta os comandos que criam e alteram tabelas, e é a que você usa
para preparar o banco; a do *pooler* é a que o site usa em produção, onde cada
visita pode cair num processo diferente.

### 2. Preparar o banco

Uma vez só, da sua máquina, apontando para o banco novo com a string **direct**:

```bash
export PROD_DB="postgresql://postgres:[SENHA]@db.xxxxx.supabase.co:5432/postgres"

DATABASE_URL="$PROD_DB" pnpm --filter @brasamar/db db:migrate
DATABASE_URL="$PROD_DB" pnpm --filter @brasamar/db db:seed
```

O `db:migrate` cria as tabelas, ativa a segurança em todas elas e prepara o
espaço de armazenamento das fotos. O `db:seed` carrega o conteúdo inicial e pode
ser executado novamente sem apagar fotos já enviadas.

### 3. Publicar na Vercel

1. Importe o repositório na Vercel.
2. Em **Root Directory**, aponte para **`apps/landing`** — é um monorepo, e sem
   isso a build tenta construir a raiz.
3. Cadastre as cinco variáveis de ambiente, marcando **Production** e
   **Preview**:

```
DATABASE_URL                   ← connection string do POOLER (6543)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL           ← endereço público do site
```

4. Faça o deploy.
5. Com o domínio apontado, atualize `NEXT_PUBLIC_SITE_URL` e **refaça o
   deploy** — variáveis `NEXT_PUBLIC_*` são gravadas no site durante a build, e
   mudá-las no painel não altera o que já foi publicado.

**Dois pontos que evitam diagnóstico difícil:**

- **A build precisa conseguir acessar o banco.** O conteúdo do site é lido do
  Postgres e gravado no HTML durante a construção. Com o projeto do Supabase
  pausado, o deploy falha — não é apenas o site que sai do ar.
- **A build passa mesmo sem as variáveis do Supabase**, sem nenhum aviso. O
  deploy fica verde, o site carrega, e só o painel e as fotos deixam de
  funcionar. Confira as cinco antes de publicar.

> O plano gratuito do Supabase pausa o projeto após cerca de 7 dias sem acesso
> ao banco. É só reativar no painel deles.

---

## Criar uma conta de administrador pelo Supabase

Este é o caminho para liberar o primeiro acesso ao `/admin` em produção, sem
precisar rodar nada pelo terminal.

São **dois passos, e os dois são obrigatórios**: criar a conta de acesso e
autorizá-la no painel. Uma conta que existe só no primeiro passo consegue
digitar a senha, mas recebe a mensagem *"Esta conta existe, mas ainda não tem
acesso ao painel"* — é essa segunda etapa que concede a permissão.

### Passo 1 — criar a conta de acesso

1. No painel do Supabase, vá em **Authentication → Users**.
2. Clique em **Add user → Create new user**.
3. Preencha o e-mail e uma senha com no mínimo 8 caracteres.
4. Marque **Auto Confirm User** — sem isso a conta fica aguardando confirmação
   por e-mail e o login não funciona.
5. Confirme. O usuário aparece na lista.
6. **Copie o UID** dele (a coluna `User UID`, algo como
   `2e41800c-f136-4b5f-96fd-dffa15911116`).

### Passo 2 — autorizar no painel

1. Vá em **SQL Editor** e clique em **New query**.
2. Cole o comando abaixo, trocando os três valores pelos seus:

```sql
insert into admin_users (id, email, name)
values (
  '2e41800c-f136-4b5f-96fd-dffa15911116',  -- o UID copiado no passo 1
  'dono@brasaemar.com.br',                 -- o mesmo e-mail do passo 1
  'Nome da Pessoa'                         -- como aparecerá no painel
);
```

3. Clique em **Run**. A resposta deve ser `Success. No rows returned`.

Pronto: acesse `https://seudominio.com.br/admin` e entre com esse e-mail e
senha.

> A partir daqui, **os próximos acessos são criados dentro do próprio painel**,
> em `/admin/usuarios` — não é preciso repetir este processo. Todos os usuários
> têm os mesmos poderes, inclusive o de liberar e remover outros.

### Se precisar remover um acesso

Remover a pessoa em `/admin/usuarios` já corta o acesso por completo. Fazendo
pelo Supabase, apague o usuário em **Authentication → Users**: a linha
correspondente em `admin_users` é removida junto.

### Se esquecer a senha

Em **Authentication → Users**, abra o usuário e use **Reset password**. Se
preferir definir a senha diretamente, o comando abaixo, rodado da sua máquina,
redefine a senha de uma conta existente:

```bash
pnpm --filter landing criar-admin "Nome da Pessoa" email@exemplo.com novaSenha
```

---

## O painel

| Tela | O que edita |
| --- | --- |
| **Pratos** | criar, editar, apagar, reordenar e esconder pratos; enviar fotos; mostrar ou ocultar os preços; gerenciar as categorias, com nome e cor |
| **Identidade e SEO** | nome, textos do topo, fotos principais, descrição para buscadores, palavras-chave e imagem de compartilhamento |
| **Buffet** | textos da seção de eventos, ocasiões atendidas e diferenciais |
| **Contato** | telefone do WhatsApp e e-mail |
| **Local e horários** | endereço, localização no mapa e horário de cada dia da semana |
| **Usuários** | quem tem acesso ao painel |

Nos campos de texto livre, três marcações criam destaque: `*palavra*` fica
laranja, `_palavra_` fica azul e `**palavra**` fica em negrito.

Fotos aceitas: JPG, PNG, WebP ou AVIF, até 5 MB.

---

## Créditos

Desenvolvido por **Mauro Gutemberg Magalhães Barros** para o restaurante
**Brasa & Mar**.
