/**
 * Schemas Zod compartilhados entre os formulários do admin e as escritas.
 *
 * Tudo que chega de um `<form>` vem como string, então os schemas já fazem a
 * conversão (preço em reais → centavos, checkbox → boolean) e devolvem
 * exatamente a forma que `mutations.ts` espera.
 */

import { z } from "zod";

const obrigatorio = "Campo obrigatório";

const texto = (max: number) =>
  z.string().trim().min(1, obrigatorio).max(max, `Máximo de ${max} caracteres`);

const textoOpcional = (max: number) =>
  z.string().trim().max(max, `Máximo de ${max} caracteres`).default("");

/** Checkbox de `<form>` chega como "on" quando marcado e some quando não. */
const checkbox = z.preprocess(
  (value) => value === "on" || value === "true" || value === true,
  z.boolean(),
);

/** URL de imagem já hospedada, ou vazio para "sem foto". */
const imagemUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.url("Informe uma URL válida").nullable().default(null),
);

/** "89", "89,50" e "89.50" viram 8900 e 8950. */
export const precoEmCentavos = z
  .string()
  .trim()
  .min(1, obrigatorio)
  .transform((valor, ctx) => {
    const normalizado = valor.replace(/[R$\s]/g, "").replace(",", ".");
    const numero = Number(normalizado);

    if (!Number.isFinite(numero) || numero < 0) {
      ctx.addIssue({ code: "custom", message: "Preço inválido" });
      return z.NEVER;
    }

    return Math.round(numero * 100);
  });

/** Lista separada por vírgula ("Aniversários, Casamentos") vira array. */
const listaPorVirgula = z
  .string()
  .default("")
  .transform((valor) =>
    valor
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0),
  );

/** Lista de linhas, uma por item — para textareas. */
const listaPorLinha = z
  .string()
  .default("")
  .transform((valor) =>
    valor
      .split("\n")
      .map((linha) => linha.trim())
      .filter((linha) => linha.length > 0),
  );

export const identitySchema = z.object({
  name: texto(120),
  tagline: texto(160),
  kicker: texto(120),
  description: texto(2000),
  heroTitleLine1: texto(80),
  heroTitleLine2: texto(80),
  heroBadge: texto(120),
  heroText: texto(2000),
  heroImageUrl: imagemUrl,
  heroImageAlt: texto(200),
  heroSecondaryImageUrl: imagemUrl,
  heroSecondaryImageAlt: texto(200),
  dishesNote: textoOpcional(300),
  seoKeywords: listaPorVirgula,
  ogImageUrl: texto(500),
  showPrices: checkbox,
});

export const contactSchema = z.object({
  phone: texto(40),
  email: z.union([z.literal(""), z.email("E-mail inválido")]).default(""),
});

export const locationSchema = z.object({
  street: texto(160),
  number: texto(20),
  district: texto(120),
  city: texto(120),
  state: z
    .string()
    .trim()
    .length(2, "Use a sigla de 2 letras (ex.: PI)")
    .transform((uf) => uf.toUpperCase()),
  zip: textoOpcional(20),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  locationNote: textoOpcional(240),
});

export const openingHourSchema = z.object({
  weekday: z.coerce.number().int().min(0).max(6),
  label: texto(20),
  opensAt: textoOpcional(5),
  closesAt: textoOpcional(5),
  closed: checkbox,
});

export const openingHoursSchema = z
  .array(openingHourSchema)
  .length(7, "São necessários os 7 dias da semana")
  .superRefine((dias, ctx) => {
    dias.forEach((dia, indice) => {
      if (dia.closed) return;

      if (!dia.opensAt || !dia.closesAt) {
        ctx.addIssue({
          code: "custom",
          path: [indice],
          message: `${dia.label}: preencha abertura e fechamento ou marque como fechado`,
        });
      }
    });
  });

export const buffetSchema = z.object({
  buffetEyebrow: texto(120),
  buffetBadge: texto(120),
  buffetText: texto(2000),
  buffetFeaturesIntro: textoOpcional(300),
  buffetClosing: textoOpcional(300),
  buffetImageUrl: imagemUrl,
  buffetImageAlt: texto(200),
  occasions: listaPorLinha,
  features: listaPorLinha,
});

export const dishSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, obrigatorio)
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens",
    ),
  name: texto(120),
  priceCents: precoEmCentavos,
  description: texto(1000),
  tag: z.enum(["carnes", "mar", "para-dividir"]),
  imageUrl: imagemUrl,
  imageAlt: textoOpcional(200),
  visible: checkbox,
});

export const newUserSchema = z.object({
  name: texto(120),
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "A senha precisa de pelo menos 8 caracteres"),
});

export const passwordSchema = z
  .object({
    password: z.string().min(8, "A senha precisa de pelo menos 8 caracteres"),
    confirm: z.string(),
  })
  .refine((dados) => dados.password === dados.confirm, {
    path: ["confirm"],
    message: "As senhas não conferem",
  });

export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, obrigatorio),
});

export type IdentityInput = z.infer<typeof identitySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type OpeningHourInput = z.infer<typeof openingHourSchema>;
export type BuffetInput = z.infer<typeof buffetSchema>;
export type DishInput = z.infer<typeof dishSchema>;
export type NewUserInput = z.infer<typeof newUserSchema>;

/**
 * Achata os erros do Zod em `{ campo: "mensagem" }`, mantendo o primeiro erro
 * de cada campo — que é o formato que os formulários do admin consomem.
 *
 * Mora aqui, e não no app, para o Zod continuar sendo dependência só de quem
 * define os schemas.
 */
export function flattenIssues(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const campo = issue.path.join(".") || "_";
    errors[campo] ??= issue.message;
  }

  return errors;
}

/** Gera um slug a partir do nome do prato, para o campo nascer preenchido. */
export function slugify(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
