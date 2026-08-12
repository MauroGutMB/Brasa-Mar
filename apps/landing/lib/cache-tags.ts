/**
 * Tags de cache compartilhadas entre a leitura (`lib/data.ts`) e a escrita
 * (as Server Actions do admin). Qualquer string solta dos dois lados vira um
 * bug silencioso: a página continua servindo conteúdo velho.
 */
export const CACHE_TAGS = {
  settings: "site-settings",
  dishes: "dishes",
  hours: "opening-hours",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
