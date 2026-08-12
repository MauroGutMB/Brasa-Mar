import "server-only";

import { createSupabaseAdminClient } from "@/lib/auth/supabase";

/**
 * Upload de imagens para o Supabase Storage.
 *
 * O bucket é público para leitura (as fotos aparecem no site) e só o servidor
 * escreve, usando a service role key. Quem chama já passou por `requireAdmin()`.
 */

export const BUCKET = "fotos";

const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const TAMANHO_MAXIMO = 5 * 1024 * 1024;

export interface UploadResult {
  url: string;
  path: string;
}

export class UploadError extends Error {}

/**
 * Valida e envia o arquivo, devolvendo a URL pública.
 *
 * O nome recebe um sufixo de tempo porque o bucket é cacheado por CDN:
 * reaproveitar o mesmo caminho faria a foto velha continuar aparecendo.
 */
export async function uploadImagem(
  file: File,
  prefixo: string,
): Promise<UploadResult> {
  if (!TIPOS_ACEITOS.includes(file.type)) {
    throw new UploadError(
      "Formato não aceito. Envie uma imagem JPG, PNG, WebP ou AVIF.",
    );
  }

  if (file.size > TAMANHO_MAXIMO) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new UploadError(`A imagem tem ${mb} MB — o limite é 5 MB.`);
  }

  const extensao = file.type.replace("image/", "").replace("jpeg", "jpg");
  const caminho = `${prefixo}-${Date.now()}.${extensao}`;

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new UploadError(`Falha ao enviar a imagem: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(caminho);

  return { url: publicUrl, path: caminho };
}

/**
 * Remove a foto antiga depois de trocar por outra.
 *
 * Falha aqui não é motivo para desfazer a troca — o pior caso é um arquivo
 * órfão no bucket —, então o erro só é registrado.
 */
export async function removerImagem(url: string | null): Promise<void> {
  if (!url) return;

  const marcador = `/${BUCKET}/`;
  const indice = url.indexOf(marcador);

  // URL de fora do nosso bucket (ex.: colada à mão): não é nossa para apagar.
  if (indice === -1) return;

  const caminho = url.slice(indice + marcador.length);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([caminho]);

  if (error) {
    console.warn(`Não foi possível remover ${caminho} do bucket:`, error.message);
  }
}

/** `true` quando o campo de arquivo veio vazio no formulário. */
export function arquivoVazio(valor: FormDataEntryValue | null): boolean {
  return !(valor instanceof File) || valor.size === 0;
}

/**
 * Resolve a foto a partir do que veio do formulário.
 *
 * Três caminhos: enviou arquivo novo (sobe e descarta o antigo), marcou
 * "remover foto" (limpa) ou não mexeu (mantém o que está). Usado pelos pratos
 * e pelo buffet — os campos do formulário têm os mesmos nomes nos dois.
 *
 * @param prefixo caminho dentro do bucket, sem extensão (ex.: "pratos/moqueca")
 * @param atual   URL que está salva hoje, para poder apagar o arquivo trocado
 */
export async function resolverFoto(
  formData: FormData,
  prefixo: string,
  atual: string | null,
  campo = "foto",
): Promise<string | null> {
  const arquivo = formData.get(campo);

  if (!arquivoVazio(arquivo)) {
    const { url } = await uploadImagem(arquivo as File, prefixo);
    await removerImagem(atual);
    return url;
  }

  if (formData.get(`remover-${campo}`) === "on") {
    await removerImagem(atual);
    return null;
  }

  return atual;
}
