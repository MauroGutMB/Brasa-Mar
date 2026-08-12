# design/

Pasta de **referência visual** — nada daqui é compilado ou enviado ao bundle.

Coloque aqui os arquivos do Claude Design:

```
design/
├── Brasa e Mar - Landing.dc.html   # layout de referência
├── image-slot.js                   # componente de placeholder de imagem
└── support.js                      # helpers do preview do Claude Design
```

Fluxo de adaptação:

1. Ler o HTML e identificar as seções (hero, cardápio, sobre, localização…).
2. Transformar cada seção em um componente em `../components/sections/`.
3. Mover cores, fontes e raios recorrentes para o tema compartilhado em
   `packages/config/tailwind/theme.css` (em vez de hardcodar valores).
4. Substituir os slots de imagem por `next/image` com `alt` descritivo
   (importa para SEO e acessibilidade).
