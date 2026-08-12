/**
 * Derivações do conteúdo do site.
 *
 * Os dados em si vivem no Postgres (ver `@brasamar/db`) e chegam aqui por
 * parâmetro — este arquivo não guarda estado nem consulta nada, só transforma.
 * Tudo que é editável pelo admin passou a ser coluna; o que sobrou aqui é
 * cálculo que não faz sentido guardar duplicado no banco.
 */

import type { OpeningHour, SiteSettings } from "@brasamar/db";

/** Só a URL canônica continua vindo do ambiente: é config de deploy, não conteúdo. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brasaemar.com.br";

export const locale = "pt_BR";

type Endereco = Pick<
  SiteSettings,
  "street" | "number" | "district" | "city" | "state" | "lat" | "lng"
>;

/** Link do WhatsApp derivado do telefone — não guardar duplicado. */
export function whatsappLink(phone: string): string {
  return `https://wa.me/55${phone.replace(/\D/g, "")}`;
}

/** Telefone só com dígitos, no formato E.164 que o JSON-LD espera. */
export function phoneE164(phone: string): string {
  return `+55${phone.replace(/\D/g, "")}`;
}

export function addressLine(endereco: Endereco): string {
  return `${endereco.street}, ${endereco.number} — ${endereco.district}`;
}

export function cityLine(endereco: Endereco): string {
  return `${endereco.city} — ${endereco.state}`;
}

/** bbox de ~0.08° em volta do ponto, como no mockup. */
export function mapEmbedUrl(endereco: Pick<Endereco, "lat" | "lng">): string {
  const { lat, lng } = endereco;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.042}%2C${
    lat - 0.027
  }%2C${lng + 0.042}%2C${lat + 0.033}&layer=mapnik&marker=${lat}%2C${lng}`;
}

/** "R$ 89" quando não há centavos, "R$ 89,50" quando há — como no mockup. */
export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: priceCents % 100 === 0 ? 0 : 2,
  }).format(priceCents / 100);
}

/** "11:00" → "11h", "11:30" → "11h30" — o formato curto que o layout usa. */
function formatHour(hora: string): string {
  const [h, m] = hora.split(":");
  return m && m !== "00" ? `${Number(h)}h${m}` : `${Number(h)}h`;
}

function faixa(dia: OpeningHour): string {
  return dia.closed
    ? "Fechado"
    : `${formatHour(dia.opensAt)} — ${formatHour(dia.closesAt)}`;
}

export interface HoursGroup {
  days: string;
  hours: string;
  closed: boolean;
}

/**
 * Agrupa dias consecutivos com o mesmo horário — "Terça a sexta 11h — 22h".
 *
 * Antes era uma lista escrita à mão; como agora cada dia é editável no admin,
 * o agrupamento tem que ser calculado, senão o resumo mente.
 *
 * Os dias fechados vão para o fim da lista, como no layout original: quem lê
 * quer primeiro saber quando o restaurante abre.
 */
export function groupHours(hours: OpeningHour[]): HoursGroup[] {
  const grupos: { dias: string[]; hours: string; closed: boolean }[] = [];

  for (const dia of hours) {
    const atual = faixa(dia);
    const ultimo = grupos.at(-1);

    if (ultimo && ultimo.hours === atual) {
      ultimo.dias.push(dia.label);
      continue;
    }

    grupos.push({ dias: [dia.label], hours: atual, closed: dia.closed });
  }

  const rotular = (dias: string[]): string => {
    const primeiro = dias[0]!;
    const ultimo = dias.at(-1)!.toLowerCase();

    if (dias.length === 1) return primeiro;
    // Dois dias soltos ficam melhor com "e": "Sábado e domingo".
    if (dias.length === 2) return `${primeiro} e ${ultimo}`;
    return `${primeiro} a ${ultimo}`;
  };

  return [
    ...grupos.filter((grupo) => !grupo.closed),
    ...grupos.filter((grupo) => grupo.closed),
  ].map((grupo) => ({
    days: rotular(grupo.dias),
    hours: grupo.hours,
    closed: grupo.closed,
  }));
}

export interface HoursSummary {
  range: string;
  days: string;
}

/**
 * Resumo curto do hero: a faixa mais ampla de atendimento e em que dias o
 * restaurante abre.
 */
export function summarizeHours(hours: OpeningHour[]): HoursSummary {
  const abertos = hours.filter((dia) => !dia.closed);

  if (abertos.length === 0) {
    return { range: "Fechado", days: "Consulte pelo WhatsApp" };
  }

  const abre = abertos.reduce(
    (menor, dia) => (dia.opensAt < menor ? dia.opensAt : menor),
    abertos[0]!.opensAt,
  );
  const fecha = abertos.reduce(
    (maior, dia) => (dia.closesAt > maior ? dia.closesAt : maior),
    abertos[0]!.closesAt,
  );

  const primeiro = abertos[0]!.label;
  const ultimo = abertos.at(-1)!.label;
  const days =
    abertos.length === hours.length
      ? "Todos os dias"
      : abertos.length === 1
        ? primeiro
        : `${primeiro} a ${ultimo.toLowerCase()}`;

  return { range: `${formatHour(abre)} — ${formatHour(fecha)}`, days };
}

/** Horário no formato "11:00-22:00" que o schema.org espera. */
export function schemaHours(hours: OpeningHour[]) {
  const dias = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return hours
    .filter((dia) => !dia.closed)
    .map((dia) => ({
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: dias[dia.weekday],
      opens: dia.opensAt,
      closes: dia.closesAt,
    }));
}

/**
 * Estilo do selo de categoria no card do prato.
 *
 * A cor vem do banco como hex, então é aplicada inline: classe montada em
 * tempo de execução (`bg-${cor}`) não existiria no CSS, porque o Tailwind
 * extrai as classes estaticamente durante o build.
 *
 * O texto sai um pouco mais claro que o fundo do selo — é o que o mockup fazia
 * com `brasa-400` sobre `brasa-500/20`, e o que mantém a leitura no tema
 * escuro quando o dono escolhe uma cor fechada.
 */
export function categoryBadgeStyle(color: string): {
  backgroundColor: string;
  color: string;
} {
  return {
    backgroundColor: comAlfa(color, 0.2),
    color: clarear(color, 0.25),
  };
}

function canal(hex: string, inicio: number): number {
  return Number.parseInt(hex.slice(inicio, inicio + 2), 16);
}

function comAlfa(hex: string, alfa: number): string {
  const [r, g, b] = [canal(hex, 1), canal(hex, 3), canal(hex, 5)];
  return `rgb(${r} ${g} ${b} / ${alfa})`;
}

/** Aproxima a cor do branco na proporção dada. */
function clarear(hex: string, quanto: number): string {
  const mistura = (valor: number) =>
    Math.round(valor + (255 - valor) * quanto);

  const r = mistura(canal(hex, 1));
  const g = mistura(canal(hex, 3));
  const b = mistura(canal(hex, 5));

  return `rgb(${r} ${g} ${b})`;
}

/** Legenda do placeholder enquanto a foto do prato não foi enviada. */
export function dishCaption(nome: string): string {
  return `Foto — ${nome.toLowerCase()}`;
}
