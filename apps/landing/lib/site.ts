/**
 * Dados canônicos do restaurante, usados por metadata de SEO e (futuramente)
 * por JSON-LD de negócio local. Ajustar aqui e refletir no site inteiro.
 */
export const siteConfig = {
  name: "Brasa e Mar",
  tagline: "Frutos do mar na brasa",
  description:
    "Restaurante de frutos do mar grelhados na brasa: peixes frescos do dia, mariscos, camarão e carta de vinhos. Ambiente à beira-mar, ideal para almoços em família e jantares.",
  /** Trocar pelo domínio definitivo antes do deploy. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brasaemar.com.br",
  locale: "pt_BR",
  ogImage: "/og.jpg",
  /** Preencher com os dados reais do restaurante (SEO local). */
  contato: {
    telefone: "",
    whatsapp: "",
    email: "",
  },
  endereco: {
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
