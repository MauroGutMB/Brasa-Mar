import { Button, Card, CardContent, CardTitle, Eyebrow, Heading, Text } from "@brasamar/ui";

import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24">
      <Eyebrow>{siteConfig.tagline}</Eyebrow>

      <Heading level={1}>Hello {siteConfig.name}</Heading>

      <Text muted>
        Setup do monorepo funcionando: Turborepo + pnpm workspaces, Next.js com
        App Router e o tema Tailwind compartilhado de <code>@brasamar/config</code>.
        O conteúdo real da landing entra a partir do arquivo de design.
      </Text>

      <Card className="w-full">
        <CardContent className="flex flex-col gap-3 pt-6">
          <CardTitle>Componentes de @brasamar/ui</CardTitle>
          <Text muted className="text-sm">
            Botões, cards e tipografia vêm do pacote compartilhado — os mesmos
            serão reaproveitados no futuro app de pedidos.
          </Text>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button>Ver cardápio</Button>
            <Button variant="secondary">Reservar mesa</Button>
            <Button variant="ghost">Como chegar</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
