/**
 * Popula o banco com o conteúdo que hoje está hardcoded na landing.
 *
 * É o que torna a migração verificável: depois do seed, a página tem que ficar
 * idêntica à versão que lia de `apps/landing/lib/site.ts`.
 *
 * Rodar com: pnpm --filter @brasamar/db db:seed
 * É idempotente — pode rodar quantas vezes quiser.
 */

import { db, sql } from "./client";
import { dishCategories, dishes, openingHours, siteSettings } from "./schema";

const settings = {
  id: 1,
  name: "Brasa & Mar",
  tagline: "Churrasco & frutos do mar",
  kicker: "Ponto de alimentação",
  description:
    "Churrasco na brasa e frutos do mar frescos em Teresina. Carnes no ponto certo, camarão, peixes e moqueca, com buffet completo para eventos.",

  heroTitleLine1: "Do fogo",
  heroTitleLine2: "ao *sal* do _mar_",
  heroBadge: "Churrasco & frutos do mar",
  heroText:
    "Carnes na brasa no ponto certo, frutos do mar frescos e acompanhamentos que fazem a refeição virar memória. Almoço, jantar e buffet para eventos.",
  heroImageUrl: null,
  heroImageAlt: "Churrasco na brasa",
  heroSecondaryImageUrl: null,
  heroSecondaryImageAlt: "Frutos do mar frescos",

  dishesNote:
    "Porções servem de 1 a 2 pessoas. Peça no balcão ou pelo WhatsApp para retirada.",

  buffetEyebrow: "Temos serviços de",
  buffetBadge: "Para eventos",
  buffetText:
    "Vai se reunir e precisa de um **buffet completo de qualidade**, com atendimento de excelência? Cuidamos de tudo para você aproveitar cada momento.",
  buffetFeaturesIntro: "Cuidamos de tudo para *você aproveitar cada momento*",
  buffetClosing:
    "Do detalhe ao sabor, a gente faz do seu evento *algo inesquecível*.",
  buffetImageUrl: null,
  buffetImageAlt: "Buffet montado para evento",
  buffetOccasions: [
    { label: "Aniversários" },
    { label: "Confraternizações" },
    { label: "Casamentos" },
    { label: "Empresariais" },
    { label: "E muito mais" },
  ],
  buffetFeatures: [
    { numeral: "I", title: "Churrasco de qualidade" },
    { numeral: "II", title: "Churrasqueiro profissional" },
    { numeral: "III", title: "Acompanhamentos variados" },
    { numeral: "IV", title: "Estrutura completa" },
    { numeral: "V", title: "Eventos de todos os tamanhos" },
  ],

  phone: "86 99437-0852",
  email: "",

  // TODO(admin): endereço e coordenadas vieram como placeholder do mockup.
  street: "Av. Principal",
  number: "000",
  district: "Centro",
  city: "Teresina",
  state: "PI",
  zip: "",
  lat: -5.089,
  lng: -42.801,
  locationNote: "Estacionamento na frente · Delivery na região",

  seoKeywords: [
    "churrascaria em Teresina",
    "restaurante de frutos do mar",
    "peixe na brasa",
    "camarão",
    "buffet para eventos",
    "churrasco para eventos Teresina",
    "Brasa & Mar",
  ],
  ogImageUrl: "/og.jpg",
  showPrices: true,
};

/** `weekday` segue `Date#getDay`: 0 = domingo. */
const horarios = [
  { weekday: 1, label: "Segunda", opensAt: "", closesAt: "", closed: true },
  { weekday: 2, label: "Terça", opensAt: "11:00", closesAt: "22:00", closed: false },
  { weekday: 3, label: "Quarta", opensAt: "11:00", closesAt: "22:00", closed: false },
  { weekday: 4, label: "Quinta", opensAt: "11:00", closesAt: "22:00", closed: false },
  { weekday: 5, label: "Sexta", opensAt: "11:00", closesAt: "22:00", closed: false },
  { weekday: 6, label: "Sábado", opensAt: "11:00", closesAt: "23:00", closed: false },
  { weekday: 0, label: "Domingo", opensAt: "11:00", closesAt: "23:00", closed: false },
];

/** Cores originais do mockup, que estavam escritas no componente do card. */
const categorias = [
  { name: "Carnes", color: "#e2571f", position: 0 },
  { name: "Mar", color: "#4e8cb4", position: 1 },
  { name: "Para dividir", color: "#f2ebdd", position: 2 },
];

