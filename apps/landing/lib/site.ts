/**
 * Dados canônicos do restaurante.
 *
 * Na Fase 2 estes valores passam a vir do Postgres (e a ser editáveis pelo
 * painel de admin); os tipos aqui já espelham o schema que vai existir, para
 * a troca ser só de origem dos dados.
 */

export const siteConfig = {
  name: "Brasa & Mar",
  tagline: "Churrasco & frutos do mar",
  kicker: "Ponto de alimentação",
  description:
    "Churrasco na brasa e frutos do mar frescos em Teresina. Carnes no ponto certo, camarão, peixes e moqueca, com buffet completo para eventos.",
  /** Trocar pelo domínio definitivo antes do deploy. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brasaemar.com.br",
  locale: "pt_BR",
  ogImage: "/og.jpg",
  /** Vira coluna em site_settings na Fase 2. */
  showPrices: true,
} as const;

export const contact = {
  phone: "86 99437-0852",
  email: "",
} as const;

/** Link do WhatsApp derivado do telefone — não guardar duplicado. */
export const whatsappLink = `https://wa.me/55${contact.phone.replace(/\D/g, "")}`;

/**
 * TODO(admin): endereço e coordenadas vieram como placeholder do mockup.
 * Passam a ser editáveis em /admin/local na Fase 4.
 */
export const address = {
  street: "Av. Principal",
  number: "000",
  district: "Centro",
  city: "Teresina",
  state: "PI",
  zip: "",
  lat: -5.089,
  lng: -42.801,
} as const;

export const addressLine = `${address.street}, ${address.number} — ${address.district}`;
export const cityLine = `${address.city} — ${address.state}`;

/** bbox de ~0.08° em volta do ponto, como no mockup. */
export const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
  address.lng - 0.042
}%2C${address.lat - 0.027}%2C${address.lng + 0.042}%2C${
  address.lat + 0.033
}&layer=mapnik&marker=${address.lat}%2C${address.lng}`;

export interface OpeningHour {
  /** 0 = domingo … 6 = sábado, igual a Date#getDay. */
  weekday: number;
  label: string;
  opensAt: string;
  closesAt: string;
  closed: boolean;
}

export const openingHours: OpeningHour[] = [
  { weekday: 1, label: "Segunda", opensAt: "", closesAt: "", closed: true },
  { weekday: 2, label: "Terça", opensAt: "11:00", closesAt: "22:00", closed: false },
  { weekday: 3, label: "Quarta", opensAt: "11:00", closesAt: "22:00", closed: false },
  { weekday: 4, label: "Quinta", opensAt: "11:00", closesAt: "22:00", closed: false },
  { weekday: 5, label: "Sexta", opensAt: "11:00", closesAt: "22:00", closed: false },
  { weekday: 6, label: "Sábado", opensAt: "11:00", closesAt: "23:00", closed: false },
  { weekday: 0, label: "Domingo", opensAt: "11:00", closesAt: "23:00", closed: false },
];

/** Resumo mostrado no hero e agrupamento da seção de localização. */
export const hoursSummary = { range: "11h — 23h", days: "Terça a domingo" } as const;

export const hoursGroups = [
  { days: "Terça a sexta", hours: "11h — 22h", closed: false },
  { days: "Sábado e domingo", hours: "11h — 23h", closed: false },
  { days: "Segunda", hours: "Fechado", closed: true },
] as const;

export type DishTag = "carnes" | "mar" | "para-dividir";

export interface Dish {
  slug: string;
  name: string;
  priceCents: number;
  description: string;
  tag: DishTag;
  imageUrl: string | null;
  imageAlt: string;
}

export const dishTagLabels: Record<DishTag, string> = {
  carnes: "Carnes",
  mar: "Mar",
  "para-dividir": "Para dividir",
};

export const dishes: Dish[] = [
  {
    slug: "picanha-na-brasa",
    name: "Picanha na Brasa",
    priceCents: 8900,
    description:
      "Picanha fatiada no ponto, farofa de alho, vinagrete e pão de alho.",
    tag: "carnes",
    imageUrl: null,
    imageAlt: "Picanha fatiada na brasa",
  },
  {
    slug: "camarao-ao-alho",
    name: "Camarão ao Alho",
    priceCents: 7600,
    description:
      "Camarões salteados na manteiga de garrafa com limão e arroz cremoso.",
    tag: "mar",
    imageUrl: null,
    imageAlt: "Camarão ao alho com arroz cremoso",
  },
  {
    slug: "costela-no-bafo",
    name: "Costela no Bafo",
    priceCents: 8200,
    description:
      "Doze horas de brasa lenta, mandioca frita e molho de pimenta da casa.",
    tag: "carnes",
    imageUrl: null,
    imageAlt: "Costela assada no bafo com mandioca frita",
  },
  {
    slug: "peixe-na-telha",
    name: "Peixe na Telha",
    priceCents: 6800,
    description:
      "Filé grelhado com legumes, purê de macaxeira e molho de maracujá.",
    tag: "mar",
    imageUrl: null,
    imageAlt: "Peixe na telha com purê de macaxeira",
  },
  {
    slug: "mixto-brasa-e-mar",
    name: "Mixto Brasa & Mar",
    priceCents: 11800,
    description:
      "Carnes variadas, linguiça artesanal, camarão e acompanhamentos.",
    tag: "para-dividir",
    imageUrl: null,
    imageAlt: "Tábua mista de carnes e camarão",
  },
  {
    slug: "moqueca-da-casa",
    name: "Moqueca da Casa",
    priceCents: 9400,
    description: "Peixe e camarão no leite de coco com dendê, pirão e arroz.",
    tag: "mar",
    imageUrl: null,
    imageAlt: "Moqueca de peixe e camarão",
  },
];

/** Fotos avulsas da página. Viram colunas de site_settings na Fase 2. */
export const heroImages = {
  main: { url: null as string | null, alt: "Churrasco na brasa" },
  secondary: { url: null as string | null, alt: "Frutos do mar frescos" },
} as const;

export const buffetImage = {
  url: null as string | null,
  alt: "Buffet montado para evento",
} as const;

/** Conteúdo fixo da seção de buffet — fora do escopo do admin. */
export const buffetOccasions = [
  "Aniversários",
  "Confraternizações",
  "Casamentos",
  "Empresariais",
  "E muito mais",
] as const;

export const buffetFeatures = [
  { numeral: "I", title: "Churrasco de qualidade" },
  { numeral: "II", title: "Churrasqueiro profissional" },
  { numeral: "III", title: "Acompanhamentos variados" },
  { numeral: "IV", title: "Estrutura completa" },
  { numeral: "V", title: "Eventos de todos os tamanhos" },
] as const;

export const locationNote = "Estacionamento na frente · Delivery na região";

/** "R$ 89" quando não há centavos, "R$ 89,50" quando há — como no mockup. */
export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: priceCents % 100 === 0 ? 0 : 2,
  }).format(priceCents / 100);
}
