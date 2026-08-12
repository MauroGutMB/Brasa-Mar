import type { Metadata } from "next";

/**
 * Layout do grupo do painel.
 *
 * Fica separado do grupo `(site)` para o admin não herdar nada da landing —
 * e, principalmente, para o `noindex` valer em todas as telas de uma vez,
 * somando ao `Disallow: /admin` do robots.txt.
 */
export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

/**
 * O painel depende da sessão em toda tela, então não existe shell estático
 * para pré-renderizar — `instant = false` diz isso ao Cache Components em vez
 * de espalhar `<Suspense>` sem propósito. Fica no grupo `(admin)`, o ponto
 * mais baixo que cobre login e painel, para a landing continuar validando.
 */
export const instant = false;

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
