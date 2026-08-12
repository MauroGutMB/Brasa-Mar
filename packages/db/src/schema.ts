/**
 * Schema do banco do Brasa & Mar.
 *
 * As tabelas espelham os tipos que viviam em `apps/landing/lib/site.ts` —
 * a landing continua lendo a mesma forma de dado, só que agora do Postgres.
 */

import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const dishTagEnum = pgEnum("dish_tag", ["carnes", "mar", "para-dividir"]);

/** Item da lista de ocasiões do buffet ("Aniversários", "Casamentos"…). */
export interface BuffetOccasion {
  label: string;
}

/** Diferencial do buffet, numerado em romano no layout ("I", "II"…). */
export interface BuffetFeature {
  numeral: string;
  title: string;
}

/**
 * Configurações do site — linha única.
 *
 * `id` é fixo em 1 e a checagem `id = 1` vira constraint na migration, para
 * não existir a possibilidade de uma segunda linha divergente.
 */
export const siteSettings = pgTable("site_settings", {
  id: smallint("id").primaryKey().default(1),

  // Identidade
  name: varchar("name", { length: 120 }).notNull(),
  tagline: varchar("tagline", { length: 160 }).notNull(),
  kicker: varchar("kicker", { length: 120 }).notNull(),
  description: text("description").notNull(),

  /**
   * Hero.
   *
   * Os campos de texto livre aceitam marcadores de destaque, interpretados
   * pelo componente `Rich` da landing:
   *   *palavra*   → laranja (brasa)
   *   _palavra_   → azul (mar)
   *   **palavra** → negrito claro
   */
  heroTitleLine1: varchar("hero_title_line1", { length: 80 }).notNull(),
  heroTitleLine2: varchar("hero_title_line2", { length: 80 }).notNull(),
  heroBadge: varchar("hero_badge", { length: 120 }).notNull(),
  heroText: text("hero_text").notNull(),
  heroImageUrl: text("hero_image_url"),
  heroImageAlt: varchar("hero_image_alt", { length: 200 }).notNull(),
  heroSecondaryImageUrl: text("hero_secondary_image_url"),
  heroSecondaryImageAlt: varchar("hero_secondary_image_alt", {
    length: 200,
  }).notNull(),

  // Cardápio
  dishesNote: text("dishes_note").notNull().default(""),

  // Buffet
  buffetEyebrow: varchar("buffet_eyebrow", { length: 120 }).notNull(),
  buffetBadge: varchar("buffet_badge", { length: 120 }).notNull(),
  buffetText: text("buffet_text").notNull(),
  buffetFeaturesIntro: text("buffet_features_intro").notNull().default(""),
  buffetClosing: text("buffet_closing").notNull().default(""),
  buffetImageUrl: text("buffet_image_url"),
  buffetImageAlt: varchar("buffet_image_alt", { length: 200 }).notNull(),
  buffetOccasions: jsonb("buffet_occasions")
    .$type<BuffetOccasion[]>()
    .notNull()
    .default([]),
  buffetFeatures: jsonb("buffet_features")
    .$type<BuffetFeature[]>()
    .notNull()
    .default([]),

  // Contato
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().default(""),

  // Endereço
  street: varchar("street", { length: 160 }).notNull(),
  number: varchar("number", { length: 20 }).notNull(),
  district: varchar("district", { length: 120 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zip: varchar("zip", { length: 20 }).notNull().default(""),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  locationNote: varchar("location_note", { length: 240 }).notNull().default(""),

  // SEO
  seoKeywords: jsonb("seo_keywords").$type<string[]>().notNull().default([]),
  ogImageUrl: text("og_image_url").notNull().default("/og.jpg"),

  // Flags
  showPrices: boolean("show_prices").notNull().default(true),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Horários de funcionamento — uma linha por dia da semana.
 *
 * `weekday` segue `Date#getDay`: 0 = domingo … 6 = sábado.
 */
export const openingHours = pgTable("opening_hours", {
  weekday: smallint("weekday").primaryKey(),
  label: varchar("label", { length: 20 }).notNull(),
  opensAt: varchar("opens_at", { length: 5 }).notNull().default(""),
  closesAt: varchar("closes_at", { length: 5 }).notNull().default(""),
  closed: boolean("closed").notNull().default(false),
});

export const dishes = pgTable("dishes", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  priceCents: integer("price_cents").notNull(),
  description: text("description").notNull(),
  tag: dishTagEnum("tag").notNull(),
  imageUrl: text("image_url"),
  imageAlt: varchar("image_alt", { length: 200 }).notNull().default(""),
  /** Ordem de exibição no cardápio; menor aparece primeiro. */
  position: integer("position").notNull().default(0),
  /** Esconde o prato sem apagar (ex.: acabou o camarão). */
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Perfil dos administradores.
 *
 * A autenticação em si (senha, sessão) fica com o Supabase Auth, em
 * `auth.users`. Esta tabela guarda só o que a UI precisa mostrar e é o que
 * define quem tem acesso ao painel — um usuário sem linha aqui não entra.
 */
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 160 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type SiteSettingsUpdate = Partial<typeof siteSettings.$inferInsert>;
export type OpeningHour = typeof openingHours.$inferSelect;
export type Dish = typeof dishes.$inferSelect;
export type NewDish = typeof dishes.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type DishTag = Dish["tag"];