const pratos = [
  {
    slug: "picanha-na-brasa",
    name: "Picanha na Brasa",
    priceCents: 8900,
    description:
      "Picanha fatiada no ponto, farofa de alho, vinagrete e pão de alho.",
    categoria: "Carnes",
    imageUrl: null,
    imageAlt: "Picanha fatiada na brasa",
    position: 0,
    visible: true,
  },
  {
    slug: "camarao-ao-alho",
    name: "Camarão ao Alho",
    priceCents: 7600,
    description:
      "Camarões salteados na manteiga de garrafa com limão e arroz cremoso.",
    categoria: "Mar",
    imageUrl: null,
    imageAlt: "Camarão ao alho com arroz cremoso",
    position: 1,
    visible: true,
  },
  {
    slug: "costela-no-bafo",
    name: "Costela no Bafo",
    priceCents: 8200,
    description:
      "Doze horas de brasa lenta, mandioca frita e molho de pimenta da casa.",
    categoria: "Carnes",
    imageUrl: null,
    imageAlt: "Costela assada no bafo com mandioca frita",
    position: 2,
    visible: true,
  },
  {
    slug: "peixe-na-telha",
    name: "Peixe na Telha",
    priceCents: 6800,
    description:
      "Filé grelhado com legumes, purê de macaxeira e molho de maracujá.",
    categoria: "Mar",
    imageUrl: null,
    imageAlt: "Peixe na telha com purê de macaxeira",
    position: 3,
    visible: true,
  },
  {
    slug: "mixto-brasa-e-mar",
    name: "Mixto Brasa & Mar",
    priceCents: 11800,
    description:
      "Carnes variadas, linguiça artesanal, camarão e acompanhamentos.",
    categoria: "Para dividir",
    imageUrl: null,
    imageAlt: "Tábua mista de carnes e camarão",
    position: 4,
    visible: true,
  },
  {
    slug: "moqueca-da-casa",
    name: "Moqueca da Casa",
    priceCents: 9400,
    description: "Peixe e camarão no leite de coco com dendê, pirão e arroz.",
    categoria: "Mar",
    imageUrl: null,
    imageAlt: "Moqueca de peixe e camarão",
    position: 5,
    visible: true,
  },
];

async function seed(): Promise<void> {
  await db
    .insert(siteSettings)
    .values(settings)
    .onConflictDoUpdate({ target: siteSettings.id, set: settings });

  for (const dia of horarios) {
    await db
      .insert(openingHours)
      .values(dia)
      .onConflictDoUpdate({ target: openingHours.weekday, set: dia });
  }

  // As categorias precisam existir antes dos pratos, que apontam para elas.
  //
  // Só são criadas quando a tabela está vazia: a partir da primeira execução
  // elas passam a ser do dono, que pode renomear e recolorir. Recriar pelo
  // nome faria um "Carnes" renomeado virar duplicata a cada seed.
  const existentes = await db.select().from(dishCategories);

  const categoriasNoBanco = existentes.length
    ? existentes
    : await db.insert(dishCategories).values(categorias).returning();

  const idPorNome = new Map(categoriasNoBanco.map((c) => [c.name, c.id]));
  const primeira = categoriasNoBanco[0]?.id;

  if (!primeira) {
    throw new Error("Nenhuma categoria disponível para associar aos pratos.");
  }

  for (const { categoria, ...prato } of pratos) {
    // Categoria renomeada pelo dono: o prato vai para a primeira da lista em
    // vez de o seed falhar.
    const categoryId = idPorNome.get(categoria) ?? primeira;

    // `imageUrl` fica de fora do update: rodar o seed de novo não pode apagar
    // uma foto que já foi enviada pelo admin.
    const { imageUrl: _imageUrl, ...semFoto } = prato;

    await db
      .insert(dishes)
      .values({ ...prato, categoryId })
      .onConflictDoUpdate({
        target: dishes.slug,
        set: { ...semFoto, categoryId },
      });
  }

  console.warn(
    `Seed concluído: 1 configuração, ${horarios.length} horários, ${categorias.length} categorias, ${pratos.length} pratos.`,
  );
}

seed()
  .then(() => sql.end())
  .then(() => process.exit(0))
  .catch((erro: unknown) => {
    console.error("Falha no seed:", erro);
    void sql.end();
    process.exit(1);
  });
