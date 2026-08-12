# apps/pedidos — placeholder

> **Ainda não implementado.** Esta pasta existe apenas para reservar o lugar do
> futuro app de pedidos no monorepo.

## O que vai entrar aqui

O app de pedidos online do Brasa e Mar (carrinho, checkout, acompanhamento).
Diferente da landing — que é estática e focada em SEO — este app terá partes
dinâmicas e autenticadas.

## Quando for começar

1. Criar `apps/pedidos/package.json` com `"name": "pedidos"` (o
   `pnpm-workspace.yaml` já aponta para `apps/*`, então ele é detectado
   automaticamente).
2. Reaproveitar as configs compartilhadas:
   - `tsconfig.json` → `extends: "@brasamar/config/tsconfig/nextjs.json"`
   - `eslint.config.mjs` → `@brasamar/config/eslint/next`
   - `app/globals.css` → `@import "@brasamar/config/tailwind/theme.css"`
3. Adicionar `"@brasamar/ui": "workspace:*"` às dependências — botões, cards,
   tipografia e campos de formulário já estão prontos lá.
4. Adicionar `"@brasamar/db": "workspace:*"` e incluir os dois pacotes em
   `transpilePackages`. O schema dos pratos (com preço, categoria, foto e
   visibilidade) já existe e é o mesmo que o cardápio da landing usa — o app
   de pedidos lê dali em vez de duplicar.
5. Nenhuma mudança é necessária no `turbo.json`: as tasks `dev`, `build`,
   `lint` e `check-types` são aplicadas a todo workspace que as definir.
