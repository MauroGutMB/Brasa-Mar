import type { NextConfig } from "next";

/**
 * Origem das fotos enviadas pelo admin, liberada para o next/image.
 *
 * Tudo sai da própria URL do Supabase, inclusive protocolo e porta: o
 * Supabase local roda em http://127.0.0.1:54321 e o `remotePatterns` só casa
 * quando os três batem — fixar https, ou omitir a porta, faz o otimizador
 * responder 400 e a foto não aparecer.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase = supabaseUrl
  ? new URL(supabaseUrl)
  : new URL("https://exemplo.supabase.co");

/**
 * O Next recusa otimizar imagem cujo host resolve para IP privado (proteção
 * contra SSRF). O Supabase rodando na máquina cai exatamente nesse caso, então
 * a exceção vale só aí — em produção o host é público e a proteção continua.
 */
const supabaseLocal = ["localhost", "127.0.0.1", "[::1]"].includes(
  supabase.hostname,
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Os pacotes internos são publicados como código-fonte TS/TSX dentro do
  // monorepo, então o Next precisa transpilá-los.
  transpilePackages: ["@brasamar/ui", "@brasamar/db"],
  // O driver do Postgres não deve ser processado pelo bundler.
  serverExternalPackages: ["postgres"],
  // O conteúdo vem do banco, mas a home continua pré-renderizada: as leituras
  // ficam dentro de `use cache` (ver lib/data.ts) e o admin invalida por tag.
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: supabase.protocol.replace(":", "") as "http" | "https",
        hostname: supabase.hostname,
        port: supabase.port,
        // Só o bucket público: sem isso o otimizador viraria um proxy aberto
        // para qualquer caminho desse host.
        pathname: "/storage/v1/object/public/**",
      },
    ],
    dangerouslyAllowLocalIP: supabaseLocal,
  },
  experimental: {
    serverActions: {
      // O padrão do Next é 1 MB, e foto de celular passa disso fácil. O limite
      // real de 5 MB é validado em lib/storage.ts, com mensagem amigável; a
      // folga aqui existe para a validação ser alcançada em vez de estourar
      // um 413 sem tratamento.
      bodySizeLimit: "6mb",
    },
  },
  poweredByHeader: false,
};

export default nextConfig;
