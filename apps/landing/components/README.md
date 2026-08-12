# components/

Componentes **específicos da landing page**. O que for genérico e reaproveitável
pelo futuro app de pedidos deve morar em `packages/ui`.

Organização sugerida conforme as seções forem sendo migradas do design:

```
components/
├── sections/     # Hero, Cardápio, Sobre, Localização, Contato…
└── shared/       # peças pequenas usadas só aqui (ImageSlot, ícones…)
```

Ao adaptar o arquivo Claude Design (`../design/`), cada seção do HTML vira um
componente em `sections/`, e o `image-slot.js` vira um componente React em
`shared/`.
