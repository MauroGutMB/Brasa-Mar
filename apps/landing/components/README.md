# components/

Componentes **específicos deste app**. O que for genérico e reaproveitável pelo
futuro app de pedidos deve morar em `packages/ui`.

```
components/
├── sections/     # seções da landing: Hero, Dishes, Buffet, Location, header, footer
├── shared/       # peças pequenas da landing: ImageSlot, Logo, MobileNav, Rich, JSON-LD
└── admin/        # painel: formulários, lista de pratos, navegação, mensagens
```

Os componentes de `sections/` são **assíncronos**: leem de `@/lib/data`, que
envolve as queries em `use cache`. Não busque dado direto de `@brasamar/db`
aqui — isso tiraria a página do cache e ela deixaria de ser pré-renderizada.

Em `admin/` é o contrário: as telas leem direto de `@brasamar/db`, porque
precisam mostrar o que acabou de ser salvo, não o que está publicado.
