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
inicial, `db:studio` abre as tabelas no navegador e `db:check` testa a conexão.

`db:migrate` e `db:seed` verificam a conexão antes de começar e explicam o
motivo quando ela falha — banco desligado, endereço errado ou senha recusada.

Para um pacote específico: `pnpm --filter landing dev`.

Antes de subir mudanças: `pnpm lint && pnpm check-types && pnpm build`.

---

## Produção

O site roda na **Vercel** e o banco, a autenticação e as fotos ficam no
**Supabase**. Nada no código é específico dessas plataformas: a Vercel entra
como um lugar que executa Next.js, e o Supabase é um Postgres com autenticação
e armazenamento de arquivos por cima.

**Como está configurado:**

- **Publicação** — a aplicação é a pasta `apps/landing` do monorepo, e é ela que
  a Vercel constrói (`Root Directory`). Cada envio para a branch principal gera
  um novo deploy.
- **Conteúdo pré-renderizado** — o conteúdo do site é lido do banco durante a
  build e gravado no HTML, então a página não consulta o Postgres a cada visita.
  Como consequência, **a build precisa ter acesso ao banco**.
- **Atualização sem deploy** — o que o restaurante salva no painel invalida
  apenas a parte afetada do conteúdo e aparece no site imediatamente, sem nova
  publicação.
- **Banco** — a aplicação se conecta pelo *transaction pooler* do Supabase, que
  divide poucas conexões entre muitas requisições. Migrations e carga inicial
  usam a conexão direta. Fora do ambiente local, o SSL é exigido
  automaticamente.
- **Segurança dos dados** — todas as tabelas têm *row level security* ativa e
  sem políticas de acesso: só o servidor da aplicação lê e escreve, usando a
  connection string. A chave `service_role` nunca chega ao navegador.
- **Acesso ao painel** — depende de dois requisitos simultâneos: sessão válida
  no Supabase Auth **e** registro na tabela de administradores. Remover a pessoa
  do painel corta o acesso mesmo com a sessão ainda válida.
- **Fotos** — ficam num bucket público do Supabase Storage, enviadas apenas pelo
  servidor e entregues otimizadas pelo Next.js.

### Variáveis de ambiente

| Variável | Para que serve |
| --- | --- |
| `DATABASE_URL` | conexão com o Postgres |
| `NEXT_PUBLIC_SUPABASE_URL` | endereço da API do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave pública, usada no login |
| `SUPABASE_SERVICE_ROLE_KEY` | chave privada, usada no envio de fotos e na gestão de usuários |
| `NEXT_PUBLIC_SITE_URL` | endereço público do site |

As três primeiras e a última vêm do projeto no Supabase; `NEXT_PUBLIC_SITE_URL`
é o domínio final. As variáveis com prefixo `NEXT_PUBLIC_` são gravadas no site
durante a build — alterá-las exige uma nova publicação.

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
