import Link from "next/link";

import { getAllDishes } from "@brasamar/db";
import { Card, CardContent, Heading, Text } from "@brasamar/ui";

import { requireAdmin } from "@/lib/auth/dal";
import { getSettings } from "@/lib/data";

const atalhos = [
  {
    href: "/admin/pratos",
    titulo: "Pratos",
    descricao: "Adicionar, esconder, reordenar e trocar fotos do cardápio.",
  },
  {
    href: "/admin/contato",
    titulo: "Contato",
    descricao: "Telefone do WhatsApp e e-mail.",
  },
  {
    href: "/admin/local",
    titulo: "Local e horários",
    descricao: "Endereço, ponto no mapa e horário de cada dia.",
  },
  {
    href: "/admin/identidade",
    titulo: "Identidade e SEO",
    descricao: "Textos do topo, palavras-chave e imagem de compartilhamento.",
  },
  {
    href: "/admin/buffet",
    titulo: "Buffet",
    descricao: "Textos, ocasiões atendidas e diferenciais.",
  },
  {
    href: "/admin/usuarios",
    titulo: "Usuários",
    descricao: "Quem pode entrar neste painel.",
  },
];

/** Espera a sessão antes de renderizar; ver o layout do painel. */
export const instant = false;

export default async function AdminHomePage() {
  const user = await requireAdmin();
  const [settings, dishes] = await Promise.all([getSettings(), getAllDishes()]);

  const visiveis = dishes.filter((dish) => dish.visible).length;
  const semFoto = dishes.filter((dish) => !dish.imageUrl).length;

  return (
    <div className="flex flex-col gap-9">
      <div>
        <Heading level={2} className="text-[clamp(1.75rem,3vw,2.25rem)]">
          Olá, {user.name.split(" ")[0]}
        </Heading>
        <Text muted className="mt-2.5 text-[15px]">
          O que você editar aqui aparece no site na hora, sem precisar de
          publicação.
        </Text>
      </div>

      <Card>
        <CardContent className="grid gap-6 p-6 sm:grid-cols-3">
          <Resumo valor={String(dishes.length)} rotulo="pratos cadastrados" />
          <Resumo valor={String(visiveis)} rotulo="aparecendo no site" />
          <Resumo
            valor={settings.showPrices ? "Sim" : "Não"}
            rotulo="mostrando preços"
          />
        </CardContent>
      </Card>

      {semFoto > 0 ? (
        <p className="rounded-md border border-brasa-500/35 bg-brasa-500/8 px-4 py-3 text-[13.5px] text-brasa-400">
          {semFoto === 1
            ? "1 prato ainda está sem foto e aparece com o placeholder tracejado."
            : `${semFoto} pratos ainda estão sem foto e aparecem com o placeholder tracejado.`}{" "}
          <Link href="/admin/pratos" className="underline">
            Enviar fotos
          </Link>
        </p>
      ) : null}

      <ul className="grid gap-3.5 sm:grid-cols-2">
        {atalhos.map((atalho) => (
          <li key={atalho.href}>
            <Link href={atalho.href} className="block text-inherit">
              <Card className="h-full transition-colors hover:border-brasa-500/50">
                <CardContent className="p-5">
                  <p className="text-[15px] font-semibold text-creme">
                    {atalho.titulo}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-snug text-creme/50">
                    {atalho.descricao}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Resumo({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div>
      <p className="font-display text-[30px] leading-none text-creme">
        {valor}
      </p>
      <p className="mt-2 text-[11.5px] uppercase tracking-[0.18em] text-creme/45">
        {rotulo}
      </p>
    </div>
  );
}
