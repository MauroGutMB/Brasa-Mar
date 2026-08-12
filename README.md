# Brasa e Mar — Monorepo

Monorepo do restaurante **Brasa e Mar** (frutos do mar na brasa), gerenciado com
[Turborepo](https://turborepo.dev) + [pnpm workspaces](https://pnpm.io/workspaces).

A landing é pública e pré-renderizada; o conteúdo dela vem do Postgres e é
editado pelo dono em `/admin`, sem deploy.

## Estrutura

```
BrasaMarWeb/
├── apps/
│   ├── landing/          # Landing page + painel (Next.js 16, App Router)
│   │   ├── app/
│   │   │   ├── (site)/   # a landing pública, estática
│   │   │   └── (admin)/  # /admin/* — painel autenticado, dinâmico
│   │   ├── components/   # sections/, shared/ e admin/
│   │   ├── lib/          # data.ts (cache), site.ts (derivações), actions/, auth/
│   │   ├── scripts/      # criar-admin.ts
│   │   ├── design/       # referência visual do Claude Design (fora do bundle)
│   │   └── public/       # og.jpg, favicon…
│   └── pedidos/          # 🚧 placeholder do futuro app de pedidos
├── packages/
│   ├── db/               # schema Drizzle, queries, mutations, validação e seed
│   ├── ui/               # componentes React + Tailwind compartilhados
│   └── config/           # eslint/, tailwind/theme.css, tsconfig/
├── supabase/             # config do Supabase local (npx supabase start)
├── pnpm-workspace.yaml
└── turbo.json
```

Os pacotes internos usam o prefixo `@brasamar/` e são consumidos via
`workspace:*` — nada é publicado no npm.

## Como rodar

Pré-requisitos: **Node 20+**, **pnpm 11** (`corepack enable` resolve) e
**Docker** para o Supabase local.

```bash
pnpm install

# 1. Sobe Postgres, Auth e Storage locais e imprime as chaves
npx supabase start

# 2. Preencha os .env com as chaves do passo anterior
cp apps/landing/.env.example apps/landing/.env.local
cp packages/db/.env.example packages/db/.env

# 3. Cria as tabelas e popula com o conteúdo inicial
pnpm --filter @brasamar/db db:migrate
pnpm --filter @brasamar/db db:seed

# 4. Cria o primeiro acesso ao painel
pnpm --filter landing criar-admin "Seu Nome" voce@exemplo.com suaSenhaSegura

# 5. Sobe o site
pnpm dev
```

A landing fica em <http://localhost:3000> e o painel em
<http://localhost:3000/admin>.

Outros comandos, todos orquestrados pelo Turborepo a partir da raiz:

| Comando            | O que faz                                     |
| ------------------ | --------------------------------------------- |
| `pnpm dev`         | modo desenvolvimento (persistente, sem cache) |
| `pnpm build`       | build de produção de todos os apps            |
| `pnpm lint`        | ESLint em todos os workspaces                 |
| `pnpm check-types` | `tsc --noEmit` em todos os workspaces         |
| `pnpm clean`       | limpa artefatos de build e `node_modules`     |

No pacote de banco: `db:generate` (gera migration a partir do schema),
`db:migrate`, `db:seed` e `db:studio` (inspeciona as tabelas no navegador).

Para rodar em um workspace específico:

```bash
pnpm --filter landing dev
pnpm --filter @brasamar/ui lint
```

## O painel (`/admin`)

Todo o conteúdo do site é editável ali, e a mudança aparece na hora — sem
rebuild, sem deploy:

| Tela                | Edita                                                        |
| ------------------- | ------------------------------------------------------------ |
| Pratos              | criar, editar, apagar, reordenar, esconder, enviar fotos, ligar/desligar preços e gerenciar as categorias (nome e cor) |
| Identidade e SEO    | nome, textos do topo, observação do cardápio, fotos do hero, descrição, palavras-chave e imagem de compartilhamento |
| Buffet              | textos, ocasiões atendidas e diferenciais numerados          |
| Contato             | telefone do WhatsApp e e-mail                                |
| Local e horários    | endereço, coordenadas com prévia do mapa, horário de cada dia |
| Usuários            | quem entra no painel; todos com os mesmos poderes            |

Nos campos de texto livre valem três marcadores de destaque: `*palavra*` sai
laranja, `_palavra_` sai azul e `**palavra**` sai em negrito claro.

Só quem tem linha em `admin_users` entra — remover a pessoa ali corta o acesso
mesmo que o token dela ainda esteja válido.

## Decisões técnicas

- **TypeScript strict**: `strict: true` mais `noUncheckedIndexedAccess`,
  `noUnusedLocals` e `noUnusedParameters`, definidos em
  `packages/config/tsconfig/base.json`.
- **Tailwind CSS v4 (CSS-first)**: a v4 substituiu o `tailwind.config.js` por
  configuração em CSS. O tema base da marca vive em
  `packages/config/tailwind/theme.css` e é importado pelos apps:

  ```css
  @import "tailwindcss";
  @import "@brasamar/config/tailwind/theme.css";
  ```

  Tokens disponíveis: `brasa-*` (laranja de fogo), `mar-*` (azul-petróleo),
  `carvao-*`, `creme`, `font-display`, `font-sans`, `rounded-panel`,
  `rounded-frame`, `shadow-float`.
- **A landing continua pré-renderizada**, mesmo lendo do banco: as leituras
  ficam em escopos `use cache` com tag (`apps/landing/lib/data.ts`), e cada
  Server Action do painel chama `updateTag` depois de salvar. No `pnpm build`,
  `/` aparece como `○ Static`; se virar `ƒ`, algo saiu de dentro do cache.
- **Drizzle + Supabase**: Drizzle cuida do schema e das queries (tipos e
  migrations versionadas); `supabase-js` entra só para Auth e Storage.
- **RLS ligada e sem policy** em todas as tabelas: o acesso é sempre pelo
  servidor, então a chave anon não lê nem escreve nada.
- **Autorização é no servidor**: `proxy.ts` (o middleware do Next 16) faz só
  uma checagem otimista de cookie; quem decide é `requireAdmin()`, em
  `lib/auth/dal.ts`, chamado em toda página do painel e toda Server Action.
- **`@brasamar/ui` e `@brasamar/db` sem build**: exportam TS/TSX direto e são
  transpilados pelo consumidor (`transpilePackages` no `next.config.ts`).
- **`AGENTS.md` / `CLAUDE.md` em `apps/landing`**: gerados automaticamente pelo
  `next dev` a partir do Next 16 e mantidos fora do git.

## Deploy

Vercel para o site, Supabase para banco, login e fotos:

1. Criar o projeto no [Supabase](https://supabase.com) e pegar, em Project
   Settings, a URL da API, a chave anon, a service role key e as connection
   strings (direct na 5432 e pooler na 6543).
2. Rodar `db:migrate` e `db:seed` apontando para o banco de produção, com a
   string **direct** — é ela que aguenta criar tabelas. A migration já cria o
   bucket `fotos`.
3. Criar o primeiro acesso com `pnpm --filter landing criar-admin`.
4. Publicar na Vercel com **Root Directory = `apps/landing`** e as cinco
   variáveis de `apps/landing/.env.example`, usando a string do **pooler** no
   `DATABASE_URL`.
5. Com o domínio apontado, atualizar `NEXT_PUBLIC_SITE_URL` e redeployar — essa
   variável é gravada no site durante o build.
6. Corrigir endereço e coordenadas em `/admin/local`: os valores do seed vieram
   como placeholder do mockup.

Dois detalhes que economizam tempo: **o build precisa alcançar o banco** (com o
projeto do Supabase pausado, o deploy falha, não só o site sai do ar), e **o
build passa mesmo sem as variáveis do Supabase** — fica tudo verde e só o painel
e as fotos quebram depois.

> Projeto grátis do Supabase pausa depois de ~7 dias sem uso.

## Próximos passos

1. Colocar as fotos reais (pratos, hero e buffet) pelo painel e a `og.jpg` em
   `apps/landing/public/`.
2. Preencher endereço, CEP e coordenadas reais em `/admin/local`.
3. Iniciar `apps/pedidos` reaproveitando `@brasamar/ui`, `@brasamar/db` e
   `@brasamar/config`.
