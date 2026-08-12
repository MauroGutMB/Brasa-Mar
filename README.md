# Brasa e Mar — Monorepo

Monorepo do restaurante **Brasa e Mar** (frutos do mar na brasa), gerenciado com
[Turborepo](https://turborepo.dev) + [pnpm workspaces](https://pnpm.io/workspaces).

## Estrutura

```
BrasaMarWeb/
├── apps/
│   ├── landing/          # Landing page (Next.js 16, App Router, SSG, SEO local)
│   │   ├── app/          # rotas, layout e CSS global
│   │   ├── components/   # componentes específicos da landing
│   │   ├── lib/          # dados do site e utilitários (siteConfig, SEO)
│   │   ├── design/       # referência visual do Claude Design (não vai pro bundle)
│   │   └── public/       # imagens, og.jpg, favicon…
│   └── pedidos/          # 🚧 placeholder do futuro app de pedidos (ver README de lá)
├── packages/
│   ├── ui/               # componentes React + Tailwind compartilhados
│   │   └── src/          # Button, Card, Typography, cn()
│   └── config/           # configs compartilhadas
│       ├── eslint/       # base.mjs, next.mjs, react-library.mjs (flat config)
│       ├── tailwind/     # theme.css — cores, fontes e raios da marca
│       └── tsconfig/     # base.json, nextjs.json, react-library.json
├── pnpm-workspace.yaml
└── turbo.json
```

Os pacotes internos usam o prefixo `@brasamar/` e são consumidos via
`workspace:*` — nada é publicado no npm.

## Como rodar

Pré-requisitos: **Node 20+** e **pnpm 11** (`corepack enable` já resolve, o
`packageManager` está fixado no `package.json` da raiz).

```bash
pnpm install     # instala as dependências de todos os workspaces
pnpm dev         # sobe a landing em http://localhost:3000
```

Outros comandos, todos orquestrados pelo Turborepo a partir da raiz:

| Comando             | O que faz                                              |
| ------------------- | ------------------------------------------------------ |
| `pnpm dev`          | modo desenvolvimento (persistente, sem cache)          |
| `pnpm build`        | build de produção de todos os apps                     |
| `pnpm lint`         | ESLint em todos os workspaces                          |
| `pnpm check-types`  | `tsc --noEmit` em todos os workspaces                  |
| `pnpm clean`        | limpa artefatos de build e `node_modules`              |

Para rodar em um workspace específico:

```bash
pnpm --filter landing dev
pnpm --filter @brasamar/ui lint
```

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
  `areia-*`, `carvao-*`, `font-display`, `font-sans`, `rounded-brasa`,
  `shadow-brasa`, `shadow-mar`.
- **SSG**: a landing não usa APIs dinâmicas, então todas as rotas são
  pré-renderizadas no build (`○ Static`) — o melhor cenário para performance e
  SEO local.
- **SEO**: metadata (title com template, description, Open Graph, Twitter Card,
  robots, canonical) fica em `apps/landing/app/layout.tsx`, alimentada por
  `apps/landing/lib/site.ts`. Ajustar `NEXT_PUBLIC_SITE_URL` e os dados de
  contato/endereço antes do deploy; `sitemap.ts`, `robots.ts` e o JSON-LD de
  `Restaurant` entram em `app/` quando o conteúdo real for implementado.
- **`@brasamar/ui` sem build**: o pacote exporta TS/TSX direto e é transpilado
  pelo consumidor (`transpilePackages` no `next.config.ts`). Menos build, menos
  cache para invalidar.
- **`AGENTS.md` / `CLAUDE.md` em `apps/landing`**: gerados automaticamente pelo
  `next dev` a partir do Next 16; commitar mantém a árvore limpa.

## Próximos passos

1. Colocar o arquivo do Claude Design em `apps/landing/design/` e adaptar as
   seções para componentes em `apps/landing/components/sections/`.
2. Preencher `apps/landing/lib/site.ts` com telefone, endereço e horários reais.
3. Adicionar `sitemap.ts`, `robots.ts` e JSON-LD de negócio local.
4. Iniciar `apps/pedidos` reaproveitando `@brasamar/ui` e `@brasamar/config`.
